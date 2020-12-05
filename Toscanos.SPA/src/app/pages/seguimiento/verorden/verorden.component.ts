import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';
import { Router, ActivatedRoute } from '@angular/router';
import { Incidencia } from 'src/app/_models/incidencia';
import * as moment from 'moment';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Documento } from 'src/app/_models/documentos';
import { ToastrService } from 'ngx-toastr';
import { ConfirmationService } from 'primeng/api';

import { DialogService, LazyLoadEvent } from 'primeng/api';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DynamicDialogRef } from 'primeng/components/dynamicdialog/dynamicdialog-ref';
import { EditIncidenciaModalComponet } from './modaleditincidencia';
import { AuthService } from 'src/app/_services/auth.service';
import { SeguridadService } from 'src/app/_services/seguridad.service';

@Component({
  selector: 'app-verorden',
  templateUrl: './verorden.component.html',
  styleUrls: ['./verorden.component.css'],
  providers: [ DialogService ]
})
export class VerordenComponent implements OnInit, OnDestroy {

  ref: DynamicDialogRef;

  constructor( private router: Router,
               private activatedRoute: ActivatedRoute,
               private toastr: ToastrService,
               private authService: AuthService,
               private matDialog: MatDialog,
               public dialogService: DialogService,
               public seguridadService: SeguridadService,
               private confirmationService: ConfirmationService,
               private ordenService: OrdenService) { }
    id_interval: any;
    incidencias: Incidencia[] = [];
    id: any;
    lat = -12.0608335;
    lng = -76.9347693 ;
    zoom = 16;
    @ViewChild(MatSort, {static: false}) sort: MatSort;
    @ViewChild(MatPaginator , {static: false}) paginator: MatPaginator;
    pageSizeOptions: number[] = [5, 10, 25, 50, 100];
    displayedColumns: string[] = [ 'Nombre', 'actionsColumn' ];
    documentos: Documento[];
    intervalId: number;
    text = 'Your Text Here';
    listData: MatTableDataSource<Documento>;
    target; options;
    cols: any[];
    cols2: any[];
    imageToShow: any;
    escliente: any;
    UserId: number;

  ngOnDestroy(): void {
    if (this.id_interval) {
      clearInterval(this.id_interval);
    }
  }

   reload_location(lng, lat) {
    navigator.geolocation.watchPosition( pos => {
      this.lng =  +lng;
      this.lat = +lat;
    });

   }



  ngOnInit() {
    const token = this.authService.jwtHelper.decodeToken(localStorage.getItem('token'));
    this.UserId = token.nameid;




    this.cols = [
        { field: 'fecha_incidencia', header: 'Fecha Incidencia',  width: '20%'},
        { field: 'incidencia', header: 'Incidencia' ,  width: '20%'},
        { field: 'observacion', header: 'Observación' ,  width: '30%'},
        { field: 'usuario', header: 'Usuario',  width: '20%' },
        { field: 'id',     header: 'Acc'  , width: '5%' }];

    this.cols2 = [
      { field: 'nombre', header: 'Nombre',  width: '20%'},
      { field: 'usuario', header: 'Acciones',  width: '20%' }
    ];

    this.target = {
      latitude : 0,
      longitude: 0
    };
    this.escliente = localStorage.getItem('escliente');



    this.options = {
      enableHighAccuracy: false,
      timeout: 1000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition( pos => {
      this.lng =  +this.lng;
      this.lat = +this.lat;
    });
    this.id  = this.activatedRoute.snapshot.params.uid;

    this.ordenService.getOrden(this.id).subscribe(orden => {

      if (orden.estado_id === 12 || orden.estado_id === 13) {
          this.ordenService.getGeoLocalizacion(this.id).subscribe(list => {
          console.log('no es necesario solicitar');
          this.lat  =  orden.lat_entrega ;
          this.lng = orden.lng_entrega ;

          this.reload_location(this.lng, this.lat );
          });
      } else {

     this.id_interval =  setInterval(() => {
        this.ordenService.getAllIncidencias(this.id).subscribe(list => {
         this.incidencias = list;
         this.ordenService.getGeoLocalizacion(this.id).subscribe(listz => {

              this.lat  =  listz.lat ;
              this.lng = listz.lng ;

              this.reload_location(this.lng, this.lat );
              console.log('solicité localizacion');
              });


             });


          }, 9000);

      }

    });



    this.ordenService.getAllDocumentos( this.id ).subscribe(list => {

        this.documentos = list;

        });
    this.ordenService.getAllIncidencias(this.id).subscribe(list => {
            console.log(list);
            this.incidencias = list; });

  }
  buscar() {


  }

  editIncidencia(id) {

    

    this.ordenService.getDatosIncidencia(id).subscribe(x => {
      this.ref = this.dialogService.open(EditIncidenciaModalComponet, {
        header: 'Editar Incidencia',
        width: '20%',
        contentStyle: {'max-height': '400px', overflow: 'auto'},
        baseZIndex: 100,
        data : {id, x}
      });

      this.ref.onClose.subscribe(x => {
          this.ordenService.getAllIncidencias(this.id).subscribe(list => {
          this.incidencias = list; });
      });
    });

  }

createImageFromBlob(image: Blob) {
   const reader = new FileReader();
   reader.addEventListener('load', () => {
      this.imageToShow = reader.result;
      console.log(reader.result);

   }, false);

   if (image) {
      reader.readAsDataURL(image);
   }
}
  downloadFile(documentoId: number) {
    this.ordenService.downloadDocumento(documentoId).subscribe(
      (response: any) => {
          const dataType = response.type;
          const binaryData = [];
          binaryData.push(response);
          const downloadLink = document.createElement('a');
          downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
         // document.body.appendChild(downloadLink);
          // downloadLink.click();
         // this.createImageFromBlob(new Blob(binaryData, {type: dataType}));

          window.open(downloadLink.href);
      }
    );
  }

  deleteVendorRecord(nose: any) {
    alert(nose);

  }
  volver() {
    this.router.navigate(['/seguimiento/listaorden']);
  }
  deleteFile(id) {

    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {

            this.ordenService.deleteFile(id).subscribe(x => {
              this.toastr.success('Se eliminó el archivo'
              , 'Eliminar File', {
                closeButton: true
              });
              this.ordenService.getAllDocumentos( this.id ).subscribe(list => {

                this.documentos = list;

                });


              });
      },
      reject: () => {

      }
  });



  }

  public uploadFile  = (files) => {

    if (files.length === 0) {

      this.toastr.warning('Debe seleccionar un archivo'
      , 'Subir File', {
        closeButton: true
      });

      return ;
    }

    const fileToUpload =  files[0] as File;
    const formData = new FormData();
    formData.append('file', fileToUpload, fileToUpload.name);



    let usuario_id = 1;


    this.ordenService.uploadFileSite (formData, this.id ).subscribe(event => {
           this.toastr.success('Se ha cargado exitosamente.', 'Subir Fotos');

           this.ordenService.getAllDocumentos( this.id ).subscribe(list => {

              this.documentos = list;

          });
      }, error => {
      // console.log(error.error.text);
      this.toastr.error(
        error.error.text, 'Carga Masiva');
     });
  }

}
