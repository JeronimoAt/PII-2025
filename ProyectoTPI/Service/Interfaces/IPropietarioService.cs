using Inmobiliaria.Models;

public interface IPropietarioService
{
    Task<List<Propietario>> GetAllAsync();
    Task<Propietario?> GetByIdAsync(int id);
    Task<Propietario> AddAsync(Propietario propietario);
    Task<bool> UpdateAsync(int id, Propietario propietario);
    Task<bool> DeleteAsync(int id);
}
