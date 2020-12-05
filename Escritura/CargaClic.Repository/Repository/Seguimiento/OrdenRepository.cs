
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Threading.Tasks;
using CargaClic.Common;
using CargaClic.Data;
using CargaClic.Domain.Mantenimiento;
using CargaClic.Domain.Seguimiento;
using CargaClic.Repository.Contracts.Seguimiento;
using CargaClic.Repository.Interface.Seguimiento;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace CargaClic.Repository.Seguimiento
{
    public class OrdenRepository : IOrdenRepository
    {
        private readonly DataContext _context;
        private readonly IConfiguration _config;

        public OrdenRepository(DataContext context,IConfiguration config)
        {
            _context = context;
            _config = config;
        }

       

        public IDbConnection Connection
        {   
            get
            {
                var connection = new SqlConnection(_config.GetConnectionString("DefaultConnection"));
                try
                {
                     connection.Open();
                     return connection;
                }
                catch (System.Exception)
                {
                    connection.Close();
                    connection.Dispose();
                    throw;
                }
            }
        }
 

        public async Task<int> RegisterCargaMasiva(CargaMasivaForRegister command, IEnumerable<CargaMasivaDetalleForRegister> commandDetais )
        {
            CargaMasivaDetalle cargaMasivaDetalle ;
            CargaMasiva cargaMasiva = new CargaMasiva(); 
            cargaMasiva.estado_id = 1;
            cargaMasiva.fecha_registro = DateTime.Now;
            cargaMasiva.usuario_id  = 1; 

            List<CargaMasivaDetalle> cargaMasivaDetalles = new List<CargaMasivaDetalle>();

            using(var transaction = _context.Database.BeginTransaction())
            {

                await _context.AddAsync<CargaMasiva>(cargaMasiva);
                await _context.SaveChangesAsync();

                foreach (var item in commandDetais)
                {
                    cargaMasivaDetalle = new CargaMasivaDetalle();
                    cargaMasivaDetalle.cantidad = item.cantidad;
                    cargaMasivaDetalle.carga_id = cargaMasiva.id;
                    cargaMasivaDetalle.asignado = item.asignado;
                    cargaMasivaDetalle.carreta = item.carreta;
                    cargaMasivaDetalle.conductor = item.conductor.Trim();
                    cargaMasivaDetalle.delivery = item.delivery;
                    cargaMasivaDetalle.destinatario = item.destinatario.Trim();
                    cargaMasivaDetalle.direccion_carga = item.direccion_carga.Trim();
                    cargaMasivaDetalle.direccion_destino_servicio = item.direccion_destino_servicio.ToString().Trim();
                    cargaMasivaDetalle.direccion_entrega = item.direccion_entrega.ToString().Trim();

                    cargaMasivaDetalle.distrito_carga = item.distrito_carga;
                    cargaMasivaDetalle.distrito_destino_servicio = item.distrito_destino_servicio.Trim();
                    cargaMasivaDetalle.factura = item.factura;
                    cargaMasivaDetalle.fecha_carga = item.fecha_carga;
                    cargaMasivaDetalle.fecha_entrega = item.fecha_entrega;
                    cargaMasivaDetalle.fecha_salida = item.fecha_salida;
                    cargaMasivaDetalle.hora_carga = item.hora_carga;
                    cargaMasivaDetalle.hora_entrega = item.hora_entrega;
                    cargaMasivaDetalle.hora_salida = item.hora_salida;
                    cargaMasivaDetalle.oc = item.oc;
                    cargaMasivaDetalle.peso = item.peso;
                    cargaMasivaDetalle.guias = item.guias;

                    cargaMasivaDetalle.provincia = item.provincia;
                    cargaMasivaDetalle.remitente = item.remitente;
                    cargaMasivaDetalle.shipment = item.shipment;
                    cargaMasivaDetalle.tiposervicio = item.tiposervicio;

                    cargaMasivaDetalle.tracto = item.tracto;
                    cargaMasivaDetalle.volumen = item.volumen;
                    cargaMasivaDetalle.recojo  = item.recojo == "Si" ? true : false;
                    cargaMasivaDetalle.notificacion = item.notificacion;
                    cargaMasivaDetalle.costo = item.costo;
                    cargaMasivaDetalle.valorizado = item.valorizado;


                    cargaMasivaDetalles.Add(cargaMasivaDetalle);
                }

                await _context.AddRangeAsync(cargaMasivaDetalles);
                await _context.SaveChangesAsync();



                transaction.Commit();
                

                return cargaMasiva.id;
            }
        }

       public async Task<EquipoTransporte> RegisterEquipoTransporte(EquipoTransporte eq, List<long> ids)
        {
            using(var transaction = _context.Database.BeginTransaction())
            {

                var max = await _context.EquipoTransporte.MaxAsync(x=>x.Codigo);
                if(max==null) max = "EQ00000001";
                max  = "EQ" + (Convert.ToInt64(max.Substring(2,8)) + 1).ToString().PadLeft(8,'0');
                eq.Codigo = max;

                eq.FechaRegistro = DateTime.Now;
                eq.PropietarioId = eq.PropietarioId; 

                await _context.AddAsync<EquipoTransporte>(eq);
                await _context.SaveChangesAsync();

                if(ids != null){
                    foreach (var id in ids)
                    {
                        var ordentransporteDb = await _context.OrdenTransporte.Where(x=>x.id == id).SingleOrDefaultAsync();
                        ordentransporteDb.equipo_transporte_id = eq.Id;
                        await _context.SaveChangesAsync();
                    }
                }

                transaction.Commit();
                return eq;


            }
        }

        public async Task<bool> RegisterGeoLocalizacion(GeoEquipoTransporteForRegister geoEquipoTransporte)
        {
            var geo = new GeoEquipoTransporte();
            geo.lat = geoEquipoTransporte.lat;
            geo.lng = geoEquipoTransporte.lng;
            

        
            using(var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    //agregar estado cerrado y pendiente
                    var result = from  man in  _context.Manifiesto
                    join orden in _context.OrdenTransporte  on man.id equals orden.manifiesto_id
                    join equipo in _context.EquipoTransporte on orden.equipo_transporte_id equals equipo.Id
                    where equipo.ChoferId  == geoEquipoTransporte.usuario_id
                    select equipo;
                   

                    var equipoTransporte = result.OrderByDescending(x=>x.Id).First();


                    geo.equipo_transporte_id = equipoTransporte.Id;

                //    var manifiesto = _context.Manifiesto.Where(x=>x.usuario_id == geoEquipoTransporte.usuario_id).ToList();
                //    var ordenes = _context.OrdenTransporte.Where(x=>x.manifiesto_id == manifiesto[0].id).ToList();


                    // var equipoTransporte =  _context.EquipoTransporte
                    //                                 .Where(x=>x.Id == ordenes[0].equipo_transporte_id)
                    //                                 .FirstOrDefault();

                    //geo.equipo_transporte_id = equipoTransporte.Id;

                    await _context.AddAsync(geo);     
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (System.Exception)
                {
                    transaction.Rollback();
                    throw;
                }
               

            }
            return true;
        }

        public async Task<int> RegisterOrdenes(List<Manifiesto> manifiestosForRegisters, int usrid)
        {
            
            OrdenTransporte ordenTransporte ;
            Incidencia incidencia;
            List<Incidencia> incidencias;
            Manifiesto manifiesto; 
            List<OrdenTransporte> ordenTransportes;

            using(var transaction = _context.Database.BeginTransaction())
            {

                foreach (var man in manifiestosForRegisters)
                {
                        manifiesto = new Manifiesto();
                        ordenTransportes = new List<OrdenTransporte>();
                        incidencias = new List<Incidencia>();

                        manifiesto.fecha_registro = DateTime.Now;
                        manifiesto.usuario_id  = man.usuario_id; 
                        manifiesto.estado_id = (int) Constantes.EstadoManifiesto.Registrado;
                        

                        await _context.AddAsync<Manifiesto>(manifiesto);
                        await _context.SaveChangesAsync();

                        manifiesto.numero_manifiesto  =  "MAN-" + manifiesto.id.ToString().PadLeft(6,'0');
                        await _context.SaveChangesAsync();

                    foreach (var item in man.Ordenes) 
                    {
                        ordenTransporte = new OrdenTransporte();
                        ordenTransporte.cantidad = item.cantidad;
                        ordenTransporte.manifiesto_id = manifiesto.id;
                        ordenTransporte.por_asignar = item.por_asignar;
                        ordenTransporte.equipo_transporte_id = item.equipo_transporte_id;
                        ordenTransporte.delivery = item.delivery;
                        ordenTransporte.destinatario_id = item.destinatario_id;
                        ordenTransporte.destinatario = item.destinatario;
                        ordenTransporte.direccion_carga = item.direccion_carga;
                        ordenTransporte.direccion_destino_servicio = item.direccion_destino_servicio;
                        ordenTransporte.direccion_entrega = item.direccion_entrega;

                        ordenTransporte.distrito_carga_id = item.distrito_carga_id;
                        ordenTransporte.distrito_destino_servicio_id = item.distrito_destino_servicio_id;
                        ordenTransporte.factura = item.factura;
                        ordenTransporte.fecha_carga = item.fecha_carga;
                        ordenTransporte.fecha_entrega = item.fecha_entrega;
                        ordenTransporte.fecha_salida = item.fecha_salida;
                        ordenTransporte.hora_carga = item.hora_carga;
                        ordenTransporte.hora_entrega = item.hora_entrega;
                        ordenTransporte.hora_salida = item.hora_salida;
                        ordenTransporte.oc = item.oc;
                        ordenTransporte.guias = item.guias;
                        ordenTransporte.peso = item.peso;

                        ordenTransporte.provincia_entrega = item.provincia_entrega;
                        ordenTransporte.remitente_id = item.remitente_id;
                        ordenTransporte.shipment = item.shipment;
                        ordenTransporte.tiposervicio_id = item.tiposervicio_id;
                        
                        ordenTransporte.volumen = item.volumen;
                        ordenTransporte.estado_id = item.estado_id;
                        ordenTransporte.fecha_registro = DateTime.Now;
                        ordenTransporte.usuario_registro_id = usrid;
                        ordenTransporte.activo = true;
                        ordenTransporte.recojo = item.recojo;
                        ordenTransporte.notificacion = item.notificacion;
                        ordenTransporte.costo = item.costo;
                        ordenTransporte.valorizado = item.valorizado;
                        


                        ordenTransportes.Add(ordenTransporte);
                    }

                    await _context.AddRangeAsync(ordenTransportes);
                    await _context.SaveChangesAsync();

                    ordenTransportes.ForEach(x=>    
                       {
                            x.numero_ot =  "100" + "-" + x.id.ToString().PadLeft(6,'0');

                    });

                    await _context.SaveChangesAsync();



                     ordenTransportes.ForEach(x=>    
                       {
                            
                            incidencia = new Incidencia ();
                            incidencia.activo = true;
                            incidencia.descripcion = "";
                            incidencia.documento = "";
                            incidencia.fecha_incidencia = DateTime.Now;
                            incidencia.fecha_registro = DateTime.Now;
                            incidencia.maestro_incidencia_id = 1; 
                            incidencia.observacion = "";
                            incidencia.orden_trabajo_id = x.id;
                            incidencia.usuario_id = usrid;
                         
                            incidencias.Add(incidencia);

                            if(!x.por_asignar){
                                    incidencia = new Incidencia ();
                                    incidencia.activo = true;
                                    incidencia.descripcion = "";
                                    incidencia.documento = "";
                                    incidencia.fecha_incidencia = DateTime.Now;
                                    incidencia.fecha_registro = DateTime.Now;
                                    incidencia.maestro_incidencia_id = 2; 
                                    incidencia.observacion = "Asignada a " + GetEquipoTransporte(x.equipo_transporte_id.Value);
                                    incidencia.orden_trabajo_id = x.id;
                                    incidencia.usuario_id = 1;
                                    
                                    incidencias.Add(incidencia);
                            }


                        });

                        await _context.AddRangeAsync(incidencias);
                        await _context.SaveChangesAsync();


                   
                
                 }
                
                transaction.Commit();
                return 1;


            }
        }
        private string GetEquipoTransporte(long equipotransporteid)
        {
             var equipo =  _context.EquipoTransporte.Where(x=>x.Id == equipotransporteid).SingleOrDefaultAsync().Result;
             var vehiculo =  _context.Vehiculo.Where(x=>x.Id == equipo.VehiculoId).SingleOrDefault();
             var chofer = _context.Chofer.Where(x=>x.Id == equipo.ChoferId).SingleOrDefault();

             return vehiculo.Placa +  " - "  +  chofer.NombreCompleto;
        }

        public async Task<bool> ActualizarIncidencia (IncidenciaForUpdate incidencia )
        {
            using(var transaction = _context.Database.BeginTransaction())
            {
                try
                {
                    // var objIncidencia = await _context.Incidencias.Where(x=> x.id == incidencia.id).SingleOrDefaultAsync();
                    var objIncidencia = _context.Incidencias.Where(x=> x.id == incidencia.id).SingleOrDefault(); 
                    objIncidencia.fecha_incidencia      = incidencia.fecha;
                    objIncidencia.maestro_incidencia_id = incidencia.incidencia;
                    objIncidencia.descripcion = incidencia.observacion;
                    objIncidencia.fecha_modificacion= DateTime.Now;
                    objIncidencia.usuario_modificacion= incidencia.usuario;
                    await _context.SaveChangesAsync();
                    transaction.Commit();
                }
                catch (System.Exception)
                {
                    transaction.Rollback();
                    throw;
                    
                }
            }
            return true;
        }
     
    }
  
}