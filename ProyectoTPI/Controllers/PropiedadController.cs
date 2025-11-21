using Inmobiliaria.Models;
using Inmobiliaria.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Inmobiliaria.Repository.Implementations.PropiedadRepository;

namespace Inmobiliaria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class PropiedadController : ControllerBase
    {
        private readonly IPropiedadService _propiedadService;
        private readonly Propiedades_InmobiliariasContext _context;

        public PropiedadController(
            IPropiedadService propiedadService,
            Propiedades_InmobiliariasContext context)
        {
            _propiedadService = propiedadService;
            _context = context;
        }

        // GET: api/Propiedad
        [HttpGet]
        public IActionResult ObtenerInmueblesSinAlquileresRecientes()
        {
            List<InmuebleAlquilerDto> propiedadList =
                _propiedadService.ObtenerInmueblesSinAlquileresRecientes();

            return Ok(propiedadList);
        }

        // GET: api/Propiedad/Buscar?texto=...
        [HttpGet("Buscar")]
        public IActionResult BuscarInmuebles([FromQuery] string texto)
        {
            if (string.IsNullOrWhiteSpace(texto))
                return Ok(new List<object>());

            var datos =
                (from i in _context.Inmuebles
                 join di in _context.DetallesInmuebles on i.IdInmueble equals di.IdInmueble
                 join d in _context.Direcciones on di.IdDireccion equals d.IdDireccion
                 join b in _context.Barrios on d.IdBarrio equals b.IdBarrio
                 join l in _context.Localidades on b.Localidad equals l.IdLocalidad
                 where (d.Calle + " " + d.Numeracion).Contains(texto)
                    || i.NombreInmueble.Contains(texto)
                 select new
                 {
                     id = i.IdInmueble,
                     direccion = d.Calle + " " + d.Numeracion + ", " + l.Localidad
                 })
                 .Take(20)
                 .ToList();

            return Ok(datos);
        }
    }
}
