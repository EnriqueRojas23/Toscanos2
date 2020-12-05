import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { GeneralService } from 'src/app/_services/general.service';
import { NgForm } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-nuevaplaca',
  templateUrl: './nuevaplaca.component.html',
  styleUrls: ['./nuevaplaca.component.css']
})
export class NuevaplacaComponent implements OnInit {
  model: any = {};
  transporte: any = {};
  id: any;
  ProveedorLoaded: boolean =  false;
  TipoLoaded: boolean = false;
  MarcaLoaded: boolean = false;
 
  tipoVehiculo: Dropdownlist[] = [
 ];
 proveedores: Dropdownlist[] = [
];
 marcaVehiculo: Dropdownlist[] = [
 ];
 
 modeloVehiculo: Dropdownlist[] = [
];
  constructor(public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private generalService: GeneralService,
    private router: Router,
    private toastr: ToastrService,
    private alertify: AlertifyService) { }

  ngOnInit() {

    
    this.generalService.getValorTabla(4).subscribe(resp=> 
      {
        resp.forEach(element => {
          this.tipoVehiculo.push({ val: element.id , viewValue: element.valorPrincipal});
        });
        this.TipoLoaded = true;
      });

      this.generalService.getValorTabla(5).subscribe(resp=> 
        {
          resp.forEach(element => {
            this.marcaVehiculo.push({ val: element.id , viewValue: element.valorPrincipal});
          });
          this.MarcaLoaded = true;
           
        });

        // this.generalService.getValorTabla(7).subscribe(resp=> 
        //   {
        //     resp.forEach(element => {
        //       this.modeloVehiculo.push({ val: element.id , viewValue: element.valorPrincipal});
        //     });
             
        //   });
          this.generalService.getProveedores("").subscribe(resp=> 
            {
              

              resp.forEach(element => {
                this.proveedores.push({ val: element.id , viewValue: element.razonSocial});
              });

              this.ProveedorLoaded = true;
               
            });
  }
  registrar(form: NgForm) {
    if (form.invalid) {
      return; 
    }
    
   
  
    this.generalService.registrar_placa(this.model).subscribe(resp => { 
      this.model = resp;
    }, error => {
        this.toastr.error(error.error);
    }, () => { 
      this.toastr.success("Se registró correctamente.");
      this.router.navigate(['/mantenimiento/listadoproveedores' ]);
    });

  }
}
