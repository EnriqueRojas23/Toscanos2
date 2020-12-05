using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CargaClic.Domain.Mantenimiento;
using CargaClic.Domain.Seguimiento;
using CargaClic.Repository.Contracts.Seguimiento;

namespace CargaClic.Repository.Interface.Seguimiento
{
    public interface IOrdenRepository
    {
        Task<EquipoTransporte> RegisterEquipoTransporte(EquipoTransporte eq,  List<long> ids);
        Task<int> RegisterCargaMasiva (CargaMasivaForRegister cargaMasiva , IEnumerable<CargaMasivaDetalleForRegister> cargaMasivaDetalle );
        Task<int> RegisterOrdenes (List<Manifiesto> ordenTrabajoForRegisters, int usrid );
        Task<bool> RegisterGeoLocalizacion (GeoEquipoTransporteForRegister geoEquipoTransporte );
        Task<bool> ActualizarIncidencia (IncidenciaForUpdate incidencia );

    }
}