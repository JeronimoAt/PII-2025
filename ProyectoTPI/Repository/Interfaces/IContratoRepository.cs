using Inmobiliaria.Models;

public interface IContratoRepository
{
    Task<Contrato> CrearContratoAsync(Contrato contrato);
    Task<Contrato?> ObtenerPorIdAsync(int id);
    Task<IEnumerable<Contrato>> ObtenerTodosAsync();
    Task ActualizarContratoAsync(Contrato contrato);
    Task EliminarContratoAsync(int id);
}
