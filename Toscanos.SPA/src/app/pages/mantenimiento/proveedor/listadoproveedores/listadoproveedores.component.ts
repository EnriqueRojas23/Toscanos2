import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { Proveedor } from 'src/app/_models/proveedor';
import { GeneralService } from 'src/app/_services/general.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'app-listadoproveedores',
  templateUrl: './listadoproveedores.component.html',
  styleUrls: ['./listadoproveedores.component.css'],
  providers: [ConfirmationService]
})
export class ListadoproveedoresComponent implements OnInit {

  public loading = false;
  provedores: Proveedor[];
  model: any  = {};
  cols: any[];
  


  constructor(private clienteService: GeneralService
    ,private router: Router,
    private generalService: GeneralService,
    private confirmationService: ConfirmationService ) { }

  ngOnInit() {
   this.load()
}
load(){
  this.model.criterio = "";
  this.clienteService.getProveedores(this.model.criterio).subscribe(resp => {
  this.provedores = resp;

  console.log(resp);
  this.cols = [
    { field: 'id', header: 'ID',  width: '10%'},
    { field: 'razonSocial', header: 'Razón Social' ,  width: '40%'},
    { field: 'ruc', header: 'RUC' ,  width: '30%'},
    { field: 'usuario', header: 'Acciones',  width: '20%' }
];


});
}
  edit(id) {
    
    this.router.navigate(['/mantenimiento/editarproveedor',id ]);

  }

  confirm(id) {
    console.log(id);
    this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar?',
        header: 'Eliminar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.generalService.delete_proveedor(id).subscribe(x=>
            {
              this.load()
            });
        },
        reject: () => {
            
        }
    });
}

}

