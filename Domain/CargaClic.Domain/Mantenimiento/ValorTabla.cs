using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using CargaClic.Common;

namespace CargaClic.Domain.Mantenimiento
{

    public class ValorTabla : Entity
    {
        
        [Key]
        public int Id { get; set; }  

        public string ValorPrincipal { get; set; }
        public string ValorPrimero { get; set; }
        public string ValorSegundo { get; set; }

        public int TablaId {get;set;}
        public bool Visible {get;set;}
        public int Orden {get;set;}

        
    }
}