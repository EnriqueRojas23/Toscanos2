import { Component, OnInit } from '@angular/core';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { GeneralService } from 'src/app/_services/general.service';
import { ClienteService } from 'src/app/_services/cliente.service';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-editarcliente',
  templateUrl: './editarcliente.component.html',
  styleUrls: ['./editarcliente.component.css']
})
export class EditarclienteComponent implements OnInit {

  tipodocumento: Dropdownlist[] = [];
  model: any = {}  ;
  id: number;
  constructor(private generalService: GeneralService,
              private clienteService: ClienteService,
              private activatedRoute: ActivatedRoute,
              private toastr: ToastrService,
              private router: Router,
              private alertify: AlertifyService ) { }


  ngOnInit() {
    this.id  = this.activatedRoute.snapshot.params['uid'];
    this.clienteService.get(this.id).subscribe(resp => {
      this.model = resp;
    });

  }
  registrar(form: NgForm) {
    if (form.invalid) {
      return;
    }

    this.clienteService.actualizarCliente(this.model).subscribe(resp => {
      // this.model = resp;
    }, error => {
        this.toastr.error('Ocurrió un error');
    }, () => {
      this.toastr.success('Se actualizó correctamente.');
      this.router.navigate(['/mantenimiento/listadoclientes' ]);
    });

  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }
  cancel() {
    this.router.navigate(['mantenimiento/listadoclientes']);
  }

}
