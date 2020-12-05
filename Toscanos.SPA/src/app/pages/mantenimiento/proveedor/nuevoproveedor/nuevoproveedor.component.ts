import { Component, OnInit } from '@angular/core';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { NgForm } from '@angular/forms';
import { GeneralService } from 'src/app/_services/general.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevoproveedor',
  templateUrl: './nuevoproveedor.component.html',
  styleUrls: ['./nuevoproveedor.component.css']
})
export class NuevoproveedorComponent implements OnInit {
  model: any = {};
  clientes: Dropdownlist[] = [];
  



  constructor(private generalService: GeneralService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit() {
  }
  registrar(form: NgForm) {
    if (form.invalid) {
      return; 
    }
    
   console.log(this.model);
  
    this.generalService.registrar_proveedor(this.model).subscribe(resp => { 
      this.model = resp;
    }, error => {
        this.toastr.error('usuario y/o contraseña incorrecta');
    }, () => { 
      this.toastr.success("Se registró correctamente.");
      this.router.navigate(['/mantenimiento/listadoproveedores' ]);
    });

  }
  numberOnly(event): boolean {
    const charCode = (event.which) ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      return false;
    }
    return true;

  }

}
