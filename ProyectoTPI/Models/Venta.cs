using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inmobiliaria.Models
{
    [Table("Ventas")]
    public partial class Venta
    {
        [Key]
        [Column("Id_Venta")]          // nombre de la columna en SQL
        public int IdVenta { get; set; }

        [Column("Id_Inmueble")]
        public int IdInmueble { get; set; }

        [Column("Fecha")]
        public DateTime Fecha { get; set; }   // o DateOnly si tu contexto usa DateOnly

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("Observaciones")]
        public string? Observaciones { get; set; }

        // Relación con Inmueble (opcional pero recomendado)
        [ForeignKey("IdInmueble")]
        public virtual Inmueble IdInmuebleNavigation { get; set; } = null!;
    }
}
