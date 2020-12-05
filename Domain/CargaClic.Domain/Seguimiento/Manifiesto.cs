using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using CargaClic.Common;

namespace CargaClic.Domain.Seguimiento
{
   public class Manifiesto : Entity
    {
        [Key]
        public long id { get; set; }
        public string numero_manifiesto { get; set; }
        public DateTime? fecha_registro { get; set; }
        public int usuario_id { get; set; }
        public int estado_id {get;set;}
        public ICollection<OrdenTransporte> Ordenes { get; set;}
    }
}