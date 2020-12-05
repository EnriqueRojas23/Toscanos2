import { Component, OnInit } from '@angular/core';
import { GeneralService } from 'src/app/_services/general.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editarchofer',
  templateUrl: './editarchofer.component.html',
  styleUrls: ['./editarchofer.component.css']
})
export class EditarchoferComponent implements OnInit {
  model: any = [];
  id: number;
  loading = false;
  constructor(private generalService: GeneralService
    , private activatedRoute: ActivatedRoute
    , private router: Router
    , private alertify : ToastrService) { }

  ngOnInit() {
    this.id  = this.activatedRoute.snapshot.params["uid"];
    this.model.id = this.id;
    this.generalService.getChofer(this.id).subscribe(resp => 
      {
         this.model = resp;
      })
  }
  registrar(form: NgForm) {
    this.loading= true;

    if (form.invalid) {
      return; 
    }
    console.log(this.model);

    this.generalService.editar_chofer(this.model).subscribe(resp => { 
    }, error => {
       this.alertify.error(error.error);
       this.loading= false;

    }, () => { 
      this.alertify.success("Se actualizó correctamente.");
      this.loading= false;
      this.router.navigate(['mantenimiento/listadoconductores']);
    });

  }
  cancel(){
    this.router.navigate(['mantenimiento/listadoconductores']);
  }
  //editar_chofer
}
