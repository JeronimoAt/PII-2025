using Inmobiliaria.Models;
using Inmobiliaria.Repository.Interfaces;
using Inmobiliaria.Service.Interfaces;

namespace Inmobiliaria.Service.Implementations
{
    public class InquilinoService : IInquilinoService
    {
        private readonly IInquilinosRepository _inquilinoRepository;

        public InquilinoService(IInquilinosRepository inquilinoRepository)
        {
            _inquilinoRepository = inquilinoRepository;
        }

        // Dashboard / Buscador
        public List<object> ObtenerInquilinosConDeudaSinPagoDelMes()
            => _inquilinoRepository.ObtenerInquilinosConDeudaSinPagoDelMes();

        public List<object> ObtenerRecibosUltimosTresMeses()
            => _inquilinoRepository.ObtenerRecibosUltimosTresMeses();

        public List<Dictionary<string, object>> EjecutarBusquedaDinamica(string textoBuscado, string tabla)
            => _inquilinoRepository.EjecutarBusquedaDinamica(textoBuscado, tabla);

        public int ObtenerInquilinosSinDeuda()
            => _inquilinoRepository.ObtenerInquilinosSinDeuda();

        public List<object> ObtenerInmueblesPorLocalidad()
            => _inquilinoRepository.ObtenerInmueblesPorLocalidad();

        public List<object> ObtenerVentasPorLocalidad()
            => _inquilinoRepository.ObtenerVentasPorLocalidad();

        public List<object> ObtenerComisionesPorVendedor()
            => _inquilinoRepository.ObtenerComisionesPorVendedor();

        // Alta simple desde modal
        public bool CrearInquilino(Inquilino inquilino)
        {
            if (string.IsNullOrWhiteSpace(inquilino.Nombre) ||
                string.IsNullOrWhiteSpace(inquilino.Apellido))
                return false;

            _inquilinoRepository.AddAsync(inquilino).Wait();
            return true;
        }

        // CRUD
        public Task<List<Inquilino>> GetAllAsync()
            => _inquilinoRepository.GetAllAsync();

        public Task<Inquilino?> GetByIdAsync(int id)
            => _inquilinoRepository.GetByIdAsync(id);

        public Task<Inquilino> AddAsync(Inquilino inquilino)
            => _inquilinoRepository.AddAsync(inquilino);

        public async Task<bool> UpdateAsync(int id, Inquilino inquilino)
        {
            inquilino.IdInquilino = id;
            return await _inquilinoRepository.UpdateAsync(inquilino);
        }

        public Task<bool> DeleteAsync(int id)
            => _inquilinoRepository.DeleteAsync(id);
    }
}
