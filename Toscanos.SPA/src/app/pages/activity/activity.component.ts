import { Component, OnInit } from '@angular/core';
declare var jQuery: any;
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';
import { DatePipe } from '@angular/common';
declare var App: any;
import * as moment from 'moment';
import { ActivityPropios, ActivityTotal } from 'src/app/_models/ordenrecibo';

@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit {
model: any = [];
data: any = [];
data2: any = [];

data3: any = [];
data4: any = [];
propios: ActivityPropios[] = [];
terceros: ActivityPropios[] = [];

provincias: ActivityTotal[] = [];
ultimamilla: ActivityTotal[] = [];
local: ActivityTotal[] = [];


data_final = '0' ;


  constructor(public ordenServicio: OrdenService) { }

  ngOnInit() {
    // this.model.fecha = this.datePipe.transform(Date.now(), 'yyyy-MM-dd');
    // this.model.fecha = Date.now();
  //  this.model.fecha =  moment().add(-6, 'days').format('DD/MM/YYYY') + ' - ' +  moment().format('DD/MM/YYYY');
    this.model.fecha =    moment().format('DD/MM/YYYY');


    this.ordenServicio.GetActivityVehiculosRuta().subscribe(resp => {
      this.model.vehiculosenruta = resp.length;

    });
    this.ordenServicio.GetActivityOTTotalesYEntregadas().subscribe(resp => {
      this.model.total_ots = resp[0].enTransito;
      this.model.entregadas_ot = resp[1].enTransito;
      this.model.porcentaje =  ((this.model.entregadas_ot / this.model.total_ots) * 100).toFixed(2);

    });


    this.ordenServicio.GetActivityTotal().subscribe(resp => {
      this.model.ultimamilla = resp[0].total;
      this.model.provincias = resp[1].total;
      this.model.locales = resp[2].total;
    });

    this.ordenServicio.GetActivityTotalRecojo().subscribe(resp => {
      this.model.ultimamilla_recojo = resp[0].total;
      this.model.provincias_recojo = resp[1].total;
      this.model.locales_recojo = resp[2].total;

    });
    this.ordenServicio.GetActivityTotalCliente().subscribe(resp => {

       resp.forEach(x => {
         if (x.tipo === 'ultimamilla') {
            this.ultimamilla.push(x);
         }

       });
       resp.forEach(x => {
        if (x.tipo === 'provincia') {
           this.provincias.push(x);
        }

      });
       resp.forEach(x => {
        if (x.tipo === 'local') {
           this.local.push(x);
        }

      });

    });

    this.ordenServicio.GetAsignacionUnidadesVehiculo().subscribe(list => {



     this.data = [];
     this.data2 = [];


     list.forEach(element => {

        this.data.push(element.cantidad);
        this.data2.push(element.disponibilidad);
        this.data_final = this.data_final + ',' + String(element.cantidad);

      });
     this.model.acumulado_disponible  = this.data_final;


     this.model.disponibilidad_vehiculo =  list[5].disponibilidad;
     this.model.asignacion_vehiculo =  list[5].cantidad;



     jQuery('#spark1').sparkline(this.data2, {
          type: 'line',
          width: '85',
          height: '35',
          lineColor: 'blue',
          fillColor: false,
          spotColor: false,
          minSpotColor: false,
          maxSpotColor: false,
          lineWidth: 1.15
      });

     jQuery('#spark2').sparkline(this.data, {
          type: 'line',
          width: '85',
          height: '35',
          lineColor: 'blue',

          fillColor: false,
          spotColor: false,
          minSpotColor: false,
          maxSpotColor: false,
          lineWidth: 1.15});

      // jQuery("#sparkline").sparkline([5,6,7,9,9,5,3,2,2,4,6,7], {
      //   type: 'line'});


    });

    this.ordenServicio.GetAsignacionUnidadesVehiculoTerceros().subscribe(list => {
      this.data3 = [];
      this.data4 = [];

      list.forEach(element => {

        this.data3.push(element.cantidad);
        this.data4.push(element.disponibilidad);
        this.data_final = this.data_final + ',' + String(element.cantidad);

      });
      this.model.acumulado_disponible  = this.data_final;


      this.model.disponibilidad_vehiculo_terceros =  list[5].disponibilidad;
      this.model.asignacion_vehiculo_terceros =  list[5].cantidad;


      jQuery('#spark3').sparkline(this.data3, {
          type: 'line',
          width: '85',
          height: '35',
          lineColor: 'blue',
          fillColor: false,
          spotColor: false,
          minSpotColor: false,
          maxSpotColor: false,
           lineWidth: 1.15});

      jQuery('#spark4').sparkline(this.data4, {
          type: 'line',
          width: '85',
          height: '35',
          lineColor: 'blue',

          fillColor: false,
          spotColor: false,
          minSpotColor: false,
          maxSpotColor: false,
          lineWidth: 1.15});

      // jQuery("#sparkline").sparkline([5,6,7,9,9,5,3,2,2,4,6,7], {
      //   type: 'line'});


    });

    this.ordenServicio.GetVehiculoPropios().subscribe(list => {
      this.propios = list.filter(x => x.proveedor_id === 1);
      this.terceros = list.filter(x => x.proveedor_id !== 1);
    });

  }

}
