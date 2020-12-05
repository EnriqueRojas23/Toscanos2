import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/_services/general.service';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editarproveedor',
  templateUrl: './editarproveedor.component.html',
  styleUrls: ['./editarproveedor.component.css']
})
export class EditarproveedorComponent implements OnInit {

  model: any = [];
  id:number;
  



  constructor(private generalService: GeneralService,
    private toastr: ToastrService,
    private activatedRoute: ActivatedRoute,
    private router: Router) { }

  ngOnInit() {

    this.id  = this.activatedRoute.snapshot.params["uid"];
    this.generalService.getProveedor(this.id).subscribe(resp => {
       this.model = resp;
      
    })
  }
  registrar(form: NgForm) {
    if (form.invalid) {
      return; 
    }
    
   
  
    this.generalService.editar_proveedor(this.model).subscribe(resp => { 
      this.model = resp;
    }, error => {
        this.toastr.error('Ocurrió un error');
    }, () => { 
      this.toastr.success("Se actualizó correctamente.");
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
  cancel(){
    this.router.navigate(['mantenimiento/listadoproveedores']);
  }

}
