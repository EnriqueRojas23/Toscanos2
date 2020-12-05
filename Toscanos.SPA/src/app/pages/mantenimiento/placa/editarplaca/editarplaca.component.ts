import { Component, OnInit } from '@angular/core';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneralService } from 'src/app/_services/general.service';
import { ToastrService } from 'ngx-toastr';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-editarplaca',
  templateUrl: './editarplaca.component.html',
  styleUrls: ['./editarplaca.component.css']
})
export class EditarplacaComponent implements OnInit {

  model: any = {};
  transporte: any = {};
  id: any;
  ProveedorLoaded: boolean =  false;
  TipoLoaded: boolean = false;
  MarcaLoaded: boolean = false;

  tipoVehiculo: Dropdownlist[] = [
 ];
 
 marcaVehiculo: Dropdownlist[] = [
 ];
 
 modeloVehiculo: Dropdownlist[] = [
];
proveedores: Dropdownlist[] = [
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

        this.id  = this.activatedRoute.snapshot.params["uid"];

        this.generalService.getVehiculo(this.id).subscribe(resp => {
           this.model = resp;
           console.log(this.model);
          
        })
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
    
   console.log(this.model);
  
    this.generalService.editar_placa(this.model).subscribe(resp => { 
      this.model = resp;
    }, error => {
        this.toastr.error('Ocurrió un error');
    }, () => { 
      this.toastr.success("Se actualizó correctamente.");
      this.router.navigate(['/mantenimiento/listadoplacas' ]);
    });

  }

}
