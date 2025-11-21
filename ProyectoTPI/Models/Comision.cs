using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Inmobiliaria.Models
{
    [Table("Comisiones")]
    public partial class Comision
    {
        [Key]
        [Column("Id_Comision")]
        public int IdComision { get; set; }

        [Column("ID_Empleado")]
        public int IdEmpleado { get; set; }

        [Column("Fecha")]
        public DateTime Fecha { get; set; }

        [Column("Importe")]
        public decimal Importe { get; set; }

        [Column("Observaciones")]
        public string? Observaciones { get; set; }

        [ForeignKey("IdEmpleado")]
        public virtual Empleado IdEmpleadoNavigation { get; set; } = null!;
    }
}
