using Inmobiliaria.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Inmobiliaria.Repository.Interfaces
{
    public interface IInquilinosRepository
    {
        // ==========================
        // Dashboard / Buscador
        // ==========================

        List<object> ObtenerInquilinosConDeudaSinPagoDelMes();
        List<object> ObtenerRecibosUltimosTresMeses();
        List<Dictionary<string, object>> EjecutarBusquedaDinamica(string textoBuscado, string nombreTabla);
        int ObtenerInquilinosSinDeuda();
        List<object> ObtenerInmueblesPorLocalidad();
        List<object> ObtenerVentasPorLocalidad();
        List<object> ObtenerComisionesPorVendedor();

        // ==========================
        // CRUD estándar
        // ==========================

        Task<List<Inquilino>> GetAllAsync();
        Task<Inquilino?> GetByIdAsync(int id);
        Task<Inquilino> AddAsync(Inquilino inquilino);
        Task<bool> UpdateAsync(Inquilino inquilino);
        Task<bool> DeleteAsync(int id);
    }
}
