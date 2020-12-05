import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource, MatDialog } from '@angular/material';
import { Cliente } from 'src/app/_models/cliente';
import { Router } from '@angular/router';
import { GeneralService } from 'src/app/_services/general.service';
import { ClienteService } from 'src/app/_services/cliente.service';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';

@Component({
  selector: 'app-listadocliente',
  templateUrl: './listadocliente.component.html',
  styleUrls: ['./listadocliente.component.css'],
  providers: [ConfirmationService]
})
export class ListadoclienteComponent implements OnInit {

  cols: any[];

  listData: MatTableDataSource<Cliente>;
  public loading = false;
  clientes: Cliente[];
  model: any  = {};




  constructor(private clienteService: ClienteService
    ,         public dialog: MatDialog
    ,         private confirmationService: ConfirmationService
    ,         private router: Router, ) { }

  ngOnInit() {

    this.model.criterio = '';
    this.clienteService.getAllClientes('', 1).subscribe(resp => {
    this.clientes = resp;



    this.cols = [
        { field: 'id', header: 'ID',  width: '10%'},
        { field: 'razon_social', header: 'Razón Social' ,  width: '40%'},
        { field: 'ruc', header: 'RUC' ,  width: '40%'},
        { field: 'tipo', header: 'Acciones',  width: '20%' }
          ];
    });

  }
  load() {
    this.clienteService.getAllClientes('', 1).subscribe(resp => {
      this.clientes = resp;
    });
  }
  edit(id) {
     this.router.navigate(['mantenimiento/editarcliente', id]);
  }
  confirm(id) {

    this.confirmationService.confirm({
        message: '¿Está seguro que desea eliminar?',
        header: 'Eliminar',
        icon: 'pi pi-exclamation-triangle',
        accept: () => {
          this.clienteService.deleteCliente(id).subscribe(x => {
              this.load();
            });
        },
        reject: () => {

        }
    });
}
}
