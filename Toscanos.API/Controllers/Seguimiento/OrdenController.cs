using System;
using Microsoft.Extensions.Configuration;
using CargaClic.Data.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using System.Net.Http.Headers;
using Toscanos.API.Data;
using CargaClic.Repository.Interface.Seguimiento;
using System.Threading.Tasks;
using CargaClic.Domain.Seguimiento;
using CargaClic.Repository.Contracts.Seguimiento;
using CargaClic.Domain.Mantenimiento;
using System.Linq;
using CargaClic.ReadRepository.Interface.Mantenimiento;
using CargaClic.Contracts.Parameters.Mantenimiento;
using Common.QueryHandlers;
using CargaClic.API.Dtos.Matenimiento;
using Microsoft.Extensions.FileProviders;
using Microsoft.AspNetCore.StaticFiles;
using CargaClic.Common;


namespace CargaClic.API.Controllers.Despacho
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrdenController : ControllerBase
    {

     
        private readonly IConfiguration _config;
        private readonly IOrdenRepository _repo;
        private readonly IMantenimientoReadRepository repoMantenimiento;
        private readonly IRepository<Vehiculo> _repo_Vehiculo;
        private readonly IRepository<Chofer> _repo_Chofer;
        private readonly IRepository<Incidencia> _repo_Incidencia;
        private readonly IRepository<Archivo> _repo_Archivo;
        private readonly IRepository<Manifiesto> _repo_Manifiesto;
        private readonly IRepository<OrdenTransporte> _repo_OrdenTransporte;
        private readonly IRepository<CargaMasivaDetalle> _repo_CargaMasiva;
        private readonly IQueryHandler<ObtenerEquipoTransporteParameter> _handlerEqTransporte;
        private readonly IRepository<Cliente> _repo_cliente;
        private readonly Seguimiento _seguimiento;
        private readonly Reporte _reporte;

        public OrdenController(IConfiguration config, 
          IOrdenRepository repo,
          IMantenimientoReadRepository repoMantenimiento,
          IRepository<Vehiculo> repo_Vehiculo,
          IRepository<Chofer> repo_Chofer,
          IRepository<OrdenTransporte> repo_OrdenTransporte,
          IRepository<CargaMasivaDetalle> repo_CargaMasiva,
          IRepository<Incidencia> repo_Incidencia,
          IRepository<Archivo> repo_Archivo,
          IRepository<Manifiesto> repo_Manifiesto,
          IQueryHandler<ObtenerEquipoTransporteParameter> handlerEqTransporte,
          IRepository<Cliente> repo_cliente,
          Reporte reporte,
          Seguimiento seguimiento) {
        
            _config = config;
            _repo = repo;
            this.repoMantenimiento = repoMantenimiento;
            _handlerEqTransporte = handlerEqTransporte;
            _repo_cliente = repo_cliente;
            _repo_Vehiculo = repo_Vehiculo;
            _repo_Chofer = repo_Chofer;
            _repo_OrdenTransporte = repo_OrdenTransporte;
            _repo_CargaMasiva = repo_CargaMasiva;
            _seguimiento = seguimiento;
            _repo_Incidencia = repo_Incidencia;
            _repo_Archivo = repo_Archivo;
            _repo_Manifiesto = repo_Manifiesto;
            _reporte  = reporte;
        }
        [HttpPost("UploadFile")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFile(int usrid)
        {
          // var seguimiento = new Seguimiento();
            try
            {
                // Grabar Excel en disco
                string fullPath = await SaveFile(0);
                // Leer datos de excel
                var celdas = _seguimiento.GetExcel(fullPath);
                // Generar entidades
                var entidades = _seguimiento.ObtenerEntidades_CargaMasiva(celdas);
                // Grabar entidades en base de datos
                
                var carga = new CargaMasivaForRegister();
                carga.estado_id = 1;
                carga.fecha_registro = DateTime.Now;
            
                var resp =  await _repo.RegisterCargaMasiva(carga, entidades);

                //Generar Ordenes de trabajo y Manifiestos      
                var detalles_cargados =  _repo_CargaMasiva.GetAll(x=>x.carga_id == resp).Result;


                var lista = detalles_cargados.ToList();
                var manifiestos = _seguimiento.ObtenerEntidades_Manifiesto(lista);
                //Registrar manifiestos 
                await _repo.RegisterOrdenes(manifiestos,usrid);

                

            }
            catch (System.Exception ex)
            {
                return Ok(ex.Message);
                throw ex;
              
            }
            return Ok();
         }
        private async Task<string> SaveFile(long usuario_id)
        {
            
            var fullPath = string.Empty;
          
            
            var ruta =  _config.GetSection("AppSettings:Uploads").Value;

            var file = Request.Form.Files[0];
            var idOrden = usuario_id;

            string folderName = idOrden.ToString();
            string webRootPath = ruta ;
            string newPath = Path.Combine(webRootPath, folderName);

            byte[] fileData = null;
            using (var binaryReader = new BinaryReader(Request.Form.Files[0].OpenReadStream()))
            {
                fileData = binaryReader.ReadBytes(Request.Form.Files[0].ContentDisposition.Length);
            }

            if (!Directory.Exists(newPath))
            {
                Directory.CreateDirectory(newPath);
            }
            if (file.Length > 0)
            {
                string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                fullPath = Path.Combine(newPath, fileName);

                var checkextension = Path.GetExtension(fileName).ToLower();
                using (var stream = new FileStream(fullPath, FileMode.Create))
                {

                    file.CopyTo(stream);
                    await _repo_OrdenTransporte.SaveAll();
                    
                }

            }
            return fullPath;

        }
        [HttpGet("GetAllOrder")]
        public async Task<IActionResult> GetAllOrder(int? remitente_id, int? estado_id, int usuario_id, string fec_ini, string fec_fin)
        {
             var result  = await _seguimiento.Listar_OrdensTransporte(remitente_id,  estado_id, usuario_id, fec_ini, fec_fin);
             return Ok(result);
        }
        [HttpGet("GetChofer")]
        public async Task<IActionResult> GetChofer(int usrid)
        {
             var result  = await _repo_Chofer.Get(x=>x.UsuarioId == usrid);
             return Ok(result.Id);
        }
        [HttpGet("GetAllOrderByManifiesto")]
        public async Task<IActionResult> GetAllOrderByManifiesto(int manifiestoId)
        {
             var result  = await _seguimiento.Listar_OrdensTransporte(manifiestoId);
             return Ok(result);
        }

         [HttpGet("SearchOrden")]
        public async Task<IActionResult> SearchOrden(string criterio, int dias)
        {
             var result  = await _seguimiento.BuscarOrdensTransporte(criterio,dias);
             return Ok(result);
        }

        [HttpGet("GetAllOrderByManifiestoCliente")]
        public async Task<IActionResult> GetAllOrderByManifiestoCliente(int manifiestoId, int UsuarioId)
        {
             var result  = await _seguimiento.Listar_OrdensTransportCliente(manifiestoId, UsuarioId);
             return Ok(result);
        }
        
        [HttpGet("GetAllIncidencias")]
        public async Task<IActionResult> GetAllIncidencias(long OrdenTransporteId)
        {
             var result  = await _seguimiento.Listar_Incidencias(OrdenTransporteId);
             return Ok(result);
        }

        [HttpGet("GetMaestroIncidencias")]
        public async Task<IActionResult> GetMaestroIncidencias()
        {
             var result  = await _seguimiento.GetMaestroIncidencias();
             return Ok(result);
        }

        [HttpGet("GetDatosIncidencia")]
        public async Task<IActionResult> GetDatosIncidencia(long incidencia)
        {
             var result  = await _seguimiento.GetDatosIncidencia(incidencia);
             return Ok(result);
        }
        
        [HttpGet("GetAllManifiesto")]
        public async Task<IActionResult> GetAllManifiesto(int ChoferId)
        {
             var result  = await _seguimiento.Listar_Manifiesto(ChoferId);
             return Ok(result);
        }

        [HttpGet("GetEstadisticasMobile")]
        public async Task<IActionResult> GetEstadisticasMobile(int cliente_id)
        {
             var result  = await _seguimiento.GetEstadisticas(cliente_id);
             return Ok(result);
        }
        

        [HttpGet("GetAllManifiestoCliente")]
        public async Task<IActionResult> GetAllManifiestoCliente(int UsuarioId)
        {
             var result  = await _seguimiento.Listar_Manifiesto_Cliente(UsuarioId);
             return Ok(result);
        }
        [HttpDelete("DeleteFile")]
        public async Task<IActionResult> DeleteFile(int documentoId)
        {
             var result  = await _repo_Archivo.Get(x=>x.idarchivo ==documentoId );
             _repo_Archivo.Delete(result);
             await _repo_Archivo.SaveAll();
             return Ok(result);
        }



        [HttpPost("RegisterIncidencia")]
        public async Task<IActionResult> RegisterIncidencia(IncidenciaForRegister incidencia)
        {
            var createdProveedor = await _seguimiento.RegisterIncidencia(incidencia);
            return Ok(createdProveedor);
        }

        
        [HttpPost("IniciarTransitoFluvial")]
        public async Task<IActionResult> IniciarTransitoFluvial(ConfirmarEntregaDto model)
        {
             EquipoTransporte equipotransporte = null;
            var incidencia = new Incidencia();
            var ordentrabajo = await  _repo_OrdenTransporte.Get(x=>x.id == model.idordentrabajo); 
             Chofer chofer = null;

            ordentrabajo.estado_id = (int) Constantes.EstadoOrdenTransporte.EnTransitoFluvial;
            incidencia.maestro_incidencia_id = 11;
            ordentrabajo.reconocimento_embarque = model.reconocimiento_embarque;
            ordentrabajo.numero_lancha = model.numero_lancha;
            incidencia.observacion = "En Tránsito fluvial " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();

            incidencia.activo = true;
            incidencia.descripcion = "";
            incidencia.fecha_incidencia = DateTime.Now;
            incidencia.fecha_registro = DateTime.Now;
            incidencia.orden_trabajo_id = model.idordentrabajo;


            if(ordentrabajo.equipo_transporte_id.HasValue)
            {
                equipotransporte =   _seguimiento.GetEquipoTransporte(ordentrabajo.equipo_transporte_id.Value);
                chofer = await _repo_Chofer.Get(x=>x.Id == equipotransporte.ChoferId );
            }

                if(chofer != null)
                     incidencia.usuario_id = chofer.UsuarioId;
                else incidencia.usuario_id = 1;


                await _repo_Incidencia.AddAsync(incidencia);
                await _repo_OrdenTransporte.SaveAll();
          
            return Ok("ordentrabajo");
        } 
        [HttpPost("CambiarEstadoOrden")]
        public async Task<IActionResult> CambiarEstadoOrden(long idOrden)
        {
            var incidencia = new Incidencia();
            EquipoTransporte equipotransporte = null;
            string SMTP_SERVER =  _config.GetSection("AppSettings:SMTPSERVER").Value;
            string SMTP_MAIL =  _config.GetSection("AppSettings:MAIL_SMTP").Value;
            string SMTP_PASSWORD =  _config.GetSection("AppSettings:SMTP_PASSWORD").Value;
            string CORREO_PRUEBA =  _config.GetSection("AppSettings:PRUEBA_CORREO").Value;
            Chofer chofer = null;
            

            var ordenTransporte =  await _repo_OrdenTransporte.Get(x=>x.id == idOrden);

       
            if(ordenTransporte.equipo_transporte_id.HasValue)
            {
                equipotransporte =   _seguimiento.GetEquipoTransporte(ordenTransporte.equipo_transporte_id.Value);
                 chofer = await _repo_Chofer.Get(x=>x.Id == equipotransporte.ChoferId);
            }
            
            if(ordenTransporte.estado_id == 11)
            {
                    incidencia.activo = true;
                    incidencia.maestro_incidencia_id = (Int32) Constantes.EstadoOrdenTransporte.EnRuta;
                    incidencia.observacion = "Esta incidencia es de prueba";
                    incidencia.descripcion = "";
                    incidencia.fecha_incidencia = DateTime.Now;
                    incidencia.fecha_registro = DateTime.Now;
                    incidencia.orden_trabajo_id = idOrden;
                    if(chofer != null)
                        incidencia.usuario_id = chofer.UsuarioId;
                    else incidencia.usuario_id = 1;
                    
                    await _repo_Incidencia.AddAsync(incidencia);

                    return Ok(ordenTransporte);
            }

            ordenTransporte.estado_id = ordenTransporte.estado_id + 1  ;
            if(ordenTransporte.estado_id == 7)
            {
                  ordenTransporte.estado_id = (Int32) Constantes.EstadoOrdenTransporte.EnRuta;
            }
            else if(ordenTransporte.estado_id == 8)
            {
                    ordenTransporte.estado_id =(Int32) Constantes.EstadoOrdenTransporte.EnRuta;
                   if(ordenTransporte.recojo == true)
                   {
                      ordenTransporte.estado_id =(Int32) Constantes.EstadoOrdenTransporte.FinRecojo;
                   } 
            }
            else if(ordenTransporte.estado_id == 37)
            {
                ordenTransporte.estado_id =(Int32) Constantes.EstadoOrdenTransporte.EnRuta;

            }
            await _repo_OrdenTransporte.SaveAll();

     

            if(ordenTransporte.estado_id  == 6)
            {
                incidencia.maestro_incidencia_id = 3;
                incidencia.observacion = "Llegada al punto de recojo " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();
            }
            else if(ordenTransporte.estado_id  == 8)
            {
                incidencia.maestro_incidencia_id = 5;
                incidencia.observacion = "Inicio de ruta " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();

                // Envío de mail....
                // var cliente = await _repo_cliente.Get(x=>x.id == ordenTransporte.destinatario_id);
                // if(cliente.mail_notificacion != null || cliente.mail_notificacion != string.Empty)
                //         CORREO_PRUEBA = CORREO_PRUEBA + ";"  + cliente.mail_notificacion;

                // var provincia = _seguimiento.ObtenerProvincia(ordenTransporte.provincia_entrega.Value);

                // var vehiculo = await _repo_Vehiculo.Get(x => x.Id == equipotransporte.VehiculoId);
             
                
                // string htmlString = @"<html>
                //         <body>
                //         <table border='0' cellspacing='0' cellpadding='0' width='600' style='width:450.0pt;border-collapse:collapse' id='m_-8533450555590531398title'><tbody><tr style='height:18.75pt'><td width='25' style='width:18.75pt;padding:0cm 0cm 0cm 0cm;height:18.75pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td style='padding:0cm 0cm 0cm 0cm;height:18.75pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td width='25' style='width:18.75pt;padding:0cm 0cm 0cm 0cm;height:18.75pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td width='25' style='width:18.75pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal' align='center' style='text-align:center'><strong><span style='font-size:16.5pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#db0414;letter-spacing:-.4pt'>Tu pedido está en camino </span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif'><u></u><u></u></span></p></td><td width='25' style='width:18.75pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr style='height:21.0pt'><td width='25' style='width:18.75pt;padding:0cm 0cm 0cm 0cm;height:21.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td style='padding:0cm 0cm 0cm 0cm;height:21.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td width='25' style='width:18.75pt;padding:0cm 0cm 0cm 0cm;height:21.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table>
                //         <table border='0' cellspacing='0' cellpadding='0' width='600' style='width:450.0pt;border-collapse:collapse' id='m_-8533450555590531398content'><tbody><tr><td width='25' style='width:18.75pt;border:none;border-bottom:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td style='border:none;border-bottom:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><div align='center'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse' id='m_-8533450555590531398inner-content'><tbody><tr><td valign='top' style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>

                //         <span style='font-size:11.5pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //             Estimados: "+ cliente.razon_social + @" 
                //         </span>
                        
                //         <span style='font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr><tr style='height:14.25pt'><td style='padding:0cm 0cm 0cm 0cm;height:14.25pt'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal' style='text-align:justify'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //         <br>La unidad a cargo de la entrega de tu pedido, estará aproximadamente a las "+ ordenTransporte.hora_entrega  + @" en la dirección de despacho que nos indicaste. <u></u><u></u></span></p></td></tr><tr style='height:14.25pt'><td style='padding:0cm 0cm 0cm 0cm;height:14.25pt'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td></tr></tbody></table></td></tr></tbody></table></td><td width='20' style='width:15.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td width='170' valign='top' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td style='padding:0cm 0cm 0cm 0cm'></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm;border-radius:3px'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr style='height:22.5pt'><td style='background:#db0414;padding:0cm 0cm 0cm 0cm;height:22.5pt'><p class='MsoNormal' align='center' style='text-align:center'><span style='font-family:&quot;Helvetica&quot;,sans-serif;color:black'> <a href='http://104.36.166.65/toscanos/#/seguimiento/verorden/"+ ordenTransporte.id + @"'><span style='font-size:11.5pt;color:white;text-decoration:none'>Rastrear mi pedido</span></a> </span><span style='font-family:&quot;Helvetica&quot;,sans-serif'><u></u><u></u></span></p></td></tr></tbody></table></td></tr><tr style='height:10.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:10.5pt'></td></tr></tbody></table></td></tr></tbody></table></div></td><td width='25' style='width:18.75pt;border:none;border-bottom:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table>
                        
                //         <table border='0' cellspacing='0' cellpadding='0' width='100%' 
                //         style='width:100.0%;border-collapse:collapse'><tbody><tr style='height:22.5pt'>
                //         <td style='background:#db0414;padding:0cm 0cm 0cm 0cm;height:22.5pt'><p class='MsoNormal' 
                //         align='center' style='text-align:center'><span style='font-family:&quot;Helvetica&quot;,sans-serif;color:black'>
                       
                       
                //          <span style='font-family:&quot;Helvetica&quot;,sans-serif'><u></u><u></u></span></p></td></tr></tbody></table>
                //         <p>   
                //         </body>
                //         <table border='0' cellspacing='0' cellpadding='0' width='600' style='width:450.0pt;border-collapse:collapse' id='m_-1387954621597574012order-details'><tbody><tr style='height:15.0pt'><td width='25' style='width:18.75pt;border:none;border-top:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm;height:15.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td style='border:none;border-top:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm;height:15.0pt'><div align='center'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse' id='m_-1387954621597574012inner-content'><tbody><tr><td valign='top' style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:11.5pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#db0414'>Datos del envío:</span></strong><span style='font-family:&quot;Helvetica&quot;,sans-serif'> <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td width='170' valign='top' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong>
                //         <span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Fecha de Pedido:</span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr>
                //         <tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'>
                //         <span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>

                //         " +  ordenTransporte.fecha_registro.ToShortDateString() + @"
                        
                //         <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table></td><td width='9' style='width:6.75pt;border:none;border-right:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td><td width='10' style='width:7.5pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td><td width='170' valign='top' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Fecha de Entrega:</span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //         "+ ordenTransporte.fecha_entrega.Value.ToShortDateString() +@"
                //         <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table></td><td width='9' style='width:6.75pt;border:none;border-right:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td></tr><tr><td width='170' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Domicilio de Entrega:</span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //         "+ ordenTransporte.direccion_entrega + @"
                        
                //         <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table></td><td width='9' style='width:6.75pt;border:none;border-right:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td><td width='10' style='width:7.5pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td><td width='170' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Número de Teléfono:</span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr>
                //         <tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp;<u></u><u></u></span></p></td></tr></tbody></table></td><td width='9' style='width:6.75pt;border:none;border-right:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td></tr><tr><td width='170' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Distrito:</span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //         "+ provincia + @"
                        
                //         <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>&nbsp;<u></u><u></u></span></p></td></tr><tr style='height:12.0pt'><td style='padding:0cm 0cm 0cm 0cm;height:12.0pt;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //         # Orden de Transporte </span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'><u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //         "+  ordenTransporte.numero_ot  + @" 
                //         <u></u><u></u></span></p></td></tr><tr style='height:30.0pt'><td style='padding:0cm 0cm 0cm 0cm;height:30.0pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table></td><td width='9' style='width:6.75pt;border:none;border-right:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp;<u></u><u></u></p></td><td width='10' style='width:7.5pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp;<u></u><u></u></p></td><td width='170' valign='top' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Nro. Entrega:</span></strong><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'><u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' style='word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td></tr>

                //         <tr style='height:30.0pt'><td style='padding:0cm 0cm 0cm 0cm;height:30.0pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table></td><td width='9' style='width:6.75pt;border:none;border-right:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'>&nbsp;<u></u><u></u></p></td></tr></tbody></table></td></tr></tbody></table></td><td width='10' style='width:7.5pt;padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td width='170' valign='top' style='width:127.5pt;padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:11.5pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#db0414'>Información de Chofer:</span></strong><span style='font-family:&quot;Helvetica&quot;,sans-serif'> <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal' align='center' style='text-align:center'><span style='font-size:1.0pt'><img border='0' height='95' style='height:.9895in' id='m_-1387954621597574012_x0000_i1026' src='https://ci3.googleusercontent.com/proxy/Md5He3hPe9rJeJALU5ArtgdTYUhgRbRT82SpKo3pAwsTu13eV1QAzy4TPKwlF0qXMShaSEpjxx_5YBxs_B1wWxOVIUhyGRMq4U6hSKtL4-dw5Rx6nUxvWJv5YjjtlzNB-Rc-y2JjHA=s0-d-e1-ft#http://toscargo.e-strategit.com/Public/Imagenes/Chofer/fotochofer_06082019050819.png' alt='Foto conductor' class='CToWUd'><u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td valign='top' style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:9.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Nombre:</span></strong><span style='font-size:9.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td><td width='105' style='width:78.75pt;padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' align='right' style='text-align:right;word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>&nbsp;<u></u><u></u></span></p></td></tr></tbody></table></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt;word-wrap:break-word'><p class='MsoNormal' align='right' style='text-align:right;word-break:break-all'><span style='font-size:8.5pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //         "+   chofer.NombreCompleto   +@"
                //          <u></u><u></u></span></p></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td valign='top' style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:9.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>DNI:</span></strong><span style='font-size:9.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td><td width='105' style='width:78.75pt;padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' align='right' style='text-align:right;word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //          "+ chofer.Dni +@"
                //          <u></u><u></u></span></p></td></tr></tbody></table></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'>&nbsp; <u></u><u></u></p></td></tr><tr><td style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td valign='top' style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><strong><span style='font-size:9.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>Placa:</span></strong><span style='font-size:9.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'> <u></u><u></u></span></p></td><td width='105' style='width:78.75pt;padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' align='right' style='text-align:right;word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>
                //          " + vehiculo.Placa +@"
                //           <u></u><u></u></span></p></td></tr></tbody></table></td></tr>
                //         <tr><td style='padding:0cm 0cm 0cm 0cm'><table border='0' cellspacing='0' cellpadding='0' width='100%' style='width:100.0%;border-collapse:collapse'><tbody><tr><td valign='top' style='padding:0cm 0cm 0cm 0cm'><p class='MsoNormal'><span style='font-size:9.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>&nbsp;<u></u><u></u></span></p></td><td width='105' style='width:78.75pt;padding:0cm 0cm 0cm 0cm;word-wrap:break-word'><p class='MsoNormal' align='right' style='text-align:right;word-break:break-all'><span style='font-size:10.0pt;font-family:&quot;Helvetica&quot;,sans-serif;color:#666666'>&nbsp;<u></u><u></u></span></p></td></tr></tbody></table></td></tr><tr style='height:7.5pt'><td style='padding:0cm 0cm 0cm 0cm;height:7.5pt'><p class='MsoNormal'><span style='font-size:1.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table></td></tr></tbody></table></div></td><td width='25' style='width:18.75pt;border:none;border-top:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm;height:15.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td></tr><tr style='height:15.0pt'><td width='25' style='width:18.75pt;border:none;border-bottom:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm;height:15.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td style='border:none;border-bottom:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm;height:15.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td><td width='25' style='width:18.75pt;border:none;border-bottom:solid #f2f2f2 1.0pt;padding:0cm 0cm 0cm 0cm;height:15.0pt'><p class='MsoNormal'><span style='font-size:10.0pt'>&nbsp; <u></u><u></u></span></p></td></tr></tbody></table>
                //         </html>";   

                //string body =  "Se ha registrado una entrega (" +  model.descripcion + " ) para la OT " + ordentrabajo.numero_ot;
                // try
                // {
                           
                //         // MailHelper.EnviarMail(true,SMTP_SERVER,SMTP_MAIL,SMTP_PASSWORD,CORREO_PRUEBA,
                //         //     "",   ordenTransporte.numero_ot , htmlString,true );
                // }
                // catch(Exception ex)
                // {

                // }
                
            }
                
            else if(ordenTransporte.estado_id  == 9)
            {
                incidencia.maestro_incidencia_id = 6;
                   incidencia.observacion = "Llegada a destino " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();
            }
            
            else if(ordenTransporte.estado_id  == 10)
            {
                incidencia.maestro_incidencia_id = 7;
                   incidencia.observacion = "Descarga de la mercadería " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();
            }

            else if(ordenTransporte.estado_id  == 11)
            {
                incidencia.maestro_incidencia_id = 8;
                   incidencia.observacion = "Término de descarga " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();
            }
            else if (ordenTransporte.estado_id == 36)
            {
                    incidencia.maestro_incidencia_id = 19;
                   incidencia.observacion = "Fin de Recojo " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();
            }
            else if (ordenTransporte.estado_id == 41)
            {
                   
                   incidencia.maestro_incidencia_id = 13;
                   incidencia.observacion = "Fin del desembarque " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();
            }
            // else if(ordenTransporte.estado_id  == 12)
            // {
            //     incidencia.maestro_incidencia_id = 9;
            //        incidencia.observacion = "Término de descarga " + DateTime.Now.ToShortDateString() + "  -  "+ DateTime.Now.ToShortTimeString();
            // }
            //  ordenTransporte =  await _repo_OrdenTransporte.Get(x=>x.id == idOrden);
            
            incidencia.activo = true;
            incidencia.descripcion = "";
            incidencia.fecha_incidencia = DateTime.Now;
            incidencia.fecha_registro = DateTime.Now;
            incidencia.orden_trabajo_id = idOrden;
            if(chofer != null)
                incidencia.usuario_id = chofer.UsuarioId;
            else incidencia.usuario_id = 1;
            
           

            await _repo_Incidencia.AddAsync(incidencia);

            return Ok(ordenTransporte);



        }
        [HttpPost("UploadFileConfirm")]
        [DisableRequestSizeLimit]
        public async Task<IActionResult> UploadFileConfirm()
        {

            var archivo = new Archivo() ;

            try
            {
                
                var ruta =  _config.GetSection("AppSettings:Uploads").Value;

                var file = Request.Form.Files[0];
                var idOrden = Request.Form["idOrden"];
                
            
                var objOrden = await _repo_OrdenTransporte.Get(x=>x.id == long.Parse(idOrden.ToString()));
                
                if(objOrden.cantidad_fotos == null)
                    objOrden.cantidad_fotos  = 1;
                else
                    objOrden.cantidad_fotos = objOrden.cantidad_fotos + 1;
            
 

                string folderName = idOrden;
                string webRootPath = ruta ;
                string newPath = Path.Combine(webRootPath, folderName);
                

                byte[] fileData = null;
                using (var binaryReader = new BinaryReader(Request.Form.Files[0].OpenReadStream()))
                {
                    fileData = binaryReader.ReadBytes(Request.Form.Files[0].ContentDisposition.Length);
                }

                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);

                    var checkextension = Path.GetExtension(fileName).ToLower();

                  
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {

                        file.CopyTo(stream);
                        
                        archivo.extension = checkextension;
                        archivo.nombrearchivo = fileName;
                        archivo.rutaacceso = newPath;
                        archivo.idordentrabajo = long.Parse(idOrden);

                        await this._repo_Archivo.AddAsync(archivo);
                        await this._repo_OrdenTransporte.SaveAll();


                    }
                }
                return Ok();
            }
            catch (System.Exception ex)
            {
                 return Ok();
            }
        }
        [HttpPost("UploadFileConfirm2")]
        [DisableRequestSizeLimit]
        public IActionResult UploadFileConfirm2(long id)
        {

            var archivo = new Archivo() ;

            try
            {
                
                var ruta =  _config.GetSection("AppSettings:Uploads").Value;

                var file = Request.Form.Files[0];
                var idOrden = id.ToString(); //Request.Form["idOrden"];
                
             
 

                string folderName = idOrden;
                string webRootPath = ruta ;
                string newPath = Path.Combine(webRootPath, folderName);
                

                byte[] fileData = null;
                using (var binaryReader = new BinaryReader(Request.Form.Files[0].OpenReadStream()))
                {
                    fileData = binaryReader.ReadBytes(Request.Form.Files[0].ContentDisposition.Length);
                }

                if (!Directory.Exists(newPath))
                {
                    Directory.CreateDirectory(newPath);
                }
                if (file.Length > 0)
                {
                    string fileName = ContentDispositionHeaderValue.Parse(file.ContentDisposition).FileName.Trim('"');
                    string fullPath = Path.Combine(newPath, fileName);

                    var checkextension = Path.GetExtension(fileName).ToLower();

                  
                    using (var stream = new FileStream(fullPath, FileMode.Create))
                    {

                        file.CopyTo(stream);
                        
                        archivo.extension = checkextension;
                        archivo.nombrearchivo = fileName;
                        archivo.rutaacceso = newPath;
                        archivo.idordentrabajo = long.Parse(idOrden);

                        this._repo_Archivo.AddAsync(archivo);


                    }
                }
                return Ok();
            }
            catch (System.Exception ex)
            {
                 return Ok();
            }
        }
        [HttpPost("ConfirmarEntrega")]
        public async Task<IActionResult> ConfirmarEntrega(ConfirmarEntregaDto model)
        {
           
            string SMTP_SERVER =  _config.GetSection("AppSettings:SMTPSERVER").Value;
            string SMTP_MAIL =  _config.GetSection("AppSettings:MAIL_SMTP").Value;
            string SMTP_PASSWORD =  _config.GetSection("AppSettings:SMTP_PASSWORD").Value;
            string CORREO_PRUEBA =  _config.GetSection("AppSettings:PRUEBA_CORREO").Value;

            var incidencia = new IncidenciaForRegister();
            model.visible = true;

         

            var ordentrabajo = await _seguimiento.Obtener_OrdenTransporte(model.idordentrabajo);
            
           var _ordentrabajo = await  _repo_OrdenTransporte.Get(x=>x.id == model.idordentrabajo);

            // if(ordentrabajo.remitente_id == 134 || _ordentrabajo.remitente_id == 225  || _ordentrabajo.remitente_id == 239) {
            //     //var documentos = await _seguimiento.GetAllDocuments(model.idordentrabajo);
            //     if(_ordentrabajo.cantidad_fotos == 0 || _ordentrabajo.cantidad_fotos == null) {
            //                 return Ok("0");
            //     }
            // }
         
            var cliente_remitente = await _repo_cliente.Get(x=>x.id == ordentrabajo.remitente_id);

            if(ordentrabajo.notificacion != null)
               CORREO_PRUEBA = CORREO_PRUEBA + ";"  + ordentrabajo.notificacion;
            
            if (cliente_remitente.mail_notificacion != string.Empty)
                CORREO_PRUEBA = CORREO_PRUEBA + ";"  + cliente_remitente.mail_notificacion;



            
         //   var _ordentrabajo = await  _repo_OrdenTransporte.Get(x=>x.id == model.idordentrabajo);

            if(model.idtipoentrega == 15) { // OK
                        _ordentrabajo.estado_id = (int)Constantes.EstadoOrdenTransporte.Finalizado;
                        _ordentrabajo.fecha_entrega = DateTime.Now;
                        _ordentrabajo.lat_entrega =  model.lat;
                        _ordentrabajo.lng_entrega = model.lng;
                        _ordentrabajo.tipo_entrega_id = 15;
                        
            }
            else if( model.idtipoentrega == 16 ){ // PARCIAL
                         _ordentrabajo.estado_id = (int)Constantes.EstadoOrdenTransporte.Finalizado;
                        _ordentrabajo.fecha_entrega = DateTime.Now;
                        _ordentrabajo.lat_entrega =  model.lat;
                        _ordentrabajo.lng_entrega = model.lng;
                        _ordentrabajo.tipo_entrega_id = 16;
            }
            else if( model.idtipoentrega == 17 ){ // RECHAZO
                         _ordentrabajo.estado_id = (int)Constantes.EstadoOrdenTransporte.Finalizado;
                        _ordentrabajo.fecha_entrega = DateTime.Now;
                        _ordentrabajo.lat_entrega =  model.lat;
                        _ordentrabajo.lng_entrega = model.lng;
                        _ordentrabajo.tipo_entrega_id = 17;
            }
            
            incidencia.activo = true;
            incidencia.descripcion = model.descripcion ;
            incidencia.fecha_incidencia = DateTime.Now;
            incidencia.fecha_registro = DateTime.Now;
            incidencia.orden_trabajo_id = model.idordentrabajo;
            incidencia.usuario_id =  model.usuario_id;
           // incidencia.maestro_incidencia_id = model.idtipoentrega;
            //await _seguimiento.RegisterIncidencia(incidencia);

            
            incidencia.maestro_incidencia_id = model.idmaestroetapa;
            await _seguimiento.RegisterIncidencia(incidencia);

             

            // await _repo_Incidencia.AddAsync(incidencia);
             await _repo_OrdenTransporte.SaveAll();


            string htmlString =  _seguimiento.GetBodyMail(ordentrabajo.id.ToString(), ordentrabajo.destinatario,
            ordentrabajo.fecha_carga.ToShortDateString() , ordentrabajo.direccion_entrega , ordentrabajo.provincia_entrega
            ,ordentrabajo.numero_ot, ordentrabajo.Chofer, ordentrabajo.dni, ordentrabajo.Tracto,
            model.lat.ToString(), model.lng.ToString()) ;
                  

       

            string body =  "Se ha registrado una entrega (" +  model.descripcion + " ) para la OT " + _ordentrabajo.numero_ot;
                try
                {
                     MailHelper.EnviarMail(true,SMTP_SERVER,SMTP_MAIL,SMTP_PASSWORD,CORREO_PRUEBA,
                            "",   ordentrabajo.numero_ot , htmlString,true );

                             return Ok("ordentrabajo");
                }
                catch (System.Exception ex)
                {
                    
                  return Ok(ex)  ;
                }
            
        }
         [HttpPost("ConfirmarEntrega2")]
        public async Task<IActionResult> ConfirmarEntrega2(ConfirmarEntregaDto model)
        {
           
            string SMTP_SERVER =  _config.GetSection("AppSettings:SMTPSERVER").Value;
            string SMTP_MAIL =  _config.GetSection("AppSettings:MAIL_SMTP").Value;
            string SMTP_PASSWORD =  _config.GetSection("AppSettings:SMTP_PASSWORD").Value;
            string CORREO_PRUEBA =  _config.GetSection("AppSettings:PRUEBA_CORREO").Value;

            var incidencia = new IncidenciaForRegister();
            model.visible = true;

         

            var ordentrabajo = await _seguimiento.Obtener_OrdenTransporte(model.idordentrabajo);
            
           var _ordentrabajo = await  _repo_OrdenTransporte.Get(x=>x.id == model.idordentrabajo);

            if(ordentrabajo.remitente_id == 134 || _ordentrabajo.remitente_id == 225  || _ordentrabajo.remitente_id == 239) {
                //var documentos = await _seguimiento.GetAllDocuments(model.idordentrabajo);
                if(_ordentrabajo.cantidad_fotos == 0 || _ordentrabajo.cantidad_fotos == null) {
                            return Ok("0");
                }
            }
         
            var cliente_remitente = await _repo_cliente.Get(x=>x.id == ordentrabajo.remitente_id);

            if(ordentrabajo.notificacion != null)
               CORREO_PRUEBA = CORREO_PRUEBA + ";"  + ordentrabajo.notificacion;
            
            if (cliente_remitente.mail_notificacion != string.Empty)
                CORREO_PRUEBA = CORREO_PRUEBA + ";"  + cliente_remitente.mail_notificacion;



            
         //   var _ordentrabajo = await  _repo_OrdenTransporte.Get(x=>x.id == model.idordentrabajo);

            if(model.idtipoentrega == 15) { // OK
                        _ordentrabajo.estado_id = (int)Constantes.EstadoOrdenTransporte.Finalizado;
                        _ordentrabajo.fecha_entrega = DateTime.Now;
                        _ordentrabajo.lat_entrega =  model.lat;
                        _ordentrabajo.lng_entrega = model.lng;
                        _ordentrabajo.tipo_entrega_id = 15;
                        
            }
            else if( model.idtipoentrega == 16 ){ // PARCIAL
                         _ordentrabajo.estado_id = (int)Constantes.EstadoOrdenTransporte.Finalizado;
                        _ordentrabajo.fecha_entrega = DateTime.Now;
                        _ordentrabajo.lat_entrega =  model.lat;
                        _ordentrabajo.lng_entrega = model.lng;
                        _ordentrabajo.tipo_entrega_id = 16;
            }
            else if( model.idtipoentrega == 17 ){ // RECHAZO
                         _ordentrabajo.estado_id = (int)Constantes.EstadoOrdenTransporte.Finalizado;
                        _ordentrabajo.fecha_entrega = DateTime.Now;
                        _ordentrabajo.lat_entrega =  model.lat;
                        _ordentrabajo.lng_entrega = model.lng;
                        _ordentrabajo.tipo_entrega_id = 17;
            }
            
            incidencia.activo = true;
            incidencia.descripcion = model.descripcion ;
            incidencia.fecha_incidencia = DateTime.Now;
            incidencia.fecha_registro = DateTime.Now;
            incidencia.orden_trabajo_id = model.idordentrabajo;
            incidencia.usuario_id =  model.usuario_id;
           // incidencia.maestro_incidencia_id = model.idtipoentrega;
            //await _seguimiento.RegisterIncidencia(incidencia);

            
            incidencia.maestro_incidencia_id = model.idmaestroetapa;
            await _seguimiento.RegisterIncidencia(incidencia);

             

            // await _repo_Incidencia.AddAsync(incidencia);
             await _repo_OrdenTransporte.SaveAll();

            // #region Cambiar de estado al manifiesto 
            // var ordenes_eval = await _repo_OrdenTransporte.GetAll(x=>x.manifiesto_id == manifiesto.id);

            // foreach (var item in ordenes_eval)
            // { 
                
            //     if(item.estado_id ==  (int) Constantes.EstadoOrdenTransporte.Finalizado
            //     || item.estado_id == (int) Constantes.EstadoOrdenTransporte.Cerrado)
            //     {
            //            manifiesto.estado_id =  (int) Constantes.EstadoManifiesto.Finalizado;
            //     }
               
            //     else {
            //             manifiesto.estado_id =  (int) Constantes.EstadoManifiesto.Registrado;
            //             break;
            //     }
            // }
            // /////////////////////////////////////
            // #endregion
           // await _repo_OrdenTransporte.SaveAll();


            string htmlString =  _seguimiento.GetBodyMail(ordentrabajo.id.ToString(), ordentrabajo.destinatario,
            ordentrabajo.fecha_carga.ToShortDateString() , ordentrabajo.direccion_entrega , ordentrabajo.provincia_entrega
            ,ordentrabajo.numero_ot, ordentrabajo.Chofer, ordentrabajo.dni, ordentrabajo.Tracto,
            model.lat.ToString(), model.lng.ToString()) ;
                  

       

            string body =  "Se ha registrado una entrega (" +  model.descripcion + " ) para la OT " + _ordentrabajo.numero_ot;
                try
                {
                     MailHelper.EnviarMail(true,SMTP_SERVER,SMTP_MAIL,SMTP_PASSWORD,CORREO_PRUEBA,
                            "",   ordentrabajo.numero_ot , htmlString,true );

                             return Ok("ordentrabajo");
                }
                catch (System.Exception ex)
                {
                    
                  return Ok(ex)  ;
                }
            
        }
        [HttpGet("getAllDocumentos")]
        public async Task<IActionResult> getAllDocumentos(int id)
        { 
            var resp  = await _seguimiento.GetAllDocuments(id);
            return Ok (resp);
        }

        [HttpGet("DownloadPlantilla")]
        public FileResult DownloadPlantilla()
        {
            string filePath =   _config.GetSection("AppSettings:UploadsDocuments").Value;
            
            
            // var documento = _repo_Archivo.Get(x=>x.idarchivo == documentoId).Result;

            IFileProvider provider = new PhysicalFileProvider(filePath );
            IFileInfo fileInfo = provider.GetFileInfo("plantilla_toscanos.xlsx");
            var readStream = fileInfo.CreateReadStream();
            //var mimeType = "application/vnd.ms-excel";
            return File(readStream,GetContentType(filePath + "//" + "plantilla_toscanos.xlsx") , "plantilla_toscanos.xlsx");
            
        }
        [HttpGet("DownloadArchivo")]
        public FileResult DownloadArchivo(long documentoId)
        {
            string filePath =   _config.GetSection("AppSettings:UploadsDocuments").Value;
            
            
             var documento = _repo_Archivo.Get(x=>x.idarchivo == documentoId).Result;

            IFileProvider provider = new PhysicalFileProvider(documento.rutaacceso );
            IFileInfo fileInfo = provider.GetFileInfo(documento.nombrearchivo);
            var readStream = fileInfo.CreateReadStream();
            //var mimeType = "application/vnd.ms-excel";
            return File(readStream,GetContentType(documento.rutaacceso + "//" + documento.nombrearchivo) , documento.nombrearchivo);
            
        }
        private string GetContentType(string path)
        {
           var provider = new FileExtensionContentTypeProvider();
           string contentType;
           if(!provider.TryGetContentType(path, out contentType))
           {
               contentType = "application/octet-stream";
           }
           return contentType;
        }
        [HttpPost("UpdateGeolocalizacion")]
        public async Task<IActionResult> UpdateGeolocalizacion(GeoEquipoTransporteForRegister geoEquipoTransporteForRegister)
        {
             var result =  await  _repo.RegisterGeoLocalizacion(geoEquipoTransporteForRegister);
             return Ok(result);
        }
        [HttpGet("GetLocalizacion")]
        public async Task<IActionResult> GetLocalizacion(int id)
        { 
            var resp  = await  _seguimiento.GetLocalizacion(id);
            return Ok (resp);
        }
        [AllowAnonymous]
        [HttpGet("GetOrden")]
        public async Task<IActionResult> GetOrden(long id)
        { 
            var resp  = await  _repo_OrdenTransporte.Get(x=>x.id == id);
            return Ok (resp);
        }
        [AllowAnonymous]
        [HttpPost("UpdateEncuesta")]
        public async Task<IActionResult> UpdateEncuesta(OrdenTransporte ordenTransporte)
        {
            var resp  = await  _repo_OrdenTransporte.Get(x=>x.id == ordenTransporte.id);
            resp.nivel_satisfaccion = ordenTransporte.nivel_satisfaccion;
            resp.observacion_satisfaccion = ordenTransporte.observacion_satisfaccion;
             
             
             
             var updatedOrden = _repo_OrdenTransporte.SaveAll();

            return Ok(resp);
        }

        [HttpPost("UpdateOrden")]
        public async Task<IActionResult> UpdateOrden(OrdenTransporte ordenTransporte)
        { 
            var resp  = await  _repo_OrdenTransporte.Get(x=>x.id == ordenTransporte.id);

            resp.cantidad = ordenTransporte.cantidad;
            resp.factura = ordenTransporte.factura;
            resp.oc = ordenTransporte.oc;
            resp.peso = ordenTransporte.peso;
            resp.volumen = ordenTransporte.volumen;
            resp.delivery = ordenTransporte.delivery;
            resp.destinatario_id = ordenTransporte.destinatario_id;
            resp.fecha_carga = ordenTransporte.fecha_carga;
            resp.fecha_entrega = ordenTransporte.fecha_entrega;
            resp.fecha_salida = ordenTransporte.fecha_salida;
            resp.destinatario = ordenTransporte.destinatario;
          

            var updatedOrden = _repo_OrdenTransporte.SaveAll();

            return Ok (resp);
        }

        [HttpPost("UpdateOrdenEliminar")]
        public async Task<IActionResult> UpdateOrdenEliminar(OrdenTransporteDto ordenTransporte)
        { 
              var resp  = await  _repo_OrdenTransporte.Get(x=>x.id == ordenTransporte.id);
              resp.activo = false;
              var updatedOrden = _repo_OrdenTransporte.SaveAll();

              return Ok (resp);
        }


        [HttpGet("GetCantidadDespacho")]
        public async Task<IActionResult> GetCantidadDespacho(int? remitente_id, string fec_ini, string fec_fin)
        {
            var result = await _reporte.GetTotalDespachos(remitente_id, fec_ini,fec_fin);
            return Ok (result);
        }
        [HttpGet("GetTotalActivity")]
        public async Task<IActionResult> GetTotalActivity()
        {
            var result = await _seguimiento.GetActivityTotal();
            return Ok (result);
        }
        [HttpGet("GetTotalActivityRecojo")]
        public async Task<IActionResult> GetTotalActivityRecojo()
        {
            var result = await _seguimiento.GetActivityTotalRecojo();
            return Ok (result);
        }
        [HttpGet("GetTotalActivityClientes")]
        public async Task<IActionResult> GetTotalActivityClientes()
        {
            var result = await _seguimiento.GetActivityTotalClientes();
            return Ok (result);
        }
         [HttpGet("GetActivityVehiculosRuta")]
        public async Task<IActionResult> GetActivityVehiculosRuta()
        {
            var result = await _seguimiento.GetActivityVehiculosRuta();
            return Ok (result);
        }
        [HttpGet("GetActivityOTTotalesYEntregadas")]
        public async Task<IActionResult> GetActivityOTTotalesYEntregadas()
        {
            var result = await _seguimiento.GetActivityOTTotalesYEntregadas();
            return Ok (result);
        }


        [HttpGet("GetReporteServicio")]
        public async Task<IActionResult> GetReporteServicio()
        {
            var result = await _seguimiento.GetReporteServicio();
            return Ok (result);
        }
        [HttpGet("GetReporteEncuesta")]
        public async Task<IActionResult> GetReporteEncuesta(int? remitente_id, int? usuario_id, string fec_ini, string fec_fin)
        {
            var result = await _reporte.GetReporteEncuesta(remitente_id, usuario_id, fec_ini,fec_fin);
            return Ok (result);
        }

        [HttpGet("GetDespachosATiempo")]
        public async Task<IActionResult> GetDespachosATiempo(int? remitente_id, string fec_ini, string fec_fin)
        {
            var result = await _reporte.GetDespachosATiempo(remitente_id, fec_ini,fec_fin);
            return Ok (result);
        }
       
        [HttpGet("GetDespachosTiempoEntrega")]
        public async Task<IActionResult> GetDespachosTiempoEntrega(int? remitente_id, string fec_ini, string fec_fin)
        {
            var result = await _reporte.GetDespachosTiempoEntrega(remitente_id, fec_ini,fec_fin);
            return Ok (result);
        }
       [HttpGet("GetDaysOfWeek")]
        public async Task<IActionResult> GetDaysOfWeek(int? remitente_id, string fec_ini, string fec_fin)
        {
            var result = await _reporte.GetDaysOfWeek(remitente_id, fec_ini,fec_fin);
            return Ok (result);
        }
        [HttpGet("GetCantidadxManifiesto")]
        public async Task<IActionResult> GetCantidadxManifiesto(int? remitente_id, string fec_ini, string fec_fin)
        {
            var result = await _reporte.GetCantidadxManifiesto(remitente_id, fec_ini,fec_fin);
            return Ok (result);
        }
        [HttpGet("GetDespachosPuntualidad")]
        public async Task<IActionResult> GetDespachosPuntualidad(int? remitente_id, string fec_ini, string fec_fin)
        {
            var result = await _reporte.GetDespachosPuntualidad(remitente_id, fec_ini,fec_fin);
            return Ok (result);
        }
        [HttpGet("GetAsignacionUnidadesVehiculo")]
        public async Task<IActionResult> GetAsignacionUnidadesVehiculo()
        {
            var result = await _reporte.GetAsignacionUnidadesVehiculo();
            return Ok (result);
        }
        [HttpGet("GetAsignacionUnidadesVehiculoTerceros")]
        public async Task<IActionResult> GetAsignacionUnidadesVehiculoTerceros()
        {
            var result = await _reporte.GetAsignacionUnidadesVehiculoTerceros();
            return Ok (result);
        }
        [HttpGet("GetVehiculoPropios")]
        public async Task<IActionResult> GetVehiculoPropios()
        {
            var result = await _reporte.GetVehiculoPropios();
            return Ok (result);
        }

        [HttpPost("ActualizarIncidencia")]
        public async Task<IActionResult> UpdateEncuesta(IncidenciaForUpdate incidencia)
        {
            var resp = await _repo.ActualizarIncidencia(incidencia);
            return Ok(resp);
        }
    }
}