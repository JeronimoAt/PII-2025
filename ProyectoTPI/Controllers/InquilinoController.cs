using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Inmobiliaria.Models;
using Inmobiliaria.Service.Interfaces;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Inmobiliaria.Controllers
{
    // Ruta base -> api/Inquilino
    [Route("api/[controller]")]
    [ApiController]
    public class InquilinoController : ControllerBase
    {
        // Servicio de negocio para manejar lógica de inquilinos
        private readonly IInquilinoService _inquilinoService;

        // Contexto EF Core para consultas directas
        private readonly Propiedades_InmobiliariasContext _context;

        // Constructor con inyección de dependencias
        public InquilinoController(
            IInquilinoService inquilinoService,
            Propiedades_InmobiliariasContext context)
        {
            _inquilinoService = inquilinoService;
            _context = context;
        }

        // ============================================================
        // GET: api/Inquilino
        //  lista de inquilinos con deuda y sin pagos en el mes
        // ============================================================
        [HttpGet]
        public IActionResult ObtenerInquilinosConDeudaSinPagoDelMes()
        {
            List<object> inquilinoList = _inquilinoService.ObtenerInquilinosConDeudaSinPagoDelMes();
            return Ok(inquilinoList);
        }

        // ============================================================
        // GET: api/Inquilino/recibos
        //  recibos de los últimos 3 meses
        // ============================================================
        [HttpGet("recibos")]
        public IActionResult ObtenerRecibosUltimosTresMeses()
        {
            List<object> inquilinoList = _inquilinoService.ObtenerRecibosUltimosTresMeses();
            return Ok(inquilinoList);
        }

        // ============================================================
        // GET: api/Inquilino/Buscador?texto=...&tabla=...
        // buscador dinámico general
        // ============================================================
        [HttpGet("Buscador")]
        public IActionResult Buscar([FromQuery] string texto, [FromQuery] string tabla)
        {
            // Validación de parámetros
            if (string.IsNullOrEmpty(texto) || string.IsNullOrEmpty(tabla))
            {
                return BadRequest(new { Mensaje = "Los parámetros 'texto' y 'tabla' son obligatorios para la búsqueda." });
            }

            try
            {
                // Servicio que ejecuta búsqueda según la tabla seleccionada
                var resultados = _inquilinoService.EjecutarBusquedaDinamica(texto, tabla);
                return Ok(resultados);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Mensaje = "Error al ejecutar la búsqueda.", Detalle = ex.Message });
            }
        }

        // ============================================================
        // POST: api/Inquilino/Simple
        // Crear un nuevo inquilino con datos simples
        // ============================================================
        [HttpPost("Simple")]
        public IActionResult CrearInquilinoSimple([FromBody] Inquilino inquilino)
        {
            // Validación de null
            if (inquilino == null)
                return BadRequest(new { Mensaje = "Datos inválidos." });

            try
            {
                // Insertar inquilino desde el servicio
                bool creado = _inquilinoService.CrearInquilino(inquilino);

                if (!creado)
                    return StatusCode(500, new { Mensaje = "No se pudo crear el inquilino." });

                return Ok(new { Mensaje = "Inquilino creado correctamente." });
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Mensaje = "Error al crear inquilino.", Detalle = ex.Message });
            }
        }

        // ============================================================
        // GET: api/Inquilino/Buscar?texto=...
        // Autocompletar para barra de búsqueda rápida
        // ============================================================
        [HttpGet("Buscar")]
        public async Task<IActionResult> BuscarInquilinos([FromQuery] string texto)
        {
            // Si no hay texto, devolvemos vacío
            if (string.IsNullOrWhiteSpace(texto))
                return Ok(new List<object>());

            // Consulta rápida al contexto directo
            var datos = await _context.Inquilinos
                .Where(i => (i.Nombre + " " + i.Apellido).Contains(texto))
                .Select(i => new
                {
                    id = i.IdInquilino,
                    nombre = i.Nombre + " " + i.Apellido
                })
                .Take(20) // límite máximo
                .ToListAsync();

            return Ok(datos);
        }

        // ============================================================
        // CRUD REST estándar (POST, PUT, DELETE)
        // ============================================================

        // POST: api/Inquilino
        // Alta completa usando el entity
        [HttpPost]
        public async Task<IActionResult> Post([FromBody] Inquilino inquilino)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Crear registro
            var creado = await _inquilinoService.AddAsync(inquilino);

            // Devuelve 201 + ruta del recurso creado
            return CreatedAtAction(nameof(GetById), new { id = creado.IdInquilino }, creado);
        }

        // PUT: api/Inquilino/{id}
        // Actualizar datos del inquilino
        [HttpPut("{id:int}")]
        public async Task<IActionResult> Put(int id, [FromBody] Inquilino inquilino)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Actualizar registro
            var ok = await _inquilinoService.UpdateAsync(id, inquilino);

            if (!ok) return NotFound();

            return NoContent(); // 204 - actualizado sin contenido
        }

        // DELETE: api/Inquilino/{id}
        // Eliminar un inquilino por id
        [HttpDelete("{id:int}")]
        public async Task<IActionResult> Delete(int id)
        {
            var ok = await _inquilinoService.DeleteAsync(id);

            if (!ok) return NotFound();

            return NoContent();
        }

        // ============================================================
        // CRUD estándar de Inquilinos
        // ============================================================

        // GET: api/Inquilino/Todos
        // Obtener todos los inquilinos
        [HttpGet("Todos")]
        public async Task<IActionResult> GetAll()
        {
            var lista = await _inquilinoService.GetAllAsync();
            return Ok(lista);
        }

        // GET: api/Inquilino/{id}
        // Obtener un inquilino por ID
        [HttpGet("{id:int}")]
        public async Task<IActionResult> GetById(int id)
        {
            var inq = await _inquilinoService.GetByIdAsync(id);

            if (inq == null) return NotFound();

            return Ok(inq);
        }
    }
}