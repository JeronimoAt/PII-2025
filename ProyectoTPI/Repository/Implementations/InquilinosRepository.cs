using Inmobiliaria.Models;
using Inmobiliaria.Repository.Interfaces;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Threading.Tasks;

namespace Inmobiliaria.Repository.Implementations
{
    public class InquilinoRepository : IInquilinosRepository
    {
        private readonly Propiedades_InmobiliariasContext _context;

        public InquilinoRepository(Propiedades_InmobiliariasContext context)
        {
            _context = context;
        }

        // ==========================
        // SP / Buscador genérico
        // ==========================
        public List<Dictionary<string, object>> EjecutarBusquedaDinamica(string textoBuscado, string nombreTabla)
        {
            var connection = _context.Database.GetDbConnection();

            using var command = connection.CreateCommand();
            command.CommandText = "SP_Buscador";
            command.CommandType = CommandType.StoredProcedure;

            var paramTexto = new SqlParameter("@Texto", SqlDbType.VarChar, 100)
            {
                Value = (object?)textoBuscado ?? DBNull.Value
            };

            var paramTabla = new SqlParameter("@Tabla", SqlDbType.VarChar, 50)
            {
                Value = (object?)nombreTabla ?? DBNull.Value
            };

            command.Parameters.Add(paramTexto);
            command.Parameters.Add(paramTabla);

            var resultados = new List<Dictionary<string, object>>();

            try
            {
                if (connection.State != ConnectionState.Open)
                    connection.Open();

                using var reader = command.ExecuteReader();

                var columnNames = Enumerable.Range(0, reader.FieldCount)
                                            .Select(reader.GetName)
                                            .ToList();

                while (reader.Read())
                {
                    var row = new Dictionary<string, object?>();
                    for (int i = 0; i < columnNames.Count; i++)
                    {
                        var value = reader.IsDBNull(i) ? null : reader.GetValue(i);
                        row.Add(columnNames[i], value);
                    }
                    resultados.Add(row!);
                }
            }
            finally
            {
                if (connection.State == ConnectionState.Open)
                    connection.Close();
            }

            return resultados;
        }

        // ==========================
        // Dashboard
        // ==========================

        public List<object> ObtenerInquilinosConDeudaSinPagoDelMes()
        {
            var hoy = DateOnly.FromDateTime(DateTime.Now);
            var anio = hoy.Year;
            var mes = hoy.Month;

            var resultado = (
                from i in _context.Inquilinos
                join inm in _context.Inmuebles on i.IdInquilino equals inm.IdInquilino
                where inm.IdLibreDeuda == 2
                join r in _context.Recibos on i.IdInquilino equals r.IdInquilino into recibosGrupo
                let ultimoPago = recibosGrupo.Max(r => (DateOnly?)r.Fecha)
                let pagosDelMes = recibosGrupo.Count(r => r.Fecha.Value.Year == anio && r.Fecha.Value.Month == mes)
                where pagosDelMes == 0
                orderby i.Nombre + " " + i.Apellido
                select new
                {
                    Inquilino = i.Nombre + " " + i.Apellido,
                    Telefono = i.Telefono,
                    Mail = i.MailContacto,
                    UltimoPago = ultimoPago
                }
            ).ToList<object>();

            return resultado;
        }

        public List<object> ObtenerRecibosUltimosTresMeses()
        {
            var hoy = DateTime.Now;
            var fechaLimiteDateTime = hoy.AddMonths(-3);
            var fechaLimite = DateOnly.FromDateTime(fechaLimiteDateTime);

            var resultados = _context.Recibos
                .Join(
                    _context.DetallesRecibos,
                    r => r.NroRecibo,
                    dr => dr.NroRecibo,
                    (r, dr) => new { r, dr }
                )
                .Join(
                    _context.DetallesInmuebles,
                    temp => temp.r.IdDetalleInmueble,
                    di => di.IdDetalleInmueble,
                    (temp, di) => new { temp.r, temp.dr, di }
                )
                .Join(
                    _context.Inmuebles,
                    temp => temp.di.IdInmueble,
                    i => i.IdInmueble,
                    (temp, i) => new { temp.r, temp.dr, temp.di, i }
                )
                .Where(x => x.r.Fecha >= fechaLimite)
                .Select(x => new
                {
                    Fecha = x.r.Fecha,
                    MontoTotal = x.dr.MontoTotal,
                    NombreDeInmueble = x.i.NombreInmueble
                })
                .OrderByDescending(x => x.Fecha)
                .ToList();

            return resultados.Cast<object>().ToList();
        }

        public int ObtenerInquilinosSinDeuda()
        {
            var totalInquilinos = _context.Inquilinos.Count();

            var inquilinosConDeuda = (
                from i in _context.Inquilinos
                join inm in _context.Inmuebles on i.IdInquilino equals inm.IdInquilino
                where inm.IdLibreDeuda == 2
                select i.IdInquilino
            ).Distinct().Count();

            return totalInquilinos - inquilinosConDeuda;
        }

        public List<object> ObtenerInmueblesPorLocalidad()
        {
            var query =
                from i in _context.Inmuebles
                join di in _context.DetallesInmuebles on i.IdInmueble equals di.IdInmueble
                join d in _context.Direcciones on di.IdDireccion equals d.IdDireccion
                join b in _context.Barrios on d.IdBarrio equals b.IdBarrio
                join loc in _context.Localidades on b.Localidad equals loc.IdLocalidad
                group i by loc.Localidad into g
                select new
                {
                    Localidad = g.Key,
                    Cantidad = g.Count()
                };

            return query.Cast<object>().ToList();
        }

        public List<object> ObtenerVentasPorLocalidad()
        {
            var query =
                from v in _context.Ventas
                join i in _context.Inmuebles on v.IdInmueble equals i.IdInmueble
                join di in _context.DetallesInmuebles on i.IdInmueble equals di.IdInmueble
                join d in _context.Direcciones on di.IdDireccion equals d.IdDireccion
                join b in _context.Barrios on d.IdBarrio equals b.IdBarrio
                join loc in _context.Localidades on b.Localidad equals loc.IdLocalidad
                group v by loc.Localidad into g
                select new
                {
                    Localidad = g.Key,
                    Cantidad = g.Count(),
                    Total = g.Sum(x => x.Importe)   
                };

            return query.Cast<object>().ToList();
        }


        public List<object> ObtenerComisionesPorVendedor()
        {
            var datos = _context.Comisiones
                .Join(
                    _context.Empleados,
                    c => c.IdEmpleado,
                    e => e.IdEmpleado,
                    (c, e) => new { c, e }
                )
                .GroupBy(x => new { x.e.IdEmpleado, x.e.Nombre, x.e.Apellido })
                .Select(g => new
                {
                    Vendedor = g.Key.Nombre + " " + g.Key.Apellido,
                    TotalComision = g.Sum(x => x.c.Importe)
                })
                .OrderByDescending(x => x.TotalComision)
                .ToList<object>();

            return datos;
        }

        // ==========================
        // CRUD estándar
        // ==========================

        public async Task<List<Inquilino>> GetAllAsync()
        {
            return await _context.Inquilinos.ToListAsync();
        }

        public async Task<Inquilino?> GetByIdAsync(int id)
        {
            return await _context.Inquilinos
                                 .FirstOrDefaultAsync(i => i.IdInquilino == id);
        }

        public async Task<Inquilino> AddAsync(Inquilino inquilino)
        {
            _context.Inquilinos.Add(inquilino);
            await _context.SaveChangesAsync();
            return inquilino;
        }

        public async Task<bool> UpdateAsync(Inquilino inquilino)
        {
            var existe = await _context.Inquilinos
                                       .AnyAsync(i => i.IdInquilino == inquilino.IdInquilino);

            if (!existe)
                return false;

            _context.Inquilinos.Update(inquilino);
            await _context.SaveChangesAsync();
            return true;
        }

        public async Task<bool> DeleteAsync(int id)
        {
            var entity = await _context.Inquilinos.FindAsync(id);
            if (entity == null)
                return false;

            _context.Inquilinos.Remove(entity);
            await _context.SaveChangesAsync();
            return true;
        }



    }
}
