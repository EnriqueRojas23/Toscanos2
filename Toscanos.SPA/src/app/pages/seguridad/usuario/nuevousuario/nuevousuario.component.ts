import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { User } from 'src/app/_models/user';
import { MatFormField, MatSelect } from '@angular/material';
import { AuthService } from 'src/app/_services/auth.service';
import { Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { UserService } from 'src/app/_services/user.service';
import { GeneralService } from 'src/app/_services/general.service';
import { SelectItem } from 'primeng/components/common/selectitem';
import { ClienteService } from 'src/app/_services/cliente.service';
import { ToastrService } from 'ngx-toastr';
import { JwtHelperService } from '@auth0/angular-jwt';
declare var $: any;




@Component({
  selector: 'app-nuevousuario',
  templateUrl: './nuevousuario.component.html',
  styleUrls: ['./nuevousuario.component.css']
})
export class NuevousuarioComponent implements OnInit {
  model: any = {}  ;
  clientes: SelectItem[] = [];
  jwtHelper = new JwtHelperService();
  decodedToken: any = {};
  selectedCars1: string[] = [];
  constructor(private userService: UserService,
              private clienteService: ClienteService,
              private authService: AuthService, private router: Router, private alertify: ToastrService ) {  }

  registrar(form: NgForm) {
    if (form.invalid) {
      return;
    }


    this.userService.registrar(this.model).subscribe(resp => {



    }, error => {

       this.alertify.error(error.error);
    }, () => {
      this.alertify.success('Se registró correctamente.');
      this.router.navigate(['/seguridad/listausuarios']);
    });
  }
  ngOnInit() {
    $('html,body').animate({ scrollTop: 0 }, 'slow');
    let user  = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(user);

    console.log(this.decodedToken);

    this.clienteService.getAllClientes('', this.decodedToken.nameid).subscribe(list => {
        list.forEach(element => {
            this.clientes.push({value : element.id.toString() , label : element.razon_social});
        });
      });
  }
  cancel() {
    this.router.navigate(['/seguridad/listausuarios']);
  }

}
