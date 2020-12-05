import { Component, OnInit } from '@angular/core';
import { ConfirmationService } from 'primeng/components/common/confirmationservice';
import { GeneralService } from 'src/app/_services/general.service';
import { Chofer } from 'src/app/_models/chofer';
import { Router } from '@angular/router';

@Component({
  selector: 'app-listadochofer',
  templateUrl: './listadochofer.component.html',
  styleUrls: ['./listadochofer.component.css'],
  providers: [ConfirmationService]
})
export class ListadochoferComponent implements OnInit {
  
  cols: any[];
  loading : boolean = false;
  nombrechino : String = "Cesar";
  choferes : Chofer[];
  constructor(private generalService: GeneralService,
    private router: Router) { }

  ngOnInit() {
      this.loading = true;
    this.generalService.GetAllChoferes().subscribe(resp => {
      this.choferes = resp;
      this.loading = false;

      this.cols = [
        { field: 'id', header: 'ID',  width: '10%'},
        { field: 'nombreCompleto', header: 'Conductor' ,  width: '40%'},
        { field: 'dni', header: 'DNI' ,  width: '40%'},
        { field: 'brevete', header: 'DNI' ,  width: '40%'},
        { field: 'id', header: 'Acciones',  width: '20%' }
          ];
    });
  }
  editar(id){
    this.router.navigate(['mantenimiento/editarchofer', id]);
  }

}
