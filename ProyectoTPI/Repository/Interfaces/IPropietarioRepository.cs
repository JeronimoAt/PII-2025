using Inmobiliaria.Models;

public interface IPropietarioRepository
{
    Task<List<Propietario>> GetAllAsync();
    Task<Propietario?> GetByIdAsync(int id);
    Task<Propietario> AddAsync(Propietario propietario);
    Task<bool> UpdateAsync(Propietario propietario);
    Task<bool> DeleteAsync(int id);
}