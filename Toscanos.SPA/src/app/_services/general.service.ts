import { Injectable } from '@angular/core';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment';
import {  EquipoTransporteBE } from '../_models/equipotransporteBE';
import { Chofer } from '../_models/chofer';
import { Proveedor } from '../_models/proveedor';
import { Vehiculo } from '../_models/vehiculo';
import { ValorTabla } from '../_models/valortabla';
import { Cliente } from '../_models/cliente';
import { Estado } from '../_models/estado';

const httpOptions = {
    headers: new HttpHeaders({
      Authorization : 'Bearer ' + localStorage.getItem('token'),
      'Content-Type' : 'application/json'
    }),
};
@Injectable({
    providedIn: 'root'
  })
export class GeneralService {
    baseUrl = environment.baseUrl + '/api/general/';
    constructor(private http: HttpClient) { }

      getEstados(TablaId: number): Observable<Estado[]> {
        return this.http.get<Estado[]>(this.baseUrl + '?TablaId=' + TablaId, httpOptions);
      }
      getValorTabla(TablaId: number): Observable<ValorTabla[]> {
        return this.http.get<ValorTabla[]>(this.baseUrl + 'GetAllValorTabla?TablaId=' + TablaId, httpOptions);
      }


      getChoferes(criterio: string): Observable<Chofer[]> {
        return this.http.get<Chofer[]>(this.baseUrl +'GetChofer?criterio=' + criterio , httpOptions);
      }
      getChofer(id: number): Observable<Chofer[]> {
        return this.http.get<Chofer[]>(this.baseUrl +'GetChoferxId?id=' + id , httpOptions);
      }



      GetAllChoferes(): Observable<Chofer[]> {
        return this.http.get<Chofer[]>(this.baseUrl +'GetChoferes' , httpOptions);
      }

      getEquipoTransporte(placa: string): Observable<EquipoTransporteBE> {
        return this.http.get<EquipoTransporteBE>(this.baseUrl +'GetEquipoTransporte?placa=' + placa , httpOptions);
      }

      vincularEquipoTransporte(model: any) {
        return this.http.post(this.baseUrl + 'RegisterEquipoTransporte', model, httpOptions);
       }

      getProveedores(criterio: string): Observable<Proveedor[]> {
              return this.http.get<Proveedor[]>(this.baseUrl +'GetProveedores?criterio=' + criterio , httpOptions);
        }
      getProveedor(id: number) {
            return  this.http.get<Proveedor>(this.baseUrl +'GetProveedor?id=' + id , httpOptions);

        }
      registrar_proveedor(model: any) {
            return this.http.post(this.baseUrl + 'RegisterProveedor', model, httpOptions);
        }
      editar_proveedor(model: any) {
            return this.http.post(this.baseUrl + 'EditProveedor', model, httpOptions);
        }
        delete_proveedor(id: number) {
            return this.http.delete(this.baseUrl + 'DeleteProveedor?id=' + id, httpOptions  );
        }
        registrar_placa(model: any) {
            return this.http.post(this.baseUrl + 'RegisterVehiculo', model, httpOptions);
        }
        registrar_chofer(model: any) {
          return this.http.post(this.baseUrl + 'RegisterChofer', model, httpOptions);
      }

        editar_placa(model: any) {
          return this.http.post(this.baseUrl + 'UpdateVehiculo', model, httpOptions);
        }

      getVehiculos(placa: string): Observable<Vehiculo[]> {
        return this.http.get<Vehiculo[]>(this.baseUrl +'GetVehiculos?placa=' + placa , httpOptions);
      }
      getVehiculo(id: number): Observable<Vehiculo[]> {
        return this.http.get<Vehiculo[]>(this.baseUrl +'GetVehiculo?id=' + id , httpOptions);
      }
      GetAllClientes(criterio: string): Observable<Cliente[]> {
        return this.http.get<Cliente[]>(this.baseUrl +'GetAllClientes?criterio=' + criterio , httpOptions);
      }

      editar_chofer(model: any) {
        return this.http.post(this.baseUrl + 'UpdateChofer', model, httpOptions);
      }


}
