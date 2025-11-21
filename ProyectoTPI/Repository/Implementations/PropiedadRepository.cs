using Inmobiliaria.Models;
using Inmobiliaria.Repository.Interfaces;

namespace Inmobiliaria.Repository.Implementations
{
    public class PropiedadRepository : IPropiedadRepository
    {
        private Propiedades_InmobiliariasContext _context;

        public PropiedadRepository(Propiedades_InmobiliariasContext context)
        {
            _context = context;
        }

        public List<InmuebleAlquilerDto> ObtenerInmueblesSinAlquileresRecientes()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Now);
            var fechaInicio = DateOnly.FromDateTime(DateTime.Now.AddMonths(-2));

            var datos = (
                from dr in _context.DetallesRecibos
                join r in _context.Recibos on dr.NroRecibo equals r.NroRecibo
                join di in _context.DetallesInmuebles on r.IdDetalleInmueble equals di.IdDetalleInmueble
                join i in _context.Inmuebles on di.IdInmueble equals i.IdInmueble
                join p in _context.Propietarios on i.IdPropietario equals p.IdPropietario
                join d in _context.Direcciones on di.IdDireccion equals d.IdDireccion
                join b in _context.Barrios on d.IdBarrio equals b.IdBarrio
                join l in _context.Localidades on b.Localidad equals l.IdLocalidad
                select new
                {
                    r.Fecha,
                    i.NombreInmueble,
                    PropietarioNombre = p.Nombre,
                    PropietarioApellido = p.Apellido,
                    DireccionCalle = d.Calle,
                    DireccionNumeracion = d.Numeracion,
                    Localidad = l.IdLocalidad
                }
            ).AsEnumerable() 
            .ToList();

            
            var resultado = datos
                .GroupBy(x => new
                {
                    x.NombreInmueble,
                    x.PropietarioNombre,
                    x.PropietarioApellido,
                    x.DireccionCalle,
                    x.DireccionNumeracion,
                    x.Localidad
                })
                .Select(g =>
                {
                    var ultimoAlquiler = g.Max(x => x.Fecha);
                    var pagosUltimos2Meses = g.Count(x => x.Fecha >= fechaInicio && x.Fecha < hoy);

                    return new InmuebleAlquilerDto
                    {
                        Inmueble = g.Key.NombreInmueble,
                        Propietario = g.Key.PropietarioNombre + " " + g.Key.PropietarioApellido,
                        Direccion = g.Key.DireccionCalle + " " + g.Key.DireccionNumeracion + ", " + g.Key.Localidad,
                        UltimoAlquiler = ultimoAlquiler,
                        
                    };
                })
                .Where(x => x.UltimoAlquiler < fechaInicio) 
                .OrderBy(x => x.Inmueble)
                .ToList();

            return resultado;
        }

        public class InmuebleAlquilerDto
        {
            public string Inmueble { get; set; } = null!;
            public string Propietario { get; set; } = null!;
            public string Direccion { get; set; } = null!;
            public DateOnly? UltimoAlquiler { get; set; }
        }
    }
}
