import { Component, OnInit } from '@angular/core';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/_common/datepicker.extend';
import { ActivatedRoute, Router } from '@angular/router';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { ClienteService } from 'src/app/_services/cliente.service';
import { SelectItem, ConfirmationService } from 'primeng/api';


@Component({
  selector: 'app-editarorden',
  templateUrl: './editarorden.component.html',
  styleUrls: ['./editarorden.component.css'],
  providers: [
    {
        provide: DateAdapter, useClass: AppDateAdapter
    },
    {
        provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
    }
    ]
})
export class EditarordenComponent implements OnInit {

  id: number;
  private exportTime = { hour: '', minute: '', meriden: 'PM', format: 12 };

  clientes: SelectItem[] = [];
  model: any = {};

  constructor(  private activatedRoute: ActivatedRoute,
                private toastService: ToastrService,
                private router: Router,
                private clienteService: ClienteService,
                private alertify: AlertifyService,
                private confirmationService: ConfirmationService,
                private ordenService: OrdenService) { }



  ngOnInit() {
    this.id  = this.activatedRoute.snapshot.params.uid;

    this.clienteService.getAllClientes('', 0).subscribe(resp => {


              resp.forEach(element => {
                this.clientes.push({ label: element.razon_social.toUpperCase() , value: element.id });
              });



              this.ordenService.getOrden(this.id).subscribe(orden => {
                console.log(orden);
                this.model = orden;
              });

    });




  }

  onChangeHour(event) {
    console.log('event', event);
  }
  registrar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.ordenService.actualizarOrden(this.model).subscribe(x => {

    }, error => {
      this.toastService.error(error);
    }, () => {
      this.toastService.success('Se actualizó correctamente.');
      this.router.navigate(['/seguimiento/listaorden' ]);
    });
  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  eliminar() {
    this.confirmationService.confirm({
      message: '¿Está seguro que desea eliminar?',
      header: 'Eliminar',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.ordenService.eliminarOrden(this.model).subscribe( x => {
          this.router.navigate(['/seguimiento/listaorden']);
        });
      //   this.bajaAlturaService.eliminar_site(this.model).subscribe(x=>{
      //     this.router.navigate(['/Seguimiento/listadosites', this.id2 ]);
      //  })
      },
      reject: () => {

         }
      });
  }
}
