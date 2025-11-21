using Inmobiliaria.Models;
using Inmobiliaria.Repository.Interfaces;

public class PropietarioService : IPropietarioService
{
    private readonly IPropietarioRepository _propietarioRepository;

    public PropietarioService(IPropietarioRepository propietarioRepository)
    {
        _propietarioRepository = propietarioRepository;
    }

    public Task<List<Propietario>> GetAllAsync()
        => _propietarioRepository.GetAllAsync();

    public Task<Propietario?> GetByIdAsync(int id)
        => _propietarioRepository.GetByIdAsync(id);

    public Task<Propietario> AddAsync(Propietario propietario)
        => _propietarioRepository.AddAsync(propietario);

    public async Task<bool> UpdateAsync(int id, Propietario propietario)
    {
        propietario.IdPropietario = id;
        return await _propietarioRepository.UpdateAsync(propietario);
    }

    public Task<bool> DeleteAsync(int id)
        => _propietarioRepository.DeleteAsync(id);
}
