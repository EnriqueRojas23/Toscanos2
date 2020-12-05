import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { MatDialog, MatTableDataSource, MatSort, MatPaginator, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertifyService } from 'src/app/_services/alertify.service';
import { NgForm } from '@angular/forms';
import { GeneralService } from 'src/app/_services/general.service';
import { Vehiculo } from 'src/app/_models/vehiculo';
import { Proveedor } from 'src/app/_models/proveedor';
import { Chofer } from 'src/app/_models/chofer';
import { ToastrService } from 'ngx-toastr';



//Buscar Vehiculo Modal 
/////////////

export interface DialogData {
  codigo: any;
  descripcion: string;
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: 'modal.buscarplaca.html'
})

export class DialogBuscarPlaca {

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  pageSizeOptions:number[] = [5, 10, 25, 50, 100];
  displayedColumns: string[] = [ 'Placa', 'TipoVehiculo','Modelo', 'Marca', 'actionsColumn' ];

  vehiculos: Vehiculo[];

  listData: MatTableDataSource<Vehiculo>;
  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<DialogBuscarPlaca>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private equipotransporteService: GeneralService) {
      this.model.codigo = data.codigo;
      this.buscar();

    }
    onNoClick(): void {
    this.dialogRef.close();
    
  }
  seleccionarPlaca(row: any){
     this.dialogRef.close( this.model.placa = this.vehiculos.filter(x => x.id == row)[0]);
  }

  buscar(){
    this.equipotransporteService.getVehiculos(this.model.codigo).subscribe(x=> {
        this.vehiculos = x;
        this.listData = new MatTableDataSource(this.vehiculos);
        this.listData.paginator = this.paginator;
        this.listData.sort = this.sort;

        this.listData.filterPredicate = (data,filter) => {
          return this.displayedColumns.some(ele => {
            
            if(ele !='Id' && ele != 'enLinea' && ele != 'Dni')
              {
                  return ele != 'actionsColumn' && data[ele].toLowerCase().indexOf(filter) != -1;
            
              }
            })
          }
        });
  }
}
///////Busqueda empresa de transporte modal 

@Component({
  selector: 'dialog-emptransporte',
  templateUrl: 'modal.buscaremptransporte.html'
})

export class DialogBuscarEmpTransporte {

  @ViewChild(MatSort, {static:false}) sort: MatSort;
  @ViewChild(MatPaginator, {static:false}) paginator: MatPaginator;
  pageSizeOptions:number[] = [5, 10, 25, 50, 100];
  displayedColumns: string[] = [ 'ruc', 'razonSocial', 'actionsColumn' ];
  
  proveedores: Proveedor[];

  listData: MatTableDataSource<Proveedor>;
  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<DialogBuscarEmpTransporte>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,
    private equipotransporteService: GeneralService) {
      

    }
    onNoClick(): void {
    this.dialogRef.close();
    
  }
  seleccionarEmpTransporte(row: any){
     this.dialogRef.close( this.model.ruc = this.proveedores.filter(x => x.id == row)[0]);
  }

  buscar(){
    
    this.equipotransporteService.getProveedores(this.model.codigo).subscribe(x=> {
      
     
        this.proveedores = x;
        
        this.listData = new MatTableDataSource(this.proveedores);
        this.listData.paginator = this.paginator;
        this.listData.sort = this.sort;
        
        

        this.listData.filterPredicate = (data,filter) => {
          return this.displayedColumns.some(ele => {
            
            if(ele !='Id' && ele != 'enLinea' && ele != 'Dni')
              {
                  return ele != 'actionsColumn' && data[ele].toLowerCase().indexOf(filter) != -1;
            
              }
            })
          }
        });
  }
}


///////Busqueda chofer modal 

@Component({ 
  selector: 'dialog-buscachofer',
  templateUrl: 'modal.buscarchofer.html'
})

export class DialogBuscarChofer {

  @ViewChild(MatSort, {static: false}) sort: MatSort;
  @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
  pageSizeOptions:number[] = [5, 10, 25, 50, 100];
  displayedColumns: string[] = [ 'nombreCompleto', 'dni','brevete', 'telefono', 'actionsColumn' ];

  choferes: Chofer[];

  listData: MatTableDataSource<Chofer>;
  model: any = {};

  constructor(
    public dialogRef: MatDialogRef<DialogBuscarChofer>,
    @Inject(MAT_DIALOG_DATA) public dialogdata: DialogData,
    private equipotransporteService: GeneralService
    ) {

      this.model.codigo = dialogdata.codigo;
      
      this.buscar();
      

    }
    onNoClick(): void {
    this.dialogRef.close();
    
  }
  seleccionarChofer(row: any){
     
     this.dialogRef.close( this.model = this.choferes.filter(x => x.id == row)[0]);
  }

  buscar(){
    this.equipotransporteService.getChoferes(this.model.codigo).subscribe(x=> {
        this.choferes = x;
        //this.loading = false;
        this.listData = new MatTableDataSource(this.choferes);
        this.listData.paginator = this.paginator;
        this.listData.sort = this.sort;
        
        

        this.listData.filterPredicate = (data,filter) => {
          return this.displayedColumns.some(ele => {
            
            if(ele !='Id' && ele != 'enLinea' && ele != 'Dni')
              {
                  return ele != 'actionsColumn' && data[ele].toLowerCase().indexOf(filter) != -1;
            
              }
            })
          }
        });
  }
}






@Component({
  selector: 'app-equipotransporte',
  templateUrl: './equipotransporte.component.html',
  styleUrls: ['./equipotransporte.component.css']
})
export class EquipotransporteComponent implements OnInit {
  model: any = {};
  transporte: any = {};
  id: any;
 
  tipoVehiculo: Dropdownlist[] = [
 ];
 
 marcaVehiculo: Dropdownlist[] = [
 ];
 
   constructor(public dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private alertify: ToastrService ,
    
    private general: GeneralService,
   ) { }
 
   ngOnInit() {
     
     this.id  = this.activatedRoute.snapshot.params["uid"];
     
     console.log(this.id);
 
     this.general.getValorTabla(4).subscribe(resp=> 
       {
         resp.forEach(element => {
           this.tipoVehiculo.push({ val: element.id , viewValue: element.valorPrincipal});
         });
          
       });

       this.general.getValorTabla(5).subscribe(resp=> 
         {
           resp.forEach(element => {
             this.marcaVehiculo.push({ val: element.id , viewValue: element.valorPrincipal});
           });
            
         });
 
     
   }
   openDialog(placa): void {
     const dialogRef = this.dialog.open(DialogBuscarPlaca, {
       width: '650px',
       height: '500px',
       data: {codigo:placa, descripcion: ""}
     });
     dialogRef.afterClosed().subscribe(result => {
       this.model.placa = result.placa;
       this.model.tipoVehiculo = result.tipoVehiculo;
       this.model.marca = result.marca;
       this.model.modelo = result.modelo;
       this.model.cargaUtil = result.cargaUtil;
       this.model.pesoBruto = result.pesoBruto;
     });
   }
   openDialogCarreta(placa): void {
    const dialogRef = this.dialog.open(DialogBuscarPlaca, {
      width: '650px',
      height: '500px',
      data: {codigo:placa, descripcion: ""}
    });
    dialogRef.afterClosed().subscribe(result => {
      this.model.carreta = result.placa;

    });
  }
   openDialog_EmpTrans(): void {
     const dialogRef = this.dialog.open(DialogBuscarEmpTransporte, {
       width: '650px',
       height: '500px',
       data: {codigo: "this.model.OrdenReciboId", descripcion: ""}
     });
     dialogRef.afterClosed().subscribe(result => {
       this.model.razonSocial = result.razonSocial  ;
       this.model.ruc = result.ruc ;
     });
   }
   openDialog_Dni(dni): void {
     const dialogRef = this.dialog.open(DialogBuscarChofer, {
       width: '650px',
       height: '500px',
       data: {codigo: dni, descripcion: ""}
     });
     dialogRef.afterClosed().subscribe(result => {
       this.model.dni = result.dni;
       this.model.nombreCompleto = result.nombreCompleto;
       this.model.brevete = result.brevete;
     });
   }
   registrar(form: NgForm) {
     
     if (form.invalid) {
       return; 
     }
     this.model.OrdenTransporteId =  this.id;

     this.general.vincularEquipoTransporte(this.model).subscribe(resp => { 
       this.transporte = resp;
     }, error => {
        this.alertify.error(error);
     }, () => { 
    
         this.model.CargasId = this.id;
         this.model.EquipoTransporteId = this.transporte.id;
        //  this.general.matchEquipoTransporte(this.model).subscribe(resp1 => { 
    
        // }, error => {
        //    this.alertify.error(error);
        // }, () => { 
        //   this.alertify.success("Se vinculó al equipo correctamente.");
        // });

       new Promise( resolve => setTimeout(resolve, 300) );
       this.alertify.success("Se creo el equipo de transporte correctamente.");
       this.router.navigate(['/seguimiento/listaorden']);
     });
   }

   onBlurMethod(placa){
 
      // Buscar en 
      this.general.getEquipoTransporte(placa).subscribe(x=>
       {
         
            
             if(x != null)
             {
                this.model.tipoVehiculo  = x.tipoVehiculoId;
                this.model.marcaVehiculo = x.marcaId;
                this.model.razonSocial = x.razonSocial;
                this.model.ruc = x.ruc;
                this.model.id = x.id;
                this.model.dni = x.dni;
                this.model.nombreCompleto = x.nombreCompleto;
                this.model.brevete = x.brevete;
                this.model.carreta = x.carreta;
 
                
                
             } 
             else
             {
                 
             }
 
       });
 
 
 
       
   }
   PlacaEncontrada(){
     
      if(this.model.id == undefined) return true; else return false;
   }
   numberOnly(event): boolean {
     const charCode = (event.which) ? event.which : event.keyCode;
     if (charCode > 31 && (charCode < 48 || charCode > 57)) {
       return false;
     }
     return true;
   }
  }


