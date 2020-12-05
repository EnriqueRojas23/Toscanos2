import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Documento } from 'src/app/_models/documentos';
import { Incidencia } from 'src/app/_models/incidencia';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';

@Component({
  selector: 'app-encuestasatisfaccion',
  templateUrl: './encuestasatisfaccion.component.html',
  styleUrls: ['./encuestasatisfaccion.component.css']
})
export class EncuestasatisfaccionComponent implements OnInit {




  constructor( private router: Router,
               private activatedRoute: ActivatedRoute,
               private toastr: ToastrService,
               private ordenService: OrdenService) { }
  id_interval: any;
  incidencias: Incidencia[] = [];
  id: any;
  id2: any;
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
  model: any = {};
  terminada: any = 0;





ngOnInit() {



this.id  = this.activatedRoute.snapshot.params.uid;
this.id2  = this.activatedRoute.snapshot.params.uid2;

this.model.id = this.id;
this.model.nivel_satisfaccion = this.id2 ;

this.ordenService.getOrden(this.id).subscribe(orden => {

  if ( orden.nivel_satisfaccion != null) {
     this.terminada = 1;
  } else {

  this.ordenService.updateEncuesta(this.model).subscribe(x => {




  });
}


});








}





guardar() {
  this.model.id = this.id;
  this.model.nivel_satisfaccion = this.id2 ;


  this.ordenService.updateEncuesta(this.model).subscribe(x => {

    this.toastr.success('Su observación ha sido registrada con éxito.'
    , 'Encuesta T-Track', {
    closeButton: true
    });
    this.terminada = 1;


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
// console.log(list);

this.cols2 = [
 { field: 'nombre', header: 'Nombre',  width: '20%'},
 { field: 'usuario', header: 'Acciones',  width: '20%' }
];


});
}, error => {
// console.log(error.error.text);
this.toastr.error(
error.error.text, 'Carga Masiva');
});
}

}
