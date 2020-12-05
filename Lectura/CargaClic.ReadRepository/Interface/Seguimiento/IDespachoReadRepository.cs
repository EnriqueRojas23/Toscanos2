using System.Collections.Generic;
using System.Threading.Tasks;
using CargaClic.Domain.Mantenimiento;
using CargaClic.ReadRepository.Contracts.Seguimiento.Results;

namespace CargaClic.ReadRepository.Interface.Seguimiento
{
    public interface ISeguimientoReadRepository
    {
         Task<IEnumerable<GetOrdenTransporte>> GetAllOrdenTransporte(int? remitente_id, int? estado_id, int usuario_id
         , string fec_ini, string fec_fin);

         Task<IEnumerable<GetOrdenTransporte>> GetAllOrdenTransporte(int manifiestoId);
         Task<IEnumerable<GetOrdenTransporte>> SearchOrdenTransporte(string criterio, int dias);

         Task<IEnumerable<GetOrdenTransporte>> GetAllOrdenTransporteCliente(int manifiestoId, int UsuarioId);
         Task<ObtenerOrdenTransporteDto> ObtenerOrdenTrasporte(long orden_id);
        


         Task<IEnumerable<GetManifiesto>> GetAllManifiesto(int ChoferId);
         Task<IEnumerable<GetEstadisticas>> GetEstadisticas(int cliente_id);
         Task<IEnumerable<GetManifiesto>> GetAllManifiestoCliente(int ClienteId);
         Task<IEnumerable<GetDocumentoResult>> GetAllDocumentos(int site_id);
         Task<IEnumerable<GetIncidencia>> GetAllOrdenIncidencias(long OrdenTransporteId);
         Task<GetLocalizacionResult> GetLocalizacion(int usuarioId);
         EquipoTransporte GetEquipoTransporte(long id);

         Task<GetTotalDespachos> GetTotalDespachos(int? remitente_id,string fec_ini, string fec_fin);
         Task<GetDespachosATiempo> GetDespachosATiempo(int? remitente_id,string fec_ini, string fec_fin);

         Task<IEnumerable<ReporteEncuestaResult>> GetReporteEncuesta(int? remitente_id, int? usuario_id,string fec_ini, string fec_fin);


         Task<IEnumerable<GetDespachosTiempoEntrega>> GetDespachosTiempoEntrega(int? remitente_id,string fec_ini, string fec_fin);
         Task<IEnumerable<GetDaysOfWeek>> GetDaysOfWeek(int? remitente_id,string fec_ini, string fec_fin);
         Task<IEnumerable<GetCantidadxManifiesto>> GetCantidadxManifiesto(int? remitente_id,string fec_ini, string fec_fin);
         Task<IEnumerable<GetDespachosPuntualidad>> GetDespachosPuntualidad(int? remitente_id,string fec_ini, string fec_fin);

         Task<IEnumerable<GetActivityTotal>> GetActivityTotal();
         Task<IEnumerable<GetActivityTotal>> GetActivityTotalRecojo();
         Task<IEnumerable<GetActivityTotal>> GetActivityTotalClientes();
         Task<IEnumerable<GetActivityVehiculoRuta>> GetActivityVehiculosRuta();
         Task<IEnumerable<ReporteServicioResult>> GetReporteServicio();
         
         Task<IEnumerable<GetActivityOTsTotalesYEntregadas>> GetActivityOTTotalesYEntregadas();

         Task<IEnumerable<GetAsignacionUnidades>> GetAsignacionUnidadesVehiculo();
         Task<IEnumerable<GetAsignacionUnidades>> GetAsignacionUnidadesVehiculoTerceros();
         Task<IEnumerable<GetActivityPropios>> GetVehiculoPropios();

         Task<IEnumerable<GetMaestroIncidencia>> GetMaestroIncidencias();

         Task<GetDatosIncidencia> GetDatosIncidencia(long incidencia);


    }
}