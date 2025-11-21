using Inmobiliaria.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inmobiliaria.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DashboardController : ControllerBase
    {
        private readonly IInquilinoService _inquilinoService;

        public DashboardController(IInquilinoService inquilinoService)
        {
            _inquilinoService = inquilinoService;
        }

        // GET: api/Dashboard/InquilinosConDeuda
        [HttpGet("InquilinosConDeuda")]
        public IActionResult GetInquilinosConDeuda()
        {
            try
            {
                var datos = _inquilinoService.ObtenerInquilinosConDeudaSinPagoDelMes();
                return Ok(datos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener inquilinos con deuda.",
                    detalle = ex.Message
                });
            }
        }

        // GET: api/Dashboard/RecibosUltimosTresMeses
        [HttpGet("RecibosUltimosTresMeses")]
        public IActionResult GetRecibosUltimosTresMeses()
        {
            try
            {
                var datos = _inquilinoService.ObtenerRecibosUltimosTresMeses();
                return Ok(datos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener los recibos.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("InquilinosSinDeuda")]
        public IActionResult GetInquilinosSinDeuda()
        {
            int cantidad = _inquilinoService.ObtenerInquilinosSinDeuda();
            return Ok(cantidad);
        }

        [HttpGet("AdministracionesPorLocalidad")]
        public IActionResult AdministracionesPorLocalidad()
        {
            try
            {
                var datos = _inquilinoService.ObtenerInmueblesPorLocalidad();
                return Ok(datos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener administraciones por localidad.",
                    detalle = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }

        [HttpGet("VentasPorLocalidad")]
        public IActionResult VentasPorLocalidad()
        {
            try
            {
                var datos = _inquilinoService.ObtenerVentasPorLocalidad();
                return Ok(datos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener ventas por localidad.",
                    detalle = ex.Message,
                    inner = ex.InnerException?.Message
                });
            }
        }
        [HttpGet("ComisionesPorVendedor")]
        public IActionResult ComisionesPorVendedor()
        {
            try
            {
                var datos = _inquilinoService.ObtenerComisionesPorVendedor();
                return Ok(datos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener comisiones por vendedor.",
                    detalle = ex.Message
                });
            }
        }


    }
}
