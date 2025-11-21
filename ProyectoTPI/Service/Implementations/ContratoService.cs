using Inmobiliaria.Models;
using Inmobiliaria.Repository.Interfaces;
using Inmobiliaria.Service.Interfaces;

namespace Inmobiliaria.Service.Implementations
{
    public class ContratoService : IContratoService
    {
        private readonly IContratoRepository _contratoRepository;
        private readonly Propiedades_InmobiliariasContext _context;

        public ContratoService(
            IContratoRepository contratoRepository,
            Propiedades_InmobiliariasContext context)
        {
            _contratoRepository = contratoRepository;
            _context = context;
        }

        public async Task<Contrato> CrearContratoAsync(Contrato contrato)
        {   if (!_context.Propietarios.Any(p => p.IdPropietario == contrato.IdPropietario))
                throw new Exception($"No existe propietario con ID {contrato.IdPropietario}");

            if (!_context.Inquilinos.Any(i => i.IdInquilino == contrato.IdInquilino))
                throw new Exception($"No existe inquilino con ID {contrato.IdInquilino}");

            if (!_context.Inmuebles.Any(i => i.IdInmueble == contrato.IdInmueble))
                throw new Exception($"No existe inmueble con ID {contrato.IdInmueble}");

            return await _contratoRepository.CrearContratoAsync(contrato);
        }

        public Task<Contrato?> ObtenerPorIdAsync(int id)
        {
            return _contratoRepository.ObtenerPorIdAsync(id);
        }

        
        public async Task<IEnumerable<Contrato>> ObtenerTodosAsync()
        {
            return await _contratoRepository.ObtenerTodosAsync();
        }

        public async Task ActualizarContratoAsync(Contrato contrato)
        {

            await _contratoRepository.ActualizarContratoAsync(contrato);
        }

        public async Task EliminarContratoAsync(int id)
        {
            await _contratoRepository.EliminarContratoAsync(id);
        }
    }
}