import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Chart } from 'chart.js';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/_services/general.service';
import { ClienteService } from 'src/app/_services/cliente.service';
import { SelectionModel } from '@angular/cdk/collections';
import { OrdenTransporte } from 'src/app/_models/ordenrecibo';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { SelectItem } from 'primeng/api';
declare var $: any;


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

  chart = [];
  // data: any = [];
  labels: any = [];

  selectedCliente = '';
  chart2: any = [];
  // data2: any = [];
  labels2: any = [];


  chart3: any = [];
  // data3: any = [];
  labels3: any = [];


  chart4: any = [];
  // data3: any = [];
  labels4: any = [];

  chart5: any = [];
  data5: any = [];
  data51: any = [];
  labels5: any = [];

  chart6: any = [];
  data6: any = [];
  data61: any = [];
  labels6: any = [];


  chart7: any = [];
  data7: any = [];
  data71: any = [];
  labels7: any = [];

  chart20: any = [];
  data20 = [];
  labels20 = [];

  chart21: any = [];
  data21 = [];
  labels21 = [];


  model: any = {};
  EstadoId: number;
  selection = new SelectionModel<OrdenTransporte>(true, []);
  cols: any[];
  jwtHelper = new JwtHelperService();
  decodedToken: any = {};
  // protected clientes: Dropdownlist[] = [];
  dateInicio: Date = new Date(Date.now()) ;
  dateFin: Date = new Date(Date.now()) ;

  titularAlerta = '';
  id_interval: any;
  
  clientes: SelectItem[] = [];
  estados: SelectItem[] = [];
  items: SelectItem[];

  es: any;
  intervalo: Dropdownlist[] = [
    {val: 0, viewValue: 'Desde Siempre'},
    {val: 1, viewValue: 'Hoy'},
    {val: 3, viewValue: 'Hace tres días'},
    {val: 7, viewValue: 'Hace una semana '},
    {val: 31, viewValue: 'Hace un mes '},
  ];


  constructor(private seguimiento: OrdenService,
              private router: Router,
              private ordenService: OrdenService,
              private elementRef: ElementRef,
              private generalService: GeneralService,
              private clienteService: ClienteService) { }

  ngOnInit() {

    this.es = {
      firstDayOfWeek: 1,
      dayNames: [ 'domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado' ],
      dayNamesShort: [ 'dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb' ],
      dayNamesMin: [ 'D', 'L', 'M', 'X', 'J', 'V', 'S' ],
      monthNames: [ 'enero', 'febrero', 'marzo', 'abril',
      'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre' ],
      monthNamesShort: [ 'ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic' ],
      today: 'Hoy',
      clear: 'Borrar'
  };

    this.model.remitente_id = '';
    this.model.fec_ini = '';
    this.model.fec_fin = '';



    this.dateInicio.setDate((new Date()).getDate() - 5);
    this.dateFin.setDate((new Date()).getDate() );




    const user  = localStorage.getItem('token');




    this.decodedToken = this.jwtHelper.decodeToken(user);

    this.clienteService.getAllClientes('', this.decodedToken.nameid).subscribe(list => {

          this.clientes.push({label: 'Todos los clientes', value: ''});
          list.forEach(x => {
              this.clientes.push({ label: x.razon_social , value: x.id.toString() });
           });
        });
    this.generalService.getEstados(2).subscribe(list => {
          this.estados.push({label: 'Todos los estados', value: ''});
          list.forEach(x => {
              this.estados.push({ label: x.nombreEstado , value: x.id.toString() });
           });
        });
    this.seguimiento.GetDespachosPuntualidad(this.selectedCliente,
          this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {

            // console.log(list);
             let tarde = 0 ;
             let atiempo = 0;
             list.forEach(element => {
                if (element.diferencia < 1) {
                    atiempo = atiempo + 1;


                } else {
                   tarde = tarde  + 1 ;

                }
             });


             let  porcentaje_bien = (100 * atiempo ) / list.length;
             let porcentaje_mal = 100 - porcentaje_bien;

             this.chart20 = new Chart('canvas20', {
            type: 'pie',

            data: {
              datasets: [
                {
                  data: [porcentaje_bien.toFixed(2)   , porcentaje_mal.toFixed(2)  ],
                  backgroundColor: ['#3cb393', '#ed5565'] // green,
                },
              ],
            labels: ['A Tiempo' , 'Atrasado' ]
            },

            options: {


              cutoutPercentage: 40,

              legend: {
                display: true,
                position: 'bottom'
              },
                animation: {
                  animateRotate: true,
                  animateScale: true
                }
              }

              });

        });

        


    this.seguimiento.GetReporteEncuesta(this.selectedCliente, this.decodedToken.nameid,
          this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {

             console.log(list);
             let muybueno = 0 ;
             let bueno = 0;
             let regular = 0;
             let malo = 0;
             let muymalo = 0;

             list.forEach(element => {
                if (element.nivel_satisfaccion === 1) {
                      muybueno = muybueno + 1;
                } else if  (element.nivel_satisfaccion === 2) {
                      bueno = bueno  + 1 ;
                } else if  (element.nivel_satisfaccion === 3) {
                      regular = regular  + 1 ;
                } else if  (element.nivel_satisfaccion === 4) {
                       malo = malo  + 1 ;
                 } else if  (element.nivel_satisfaccion === 5) {
                     muymalo = muymalo  + 1 ;
                    }
             });


            //  let  porcentaje_bien = (100 * atiempo ) / list.length;
            //  let porcentaje_mal = 100 - porcentaje_bien;

             this.chart21 = new Chart('canvas21', {
            type: 'pie',

            data: {
              datasets: [
                {
                  data: [muybueno  ,  bueno, regular, malo, muymalo  ],
                  backgroundColor: ['#13ba37', '#e1e85f', '#eaf5cb', '#eaf5cb', '#db0414'] // green,
                },
              ],
            labels: ['Muy bueno' , 'Bueno' , 'Regular' , 'Malo' , 'Muy Malo' ]
            },

            options: {


              cutoutPercentage: 40,

              legend: {
                display: true,
                position: 'bottom'
              },
                animation: {
                  animateRotate: true,
                  animateScale: true
                }
              }

              });

        });
    this.seguimiento.GetCantidadDespacho(this.selectedCliente,
          this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()
          ).subscribe(list => {




           this.chart2 = new Chart('canvas2', {
             type: 'horizontalBar',

             data: {
               datasets: [
                 {
                   label: 'Estados de entrega',
                   data: [list.ok    , list.entregaparcial , list.noentregado  ],
                   backgroundColor: ['#3cb393', '#3cb393', '#3cb393'] // green,
                 },
               ],
              labels: ['Entregas OK' , 'Entrega Parcial ' , 'No Entregado' ]
             },

             options: {


               cutoutPercentage: 40,

               legend: {
                 display: true,
                 position: 'bottom'
               },
                 // animation: {
                 //   animateRotate: true,
                 //   animateScale: true
                 // }
               }

               });


           this.chart3 = new Chart('canvas3', {
          type: 'pie',

          data: {
            datasets: [
              {
                data: [((list.ok * 100) / list.total).toFixed(0)   , ((list.pendientes * 100) / list.total).toFixed(0)  ],
                backgroundColor: ['#3cb393', '#ed5565'] // green,
              },
            ],
            labels: ['Entregados % ' , 'Pendientes %' ]
          },

          options: {


            cutoutPercentage: 40,

            legend: {
              display: true,
              position: 'bottom'
            },
              animation: {
                animateRotate: true,
                animateScale: true
              }
            }

            });




              });

    this.seguimiento.GetDespachosATiempo(this.selectedCliente,
      this.dateInicio.toLocaleDateString(),  this.dateFin.toLocaleDateString()).subscribe(list => {
          this.chart4 = new Chart('canvas4', {
          type: 'pie',

          data: {
            datasets: [
              {
                data: [list.atiempo   , list.notiempo  ],
                backgroundColor: ['#3cb393', '#ed5565'] // green,
              },
            ],
           labels: ['A Tiempo' , 'Atrasado' ]
          },

          options: {


            cutoutPercentage: 40,

            legend: {
              display: true,
              position: 'bottom'
            },
              animation: {
                animateRotate: true,
                animateScale: true
              }
            }

            });

       });
       /////////////////

    this.seguimiento.GetDespachosTiempoEntrega(this.selectedCliente,
        this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {


         list.forEach(element => {
            this.data5.push(element.tiempo);
            this.data51.push(element.id);
         });



         this.chart5 = new Chart('canvas5', {
          type: 'line',

          data: {
            labels: this.data51,
            datasets: [
              {
                data: this.data5    ,
                label: 'Tiempos de Entrega (min)',
                fillColor: 'rgba(220,220,220,0.2)',
                strokeColor: 'rgba(220,220,220,1)',
                pointColor: 'rgba(220,220,220,1)',
                pointStrokeColor: '#fff',
                pointHighlightFill: '#fff',
                pointHighlightStroke: 'rgba(220,220,220,1)',
              },
            ],

          },

          options: {          }

            });

       });

    this.seguimiento.GetDaysOfWeek(this.selectedCliente,
        this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {


         list.forEach(element => {
            this.data6.push(element.cantidad);
            this.data61.push(element.dayofw);
         });



         this.chart6 = new Chart('canvas6', {
          type: 'line',

          data: {
            labels: this.data61,
            datasets: [
              {
                data: this.data6    ,
                label: 'Días de la semana',
                fillColor: '#6497b1',
                strokeColor: '#6497b1',
                pointColor: '#6497b1',
                pointStrokeColor: '#6497b1',
                pointHighlightFill: '#6497b1',
                pointHighlightStroke: '#6497b1',
              },
            ],

          },

          options: {          }

            });

       });


    this.seguimiento.GetCantidadxManifiesto(this.selectedCliente,
        this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {

         // 100% de entregados quiero saber cuantas llegaron a tiempo y cuantas no
          // Entregado a tiempo y no entregado a tiempo.
         //

         // Poner el grafico de tiempos de etnrega en horas

         // Progamar a las 9 llego a la cita a las 10...
         // Leadtime, entrega versus la hora en que quedé entregarla.

         // en ordenes de trabajo por manifiesto , tener dos reportes uno por lima o otro por provinciaas.

         // Total de manifiestos.

         list.forEach(element => {
            this.data7.push(element.cantidad);
            this.data71.push(element.id);
         });



         this.chart7 = new Chart('canvas7', {
          type: 'bar',

          data: {
            labels: this.data71,
            datasets: [
              {
                data: this.data7    ,
                label: 'OTs',
                fillColor: '#6497b1',
                strokeColor: '#6497b1',
                pointColor: '#6497b1',
                pointStrokeColor: '#6497b1',
                pointHighlightFill: '#6497b1',
                pointHighlightStroke: '#6497b1',
              },
            ],

          },

          options: {          }

            });

       });

      }
      position_totaldespachos() {
          $('html,body').animate({ scrollTop: 250 }, 'slow');
      }
      position_totalincidencias() {
        $('html,body').animate({ scrollTop: 800 }, 'slow');
      }

      position_cumplimientocita() {
        $('html,body').animate({ scrollTop: 1250 }, 'slow');
      }



      position_cumplimientoentrega() {
        $('html,body').animate({ scrollTop: 1550 }, 'slow');
      }
      position_tiemposentrega() {
        $('html,body').animate({ scrollTop: 1150 }, 'slow');
      }
      position_daysofweek() {
        $('html,body').animate({ scrollTop: 1850 }, 'slow');
      }
      position_encuesta() {
        $('html,body').animate({ scrollTop: 2250 }, 'slow');
      }
      position_otsxmanifiesto() {
        $('html,body').animate({ scrollTop: 1950 }, 'slow');
      }
      position_filtros() {
        $('html,body').animate({ scrollTop: 0 }, 'slow');
      }
      buscar() {



        this.seguimiento.GetCantidadDespacho(this.selectedCliente,
          this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()
          ).subscribe(list => {
               this.chart2.data.datasets[0].data = [list.ok    , list.entregaparcial  , list.noentregado ];
               this.chart2.update();


               this.chart3.data.datasets[0].data =
                [((list.entregado * 100) / list.total).toFixed(0)   , ((list.pendientes * 100) / list.total).toFixed(0)  ];
               this.chart3.update();

         });


        this.seguimiento.GetDespachosATiempo( this.selectedCliente
          , this.dateInicio.toLocaleDateString(),  this.dateFin.toLocaleDateString() ).subscribe(list => {

          this.chart4.data.datasets[0].data = [list.atiempo.toFixed(0)   , list.notiempo.toFixed(0) ];
          this.chart4.update();

       });
       /////////////////

        this.seguimiento.GetDespachosTiempoEntrega(this.selectedCliente,
        this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {


         list.forEach(element => {
            this.data5.push(element.tiempo);
            this.data51.push(element.id);
         });

         this.chart5.data.datasets[0].data = this.data5;
         this.chart5.update();


       });

        this.seguimiento.GetDaysOfWeek(this.selectedCliente,
        this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {


         list.forEach(element => {
            this.data6.push(element.cantidad);
            this.data61.push(element.dayofw);
         });

      //    list.forEach(element => {
      //     this.data6.push(element.cantidad);
      //     this.data61.push(element.dayofw);
      //  });


         this.chart6.data.datasets[0].data = this.data6;
         this.chart6.update();


       });


        this.seguimiento.GetCantidadxManifiesto(this.selectedCliente,
        this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {


         list.forEach(element => {
            this.data7.push(element.cantidad);
            this.data71.push(element.id);
         });

         this.chart7.data.datasets[0].data = this.data71;
         this.chart7.update();

       });
////////////////////////////////////////////////////////////////////////////

        this.seguimiento.GetDespachosPuntualidad ( this.selectedCliente,
            this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {


               let tarde = 0 ;
               let atiempo = 0;
               list.forEach(element => {
                  if (element.diferencia < 1) {
                      atiempo = atiempo + 1;

                  } else {
                     tarde = tarde  + 1 ;
                  }
               });


               let  porcentaje_bien = (100 * atiempo ) / list.length;
               let porcentaje_mal = 100 - porcentaje_bien;

               this.chart20.data.datasets[0].data = [porcentaje_bien.toFixed(0)   , porcentaje_mal.toFixed(0)    ];
               this.chart20.update();

          });

        this.seguimiento.GetReporteEncuesta ( this.selectedCliente, this.decodedToken.nameid,
            this.dateInicio.toLocaleDateString(), this.dateFin.toLocaleDateString()).subscribe(list => {

               console.log(list);
               let muybueno = 0 ;
               let bueno = 0;
               let regular = 0;
               let malo = 0;
               let muymalo = 0;

               list.forEach(element => {
                  if (element.nivel_satisfaccion === 1) {
                        muybueno = muybueno + 1;
                  } else if  (element.nivel_satisfaccion === 2) {
                        bueno = bueno  + 1 ;
                  } else if  (element.nivel_satisfaccion === 3) {
                        regular = regular  + 1 ;
                  } else if  (element.nivel_satisfaccion === 4) {
                         malo = malo  + 1 ;
                   } else if  (element.nivel_satisfaccion === 5) {
                       muymalo = muymalo  + 1 ;
                      }
               });




               this.chart21.data.datasets[0].data = [ muybueno, bueno, regular, malo, muymalo  ];
               this.chart21.update();

          });

      }
}
