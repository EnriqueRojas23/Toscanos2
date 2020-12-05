import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSort, MatPaginator, MatTableDataSource } from '@angular/material';
import { Proveedor } from 'src/app/_models/proveedor';
import { GeneralService } from 'src/app/_services/general.service';
import { Router } from '@angular/router';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { Vehiculo } from 'src/app/_models/vehiculo';

@Component({
  selector: 'app-listadoplacas',
  templateUrl: './listadoplacas.component.html',
  styleUrls: ['./listadoplacas.component.css']
})
export class ListadoplacasComponent implements OnInit {


  public loading = false;
  placas: Vehiculo[];
  cols: any[];

  constructor(private generalService: GeneralService
    ,private router: Router, ) { }

  ngOnInit() {

    // this.generalService.getValorTabla(5).subscribe(resp=> 
    //   {
    //     resp.forEach(element => {
    //       this.marcaVehiculo.push({ val: element.id , viewValue: element.valorPrincipal});
    //     });
         
    //   });



    
    this.generalService.getVehiculos("").subscribe(resp => {
    this.placas = resp;
   
    console.log(this.placas);
    this.cols = [
          { field: 'id', header: 'ID',  width: '10%'},
          { field: 'placa', header: 'Proveedor' ,  width: '40%'},
          { field: 'placa', header: 'Placa' ,  width: '40%'},
          { field: 'marca', header: 'Marca' ,  width: '30%'},
          { field: 'marca', header: 'Modelo' ,  width: '30%'},
          { field: 'marca', header: 'Tipo Vehículo' ,  width: '30%'},
          { field: 'tipo', header: 'Acciones',  width: '20%' }
    ];


    });

  }
  confirm(id) {
      
  }

  edit(id) {
    
    this.router.navigate(['/mantenimiento/editarplaca',id ]);

  }
}
