import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth.service';
import { Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { AlertifyService } from '../_services/alertify.service';
import { ToastrService } from 'ngx-toastr';



@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
  model: any = {};
  public loading = false;
  constructor(private authService: AuthService, private router: Router,
              private toastr: ToastrService,
              private alertify: AlertifyService) { }
  ngOnInit() {
    const rememberme =  localStorage.getItem('Name');
    this.model.recuerdame = true;
    this.model.username = rememberme;


  }
  login(form: NgForm) {

    this.loading = true;
    if (form.invalid) {
      return;
    }

    this.authService.login(this.model).subscribe(resp => {


    }, error => {
        this.loading = false;
        console.log(error);





        if ('Unauthorized' === error.statusText) {
          // tslint:disable-next-line: max-line-length
           this.toastr.error('usuario y/o contraseña incorrecta', 'T-Track', {positionClass : 'toast-top-right', disableTimeOut: true, closeButton: true }  );

          } else if ('Bloqueado' === error.statusText) {
           this.alertify.error('usuario bloqueado');
        } else if ('Eliminado' === error.statusText) {
                  this.alertify.error('usuario eliminado');
        } else {
                  this.alertify.error(error.statusText);
        }

    }, () => {

      this.router.navigate(['/dashboard']);
    });
  }



}
