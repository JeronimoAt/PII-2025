using Inmobiliaria.Models;
using Inmobiliaria.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inmobiliaria.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ContratoController : ControllerBase
    {
        private readonly IContratoService _contratoService;

        public ContratoController(IContratoService contratoService)
        {
            _contratoService = contratoService;
        }

        // POST: api/Contrato
        [HttpPost("Simple")]
        public async Task<IActionResult> Post([FromBody] Contrato contrato)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            try
            {
                var creado = await _contratoService.CrearContratoAsync(contrato);
                return Ok(new
                {
                    mensaje = "Contrato creado correctamente.",
                    idContrato = creado.IdContrato
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al crear el contrato.",
                    detalle = ex.Message
                });
            }
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> Get(int id)
        {
            var contrato = await _contratoService.ObtenerPorIdAsync(id);
            if (contrato == null) return NotFound();
            return Ok(contrato);
        }

        // GET: api/Contrato
        // Listar todos los contratos
        [HttpGet]
        public async Task<IActionResult> Get()
        {
            try
            {
                var contratos = await _contratoService.ObtenerTodosAsync();
                return Ok(contratos);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al obtener la lista de contratos.",
                    detalle = ex.Message
                });
            }
        }

        // PUT: api/Contrato/{id}
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] Contrato contrato)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            if (id != contrato.IdContrato)
                return BadRequest(new { mensaje = "El Id de la URL no coincide con el del cuerpo de la petición." });

            try
            {
                var existente = await _contratoService.ObtenerPorIdAsync(id);
                if (existente == null)
                    return NotFound(new { mensaje = $"No se encontró contrato con Id {id}." });

                await _contratoService.ActualizarContratoAsync(contrato);

                return Ok(new
                {
                    mensaje = "Contrato actualizado correctamente."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al actualizar el contrato.",
                    detalle = ex.Message
                });
            }
        }

        // DELETE: api/Contrato/{id}
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            try
            {
                var existente = await _contratoService.ObtenerPorIdAsync(id);
                if (existente == null)
                    return NotFound(new { mensaje = $"No se encontró contrato con Id {id}." });

                await _contratoService.EliminarContratoAsync(id);

                return Ok(new
                {
                    mensaje = "Contrato eliminado correctamente."
                });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new
                {
                    mensaje = "Error al eliminar el contrato.",
                    detalle = ex.Message
                });
            }
        }
    }
}
