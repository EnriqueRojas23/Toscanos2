import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { GeneralService } from 'src/app/_services/general.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nuevochofer',
  templateUrl: './nuevochofer.component.html',
  styleUrls: ['./nuevochofer.component.css']
})
export class NuevochoferComponent implements OnInit {
  model: any = {}  ;
  loading= false;
  constructor(private generalService: GeneralService
    , private alertify: ToastrService
    , private router : Router) { }

  ngOnInit() {
  }
  registrar(form: NgForm) {
    this.loading= true;

    if (form.invalid) {
      return; 
    }
    console.log(this.model);

    this.generalService.registrar_chofer(this.model).subscribe(resp => { 
    }, error => {
       this.alertify.error(error.error);
       this.loading= false;

    }, () => { 
      this.alertify.success("Se registró correctamente.");
      this.loading= false;
      this.router.navigate(['mantenimiento/listadoconductores']);
    });

  }
  cancel(){
    this.router.navigate(['mantenimiento/listadoconductores']);
  }
  
}
