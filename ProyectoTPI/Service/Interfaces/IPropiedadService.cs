using Inmobiliaria.Repository.Implementations;
using static Inmobiliaria.Repository.Implementations.PropiedadRepository;

namespace Inmobiliaria.Service.Interfaces
{
    public interface IPropiedadService
    {
        List<InmuebleAlquilerDto> ObtenerInmueblesSinAlquileresRecientes();

      

    }
}
