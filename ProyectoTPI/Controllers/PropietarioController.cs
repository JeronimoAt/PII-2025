using Inmobiliaria.Models;
using Inmobiliaria.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace Inmobiliaria.Controllers
{
    
        [Route("api/[controller]")]
        [ApiController]
        public class PropietarioController : ControllerBase
        {
            private readonly IPropietarioService _propietarioService;
            private readonly Propiedades_InmobiliariasContext _context = null!;


            public PropietarioController(IPropietarioService propietarioService,
                                         Propiedades_InmobiliariasContext context)
            {
                _propietarioService = propietarioService;
                _context = context;
            }

            // ===========================
            //  POST: api/Propietario/Simple
            // ===========================
            [HttpPost("Simple")]
            public IActionResult CrearPropietarioSimple([FromBody] Propietario p)
            {
                if (p == null)
                    return BadRequest(new { Mensaje = "Datos inválidos." });

                try
                {
                    _context.Propietarios.Add(p);
                    _context.SaveChanges();

                    return Ok(new { Mensaje = "Propietario creado correctamente.", Id = p.IdPropietario });
                }
                catch (Exception ex)
                {
                    return StatusCode(500, new
                    {
                        Mensaje = "Error al crear propietario.",
                        Detalle = ex.Message
                    });
                }
            }

            // ===========================
            //  GET: api/Propietario
            // ===========================
            [HttpGet]
            public IActionResult GetAll()
            {
                var datos = _context.Propietarios.ToList();
                return Ok(datos);
            }

            [HttpGet("Buscar")]
            public IActionResult BuscarPropietarios([FromQuery] string texto)
            {
                if (string.IsNullOrWhiteSpace(texto))
                    return Ok(new List<object>());

                var datos = _context.Propietarios
                    .Where(p => (p.Nombre + " " + p.Apellido).Contains(texto))
                    .Select(p => new {
                        id = p.IdPropietario,
                        nombre = p.Nombre + " " + p.Apellido
                    })
                    .Take(20)
                    .ToList();

                return Ok(datos);
            }

            // ============================================================
            // CRUD REST estándar (POST, PUT, DELETE)
            // ============================================================

            // POST: api/Propietario
            // Alta completa usando el entity
            [HttpPost]
            public async Task<IActionResult> Post([FromBody] Propietario propietario)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Crear registro
                var creado = await _propietarioService.AddAsync(propietario);

                // Devuelve 201 + ruta del recurso creado
                return CreatedAtAction(nameof(GetById), new { id = creado.IdPropietario }, creado);
            }

            // PUT: api/Propietario/{id}
            // Actualizar datos del inquilino
            [HttpPut("{id:int}")]
            public async Task<IActionResult> Put(int id, [FromBody] Propietario propietario)
            {
                if (!ModelState.IsValid)
                    return BadRequest(ModelState);

                // Actualizar registro
                var ok = await _propietarioService.UpdateAsync(id, propietario);

                if (!ok) return NotFound();

                return NoContent(); // 204 - actualizado sin contenido
            }

            // DELETE: api/Propietario/{id}
            // Eliminar un propietario por id
            [HttpDelete("{id:int}")]
            public async Task<IActionResult> Delete(int id)
            {
                var ok = await _propietarioService.DeleteAsync(id);

                if (!ok) return NotFound();

                return NoContent();
            }

            // ============================================================
            // CRUD estándar de propietario
            // ============================================================

            // GET: api/Propietario/Todos

            // GET: api/Propietario/{id}
            [HttpGet("{id:int}")]
            public async Task<IActionResult> GetById(int id)
            {
                var prop = await _propietarioService.GetByIdAsync(id);

                if (prop == null) return NotFound();

                return Ok(prop);
            }

        }

    }

