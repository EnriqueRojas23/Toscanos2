using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using CargaClic.Data;
using CargaClic.Domain.Mantenimiento;
using CargaClic.ReadRepository.Contracts.Seguimiento.Results;
using CargaClic.ReadRepository.Interface.Seguimiento;
using Dapper;
using Microsoft.Extensions.Configuration;

namespace CargaClic.ReadRepository.Repository.Despacho
{
    public class SeguimientoReadRepository : ISeguimientoReadRepository
    {
            private readonly DataContext _context;
            private readonly IConfiguration _config;

            public SeguimientoReadRepository(DataContext context,IConfiguration config)
            {
                _context = context;
                _config = config;
            }
            public IDbConnection Connection
            {   
                get
                {
                    return new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                }
            }

        public async Task<IEnumerable<GetDocumentoResult>> GetAllDocumentos(int id)
        {
           var parametros = new DynamicParameters();
            parametros.Add("idordentrabajo", dbType: DbType.Int64, direction: ParameterDirection.Input, value: id);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[Seguimiento].[pa_listar_documentos]";
                conn.Open();
                var result = await conn.QueryAsync<GetDocumentoResult>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetManifiesto>> GetAllManifiesto(int ChoferId)
        {
            var parametros = new DynamicParameters();
            parametros.Add("choferid", dbType: DbType.Int32, direction: ParameterDirection.Input, value: ChoferId);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_listar_manifiesto]";
                conn.Open();
                var result = await conn.QueryAsync<GetManifiesto>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetIncidencia>> GetAllOrdenIncidencias(long OrdenTransporteId)
        {
             var parametros = new DynamicParameters();
             parametros.Add("ordentransporteid", dbType: DbType.Int64, direction: ParameterDirection.Input, value: OrdenTransporteId);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_listar_incidencias]";
                conn.Open();
                var result = await conn.QueryAsync<GetIncidencia>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetOrdenTransporte>> GetAllOrdenTransporte(int? remitente_id
        , int? estado_id
        , int usuario_id, string fec_ini, string fec_fin )
        {
            var parametros = new DynamicParameters();
            parametros.Add("remitente_id", dbType: DbType.Int32, direction: ParameterDirection.Input, value: remitente_id);
            parametros.Add("estado_id", dbType: DbType.Int32, direction: ParameterDirection.Input, value: estado_id);
            parametros.Add("usuario_id", dbType: DbType.Int32, direction: ParameterDirection.Input, value: usuario_id);
            parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);
            

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_listar_ordenestransporte]";
                conn.Open();
                var result = await conn.QueryAsync<GetOrdenTransporte>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetOrdenTransporte>> GetAllOrdenTransporte(int manifiestoId)
        {
             var parametros = new DynamicParameters();
             parametros.Add("manifiesto_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: manifiestoId);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_listar_ordenestransporte_by_manifiesto]";
                conn.Open();
                var result = await conn.QueryAsync<GetOrdenTransporte>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

       

        public EquipoTransporte GetEquipoTransporte(long id)
        {
            var equipotransporte =  _context.EquipoTransporte.Where(x=>x.Id== id).Single();
            return equipotransporte;

        }

        public async Task<GetLocalizacionResult> GetLocalizacion(int chofer_id)
        {
            var parametros = new DynamicParameters();
            parametros.Add("orden_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: chofer_id);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_obtener_geolocalizacion]";
                conn.Open();
                var result = await conn.QueryAsync<GetLocalizacionResult>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.FirstOrDefault();
            }
        }

        public async Task<GetTotalDespachos> GetTotalDespachos(int? remitente_id, string fec_ini, string fec_fin)
        {
            var parametros = new DynamicParameters();
            parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);
    
            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[PA_TOTAL_DESPACHOS]";
                conn.Open();
                var result = await conn.QueryAsync<GetTotalDespachos>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.FirstOrDefault();
            }
        }
         public async Task<GetDespachosATiempo> GetDespachosATiempo(int? remitente_id, string fec_ini, string fec_fin)
        {
            var parametros = new DynamicParameters();
            parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_despachos_atiempo]";
                conn.Open();
                var result = await conn.QueryAsync<GetDespachosATiempo>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.FirstOrDefault();
            }
        }

        public async Task<IEnumerable<GetDespachosTiempoEntrega>> GetDespachosTiempoEntrega(int? remitente_id, string fec_ini, string fec_fin)
        {
            var parametros = new DynamicParameters();
            parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_despacho_tiempoentrega]";
                conn.Open();
                var result = await conn.QueryAsync<GetDespachosTiempoEntrega>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.ToList();
            }
        }

        public async Task<IEnumerable<GetDaysOfWeek>> GetDaysOfWeek(int? remitente_id, string fec_ini, string fec_fin)
        {
            var parametros = new DynamicParameters();
            parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_despacho_dayofweek]";
                conn.Open();
                var result = await conn.QueryAsync<GetDaysOfWeek>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                  result = result.OrderBy(x=> x.dayofw).ToList();
                  foreach (var item in result)
                  {
                      item.dayofw =   item.dayofw.Substring(1,item.dayofw.Length  -1 );
                  }

                 return result.ToList();
            }
        }

        public async Task<IEnumerable<GetCantidadxManifiesto>> GetCantidadxManifiesto(int? remitente_id, string fec_ini, string fec_fin)
        {
           var parametros = new DynamicParameters();
            parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_despacho_cantidadxmanifiesto]";
                conn.Open();
                var result = await conn.QueryAsync<GetCantidadxManifiesto>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.ToList();
            }
        }

        public async Task<IEnumerable<GetDespachosPuntualidad>> GetDespachosPuntualidad(int? remitente_id, string fec_ini, string fec_fin)
        {
            var parametros = new DynamicParameters();
            parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_despacho_puntualidad]";
                conn.Open();
                var result = await conn.QueryAsync<GetDespachosPuntualidad>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.ToList();
            }
        }

        public async Task<IEnumerable<GetAsignacionUnidades>> GetAsignacionUnidadesVehiculo()
        {
            var parametros = new DynamicParameters();
            // parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            // parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            // parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_uso_vehiculo]";
                conn.Open();
                var result = await conn.QueryAsync<GetAsignacionUnidades>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                 return result.ToList().GroupBy(x=>x.fecha_carga).Select(g=> new GetAsignacionUnidades{
                    fecha_carga = g.First().fecha_carga,
                    cantidad = g.Count(),
                     disponibilidad =g.First().disponibilidad -  g.Count(),
                    
                });
            }
        }

        public async Task<IEnumerable<GetAsignacionUnidades>> GetAsignacionUnidadesVehiculoTerceros()
        {
             var parametros = new DynamicParameters();
            // parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            // parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            // parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_uso_vehiculo_terceros]";
                conn.Open();
                var result = await conn.QueryAsync<GetAsignacionUnidades>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.ToList().GroupBy(x=>x.fecha_carga).Select(g=> new GetAsignacionUnidades{
                    fecha_carga = g.First().fecha_carga,
                    cantidad = g.Count(),
                    disponibilidad =g.First().disponibilidad -  g.Count(),
                    
                });
            }
        }

        public async Task<IEnumerable<GetActivityPropios>> GetVehiculoPropios()
        {
             var parametros = new DynamicParameters();
            // parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: remitente_id);
            // parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
            // parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_listar_activity_propios]";
                conn.Open();
                var result = await conn.QueryAsync<GetActivityPropios>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 

                return result.ToList();
            }
        }

        public async Task<IEnumerable<GetManifiesto>> GetAllManifiestoCliente(int ClienteId)
        {
             var parametros = new DynamicParameters();
            parametros.Add("clienteid", dbType: DbType.Int32, direction: ParameterDirection.Input, value: ClienteId);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_listar_manifiesto_clientes]";
                conn.Open();
                var result = await conn.QueryAsync<GetManifiesto>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                ); 
                return result;
            }
        }

        public async Task<ObtenerOrdenTransporteDto> ObtenerOrdenTrasporte(long orden_id)
        {
            var parametros = new DynamicParameters();
            parametros.Add("orden_transporte_id", dbType: DbType.String, direction: ParameterDirection.Input, value: orden_id);
            

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_obtener_ordentransporte]";
                conn.Open();
                var result = await conn.QueryAsync<ObtenerOrdenTransporteDto>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ) ;
                return result.SingleOrDefault();
            }
        }

        public async Task<IEnumerable<GetOrdenTransporte>> GetAllOrdenTransporteCliente(int manifiestoId, int UsuarioId)
        {
            var parametros = new DynamicParameters();
            parametros.Add("manifiesto_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: manifiestoId);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[Seguimiento].[pa_listar_ordenestransporte_by_manifiesto_cliente]";
                conn.Open();
                var result = await conn.QueryAsync<GetOrdenTransporte>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetEstadisticas>> GetEstadisticas(int cliente_id)
        {
            var parametros = new DynamicParameters();
             parametros.Add("cliente_id", dbType: DbType.Int64, direction: ParameterDirection.Input, value: cliente_id);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_estadisticas_mobile]";
                conn.Open();
                var result = await conn.QueryAsync<GetEstadisticas>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetOrdenTransporte>> SearchOrdenTransporte(string criterio, int dias)
        {
             var parametros = new DynamicParameters();
             parametros.Add("criterio", dbType: DbType.String, direction: ParameterDirection.Input, value: criterio);
             parametros.Add("days", dbType: DbType.Int32, direction: ParameterDirection.Input, value: dias);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_buscar_ordentransporte]";
                conn.Open();
                var result = await conn.QueryAsync<GetOrdenTransporte>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetActivityTotal>> GetActivityTotal()
        {
             var parametros = new DynamicParameters();
         

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_activityTotales]";
                conn.Open();
                var result = await conn.QueryAsync<GetActivityTotal>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }
        public async Task<IEnumerable<GetActivityTotal>> GetActivityTotalRecojo()
        {
             var parametros = new DynamicParameters();
            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_activityTotalesRecojo]";
                conn.Open();
                var result = await conn.QueryAsync<GetActivityTotal>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }
        public async Task<IEnumerable<GetActivityTotal>> GetActivityTotalClientes()
        {
             var parametros = new DynamicParameters();
            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_activityTotales_clientes]";
                conn.Open();
                var result = await conn.QueryAsync<GetActivityTotal>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetActivityVehiculoRuta>> GetActivityVehiculosRuta()
        {
            var parametros = new DynamicParameters();
            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_VehiculosRuta]";
                conn.Open();
                var result = await conn.QueryAsync<GetActivityVehiculoRuta>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<GetActivityOTsTotalesYEntregadas>> GetActivityOTTotalesYEntregadas()
        {
               var parametros = new DynamicParameters();
            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_entregasTotalesYEntregadas]";
                conn.Open();
                var result = await conn.QueryAsync<GetActivityOTsTotalesYEntregadas>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result;
            }
        }

        public async Task<IEnumerable<ReporteServicioResult>> GetReporteServicio()
        {
            var parametros = new DynamicParameters();
            

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_reporteservicio]";
                conn.Open();
                var result = await conn.QueryAsync<ReporteServicioResult>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                ); 
                return result;
            }
        }

        public async Task<IEnumerable<ReporteEncuestaResult>> GetReporteEncuesta(int? remitente_id, int? usuario_id, string fec_ini, string fec_fin)
        {
             var parametros = new DynamicParameters();
             parametros.Add("remitente_id", dbType: DbType.Int32, direction: ParameterDirection.Input, value: remitente_id);
             parametros.Add("usuario_id", dbType: DbType.Int32, direction: ParameterDirection.Input, value: usuario_id);
             parametros.Add("fecini", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_ini);
             parametros.Add("fecfin", dbType: DbType.String, direction: ParameterDirection.Input, value: fec_fin);

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_reporte_encuesta]";
                conn.Open();
                var result = await conn.QueryAsync<ReporteEncuestaResult>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result.ToList();
            }
        }

        public async Task<IEnumerable<GetMaestroIncidencia>> GetMaestroIncidencias()
        {
            var parametros = new DynamicParameters();

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_listar_maestroincidencias]";
                conn.Open();
                var result = await conn.QueryAsync<GetMaestroIncidencia>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ); 
                return result.ToList();
            }
        }

        public async Task<GetDatosIncidencia> GetDatosIncidencia(long incidencia)
        {
            var parametros = new DynamicParameters();
            parametros.Add("incidencia", dbType: DbType.Int64, direction: ParameterDirection.Input, value: incidencia);
            

            using (IDbConnection conn = Connection)
            {
                string sQuery = "[seguimiento].[pa_obtener_detalleincidencia]";
                conn.Open();
                var result = await conn.QueryAsync<GetDatosIncidencia>(sQuery,
                                                                    parametros
                                                                    ,commandType:CommandType.StoredProcedure
                  ) ;
                return result.SingleOrDefault();
            }
        }
    }
}