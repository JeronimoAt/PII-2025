using Inmobiliaria.Models;
using Inmobiliaria.Repository.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace Inmobiliaria.Repository.Implementations
{
    public class ContratoRepository : IContratoRepository
    {
        private readonly Propiedades_InmobiliariasContext _context;

        public ContratoRepository(Propiedades_InmobiliariasContext context)
        {
            _context = context;
        }

        public async Task<Contrato> CrearContratoAsync(Contrato contrato)
        {
            _context.Contratos.Add(contrato);
            await _context.SaveChangesAsync();
            return contrato;
        }

        public async Task<Contrato?> ObtenerPorIdAsync(int id)
        {
            return await _context.Contratos
                .Include(c => c.IdPropietarioNavigation)
                .Include(c => c.IdInquilinoNavigation)
                .Include(c => c.IdInmuebleNavigation)
                .FirstOrDefaultAsync(c => c.IdContrato == id);
        }


        public async Task<IEnumerable<Contrato>> ObtenerTodosAsync()
        {
            return await _context.Contratos
                .Include(c => c.IdPropietarioNavigation)
                .Include(c => c.IdInquilinoNavigation)
                .Include(c => c.IdInmuebleNavigation)
                .ToListAsync();
        }

        public async Task ActualizarContratoAsync(Contrato contrato)
        {

            _context.Contratos.Update(contrato);
            await _context.SaveChangesAsync();
        }

        public async Task EliminarContratoAsync(int id)
        {
            var contrato = await _context.Contratos.FindAsync(id);
            if (contrato == null)
                return;

            _context.Contratos.Remove(contrato);
            await _context.SaveChangesAsync();
        }
    }
}