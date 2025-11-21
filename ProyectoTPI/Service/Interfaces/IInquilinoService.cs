using Inmobiliaria.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Inmobiliaria.Service.Interfaces
{
    public interface IInquilinoService
    {
        // Dashboard / buscador
        List<object> ObtenerInquilinosConDeudaSinPagoDelMes();
        List<object> ObtenerRecibosUltimosTresMeses();
        List<Dictionary<string, object>> EjecutarBusquedaDinamica(string textoBuscado, string nombreTabla);
        int ObtenerInquilinosSinDeuda();
        List<object> ObtenerInmueblesPorLocalidad();
        List<object> ObtenerVentasPorLocalidad();
        List<object> ObtenerComisionesPorVendedor();
        bool CrearInquilino(Inquilino inquilino);

        // CRUD
        Task<List<Inquilino>> GetAllAsync();
        Task<Inquilino?> GetByIdAsync(int id);
        Task<Inquilino> AddAsync(Inquilino inquilino);
        Task<bool> UpdateAsync(int id, Inquilino inquilino);
        Task<bool> DeleteAsync(int id);
    }
}
