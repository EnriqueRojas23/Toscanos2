import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient, HttpEventType } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { OrdenTransporte, CantidadDespacho, DespachosATiempo
  , TiempoEntrega, DaysOfWeek, CantidadxManifiesto, DespachosPuntualidad
  , AsignacionUnidadesVehiculo, ActivityPropios
  , ActivityTotal, ActivityVehiculosRuta, ActivityTotalPendientes
  , ReporteServicio, ReporteEncuesta } from 'src/app/_models/ordenrecibo';
import { Incidencia } from 'src/app/_models/incidencia';
import { MaestroIncidencia } from 'src/app/_models/maestroincidencia';
import { DatosIncidencia } from 'src/app/_models/datosincidencia';
import { Observable } from 'rxjs';
import { Documento } from 'src/app/_models/documentos';
import { Geo } from 'src/app/_models/geo';
import { map } from 'rxjs/operators';

const httpOptions = {
  headers: new HttpHeaders({
    Authorization : 'Bearer ' + localStorage.getItem('token'),
    'Content-Type' : 'application/json'
  })
  // , observe: 'body', reportProgress: true };
};


const httpOptionsUpload = {
  headers: new HttpHeaders({
    Authorization : 'Bearer ' + localStorage.getItem('token'),
  })
  // , observe: 'body', reportProgress: true };
};
const headers = new HttpHeaders().set('authorization', 'Bearer ' + localStorage.getItem('token'));

@Injectable({
  providedIn: 'root'
})
export class OrdenService {

  baseUrl = environment.baseUrl + '/api/Orden/';
  public progress: number;

constructor(private http: HttpClient) { }

uploadFile(formData: FormData, UserId: number) {
     return this.http.post(this.baseUrl + 'UploadFile?usrid=' + UserId.toString()
    , formData
    , httpOptionsUpload
  );
 }


 getAllOrderTransport(selectedCliente: string, selectedEstado: string, usuario_id: number, fec_ini: Date, fec_fin: Date) {
   let param = '?remitente_id=' + selectedCliente + '&estado_id=' + selectedEstado
   + '&usuario_id=' + usuario_id
   + '&fec_ini=' + fec_ini.toLocaleDateString()
   + '&fec_fin=' + fec_fin.toLocaleDateString();

   return this.http.get<OrdenTransporte[]>(this.baseUrl + 'GetAllOrder' + param  , httpOptions);
  }

  getGeoLocalizacion(id: number) {
    return this.http.get<Geo>(this.baseUrl + 'GetLocalizacion?id=' + id , httpOptions);
  }

 getAllIncidencias(id: number) {
  return this.http.get<Incidencia[]>(this.baseUrl + 'GetAllIncidencias?OrdenTransporteId=' + id , httpOptions);
  }

 getMaestroIncidencias() {
  return this.http.get<MaestroIncidencia[]>(this.baseUrl + 'GetMaestroIncidencias', httpOptions);
  }

 getDatosIncidencia(id: number) {
  return this.http.get<DatosIncidencia>(this.baseUrl + 'GetDatosIncidencia?incidencia=' + id , httpOptions);
  }

getAllDocumentos(id: number): Observable<Documento[]> {
  const params = '?Id=' + id ;
  return this.http.get<Documento[]>(this.baseUrl + 'GetAllDocumentos' + params, httpOptions);
}
deleteFile(id: number) {
  const params = '?documentoId=' + id ;
  return this.http.delete<Documento[]>(this.baseUrl + 'deleteFile' + params, httpOptions);
}
downloadDocumento(id: number): any {

  return this.http.get(this.baseUrl + 'DownloadArchivo?documentoId=' + id, {headers, responseType: 'blob' as 'json'});
  }
  downloadPlantilla(): any {

 this.http.get(this.baseUrl + 'DownloadPlantilla', {headers, responseType: 'blob' as 'json'}).subscribe(
      (response: any) => {
          const dataType = response.type;
          const binaryData = [];
          binaryData.push(response);
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
          // document.body.appendChild(downloadLink);
          // downloadLink.click();
          window.open(downloadLink.href);
      }
    );
    }

  getOrden(id: number) {
  return this.http.get<OrdenTransporte>(this.baseUrl + 'GetOrden?id=' + id , httpOptions);
  }
  actualizarOrden(model: any) {
    return this.http.post(this.baseUrl + 'UpdateOrden', model, httpOptions)
    .pipe(map((response: any) => {

    }))
  }


  eliminarOrden(model: any) {
    return this.http.post(this.baseUrl + 'UpdateOrdenEliminar', model, httpOptions)
    .pipe(map((response: any) => {

      })
    );
  }



  uploadFileSite(formData: FormData, orden_id: number) {

    return this.http.post(this.baseUrl + 'UploadFileConfirm2?id=' + orden_id
    , formData
    , httpOptionsUpload
     );
   }



   updateEncuesta(model: any) {
    return this.http.post(this.baseUrl + 'UpdateEncuesta', model, httpOptions)
    .pipe(map((response: any) => {

    }));
  }




   GetCantidadDespacho(id: string, fec_ini: string, fec_fin: string) {
    return this.http.get<CantidadDespacho>(this.baseUrl + 'GetCantidadDespacho?remitente_id=' + id
     + '&fec_ini=' + fec_ini + '&fec_fin=' + fec_fin, httpOptionsUpload );
   }
   GetDespachosATiempo(id: string, fec_ini: string, fec_fin: string) {
    return this.http.get<DespachosATiempo>(this.baseUrl + 'GetDespachosATiempo?remitente_id=' + id
     + '&fec_ini=' + fec_ini + '&fec_fin=' + fec_fin, httpOptionsUpload );
   }
   GetDespachosTiempoEntrega(id: string, fec_ini: string, fec_fin: string) {
    return this.http.get<TiempoEntrega[]>(this.baseUrl + 'GetDespachosTiempoEntrega?remitente_id=' + id
     + '&fec_ini=' + fec_ini + '&fec_fin=' + fec_fin, httpOptionsUpload );
   }
   GetDaysOfWeek(id: string, fec_ini: string, fec_fin: string) {
    return this.http.get<DaysOfWeek[]>(this.baseUrl + 'GetDaysOfWeek?remitente_id=' + id
     + '&fec_ini=' + fec_ini + '&fec_fin=' + fec_fin, httpOptionsUpload );
   }
   GetCantidadxManifiesto(id: string, fec_ini: string, fec_fin: string) {
    return this.http.get<CantidadxManifiesto[]>(this.baseUrl + 'GetCantidadxManifiesto?remitente_id=' + id
     + '&fec_ini=' + fec_ini + '&fec_fin=' + fec_fin, httpOptionsUpload );
   }
   GetDespachosPuntualidad(id: string, fec_ini: string, fec_fin: string) {
    return this.http.get<DespachosPuntualidad[]>(this.baseUrl + 'GetDespachosPuntualidad?remitente_id=' + id
     + '&fec_ini=' + fec_ini + '&fec_fin=' + fec_fin, httpOptionsUpload );
   }

   GetReporteEncuesta(id: string, userid: string ,fecini: string, fecfin: string) {
    return this.http.get<ReporteEncuesta[]>(this.baseUrl + 'GetReporteEncuesta?remitente_id=' + id
     + '&usuario_id='  + userid + '&fec_ini=' + fecini + '&fec_fin=' + fecfin, httpOptionsUpload );
   }


   GetAsignacionUnidadesVehiculo() {
    return this.http.get<AsignacionUnidadesVehiculo[]>(this.baseUrl + 'GetAsignacionUnidadesVehiculo', httpOptionsUpload );
   }
   GetAsignacionUnidadesVehiculoTerceros() {
    return this.http.get<AsignacionUnidadesVehiculo[]>(this.baseUrl + 'GetAsignacionUnidadesVehiculoTerceros', httpOptionsUpload );
   }

   GetVehiculoPropios() {
    return this.http.get<ActivityPropios[]>(this.baseUrl + 'GetVehiculoPropios', httpOptionsUpload );
   }

   GetActivityTotal() {
    return this.http.get<ActivityTotal[]>(this.baseUrl + 'GetTotalActivity', httpOptionsUpload );
   }
   GetReporteServicio() {
    return this.http.get<ReporteServicio[]>(this.baseUrl + 'GetReporteServicio', httpOptionsUpload );
   }

   GetActivityTotalRecojo() {
    return this.http.get<ActivityTotal[]>(this.baseUrl + 'GetTotalActivityRecojo', httpOptionsUpload );
   }
   GetActivityTotalCliente() {
    return this.http.get<ActivityTotal[]>(this.baseUrl + 'GetTotalActivityClientes', httpOptionsUpload );
   }
   GetActivityVehiculosRuta() {
    return this.http.get<ActivityVehiculosRuta[]>(this.baseUrl + 'GetActivityVehiculosRuta', httpOptionsUpload );
   }
   GetActivityOTTotalesYEntregadas() {
    return this.http.get<ActivityTotalPendientes[]>(this.baseUrl + 'GetActivityOTTotalesYEntregadas', httpOptionsUpload );
   }

   actualizarIncidencia(model: any) {
    return this.http.post(this.baseUrl + 'ActualizarIncidencia', model, httpOptions)
    .pipe(map((response: any) => {
      const prueba = response;
    }));
  }


}
