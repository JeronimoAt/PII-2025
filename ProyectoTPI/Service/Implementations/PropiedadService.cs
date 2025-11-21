using Inmobiliaria.Repository.Implementations;
using Inmobiliaria.Repository.Interfaces;
using Inmobiliaria.Service.Interfaces;
using static Inmobiliaria.Repository.Implementations.PropiedadRepository;

namespace Inmobiliaria.Service.Implementations
{
    public class PropiedadService : IPropiedadService
    {
        private IPropiedadRepository _propiedadRepository;

        public PropiedadService(IPropiedadRepository propiedadRepository)
        {
            _propiedadRepository = propiedadRepository;
        }

        public List<InmuebleAlquilerDto> ObtenerInmueblesSinAlquileresRecientes()
        {
            return _propiedadRepository.ObtenerInmueblesSinAlquileresRecientes();
        }
    }
}
