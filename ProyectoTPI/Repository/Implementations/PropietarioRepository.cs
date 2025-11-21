using Inmobiliaria.Models;
using Microsoft.EntityFrameworkCore;
using Inmobiliaria.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using System.Collections.Generic;
using System.Threading.Tasks;

public class PropietarioRepository : IPropietarioRepository
{
    private readonly Propiedades_InmobiliariasContext _context;

    public PropietarioRepository(Propiedades_InmobiliariasContext context)
    {
        _context = context;
    }

    // ==========================
    // CRUD estándar
    // ==========================

    public async Task<List<Propietario>> GetAllAsync()
    {
        return await _context.Propietarios.ToListAsync();
    }

    public async Task<Propietario?> GetByIdAsync(int id)
    {
        return await _context.Propietarios
                             .FirstOrDefaultAsync(i => i.IdPropietario == id);
    }

    public async Task<Propietario> AddAsync(Propietario propietario)
    {
        _context.Propietarios.Add(propietario);
        await _context.SaveChangesAsync();
        return propietario;
    }

    public async Task<bool> UpdateAsync(Propietario propietario)
    {
        var existe = await _context.Propietarios
                                   .AnyAsync(i => i.IdPropietario == propietario.IdPropietario);

        if (!existe)
            return false;

        _context.Propietarios.Update(propietario);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var entity = await _context.Propietarios.FindAsync(id);
        if (entity == null)
            return false;

        _context.Propietarios.Remove(entity);
        await _context.SaveChangesAsync();
        return true;
    }
}
