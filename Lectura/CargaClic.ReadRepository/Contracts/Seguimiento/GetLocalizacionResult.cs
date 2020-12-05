using System;

namespace CargaClic.ReadRepository.Contracts.Seguimiento.Results
{
    public class GetLocalizacionResult
    {
        public int id { get; set; }
        public int usuario_id { get; set; }
        public decimal lat { get; set; }
        public decimal lng { get; set; }
    }
}