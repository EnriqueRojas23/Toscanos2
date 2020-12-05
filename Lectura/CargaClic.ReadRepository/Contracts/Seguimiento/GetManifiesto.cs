using System;

namespace CargaClic.ReadRepository.Contracts.Seguimiento.Results
{
    public class GetManifiesto
    {
        public long id	 {get;set;}
        public string numero_manifiesto	 {get;set;}
        public DateTime fecha_registro	 {get;set;}
        public string provincias	 {get;set;}
        public decimal peso_total {get;set;}
        public string cliente {get;set;}
        public string estado { get;set;}
        
    }
}