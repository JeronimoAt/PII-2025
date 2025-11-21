using Inmobiliaria.Repository.Implementations;
using static Inmobiliaria.Repository.Implementations.PropiedadRepository;

namespace Inmobiliaria.Repository.Interfaces
{
    public interface IPropiedadRepository
    {
        List<InmuebleAlquilerDto> ObtenerInmueblesSinAlquileresRecientes();
    }
}
