import { Component, OnInit, OnDestroy } from '@angular/core';
import { SelectItem } from 'primeng/components/common/selectitem';
import { OrdenTransporte } from 'src/app/_models/ordenrecibo';
import { SelectionModel } from '@angular/cdk/collections';
import { Dropdownlist } from 'src/app/_models/Constantes';
import { Router } from '@angular/router';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';
import { GeneralService } from 'src/app/_services/general.service';
import { ClienteService } from 'src/app/_services/cliente.service';
import { JwtHelperService } from '@auth0/angular-jwt';

@Component({
  selector: 'app-seguimientoorden',
  templateUrl: './seguimientoorden.component.html',
  styleUrls: ['./seguimientoorden.component.css']
})
export class SeguimientoordenComponent implements OnInit , OnDestroy{

  id_interval : any;

  ngOnDestroy(): void {
    if (this.id_interval) {
      clearInterval(this.id_interval);
    }
  }
  clientes: SelectItem[] = [];
  estados: SelectItem[] = [];

  selectedCliente: string = "";
  selectedEstado: string = "";// = 'BMW';
  selectedCar3: string;
  items: SelectItem[];
  item: string;


  style = {
    width: '100%',
    height: '100%',
    boxSizing: 'border-box'
  };

ordenes : OrdenTransporte[] = [];
frozenCols: any[];   



  public loading = false;
  
  model: any;
  EstadoId : number;
  selection = new SelectionModel<OrdenTransporte>(true, []);
  cols: any[];  
  jwtHelper = new JwtHelperService();
  decodedToken: any = {};
  //protected clientes: Dropdownlist[] = [];
  dateInicio: Date = new Date(Date.now()) ;
  dateFin: Date = new Date(Date.now()) ;
  titularAlerta: string = '';

  intervalo: Dropdownlist[] = [
    {val: 0, viewValue: 'Desde Siempre'},
    {val: 1, viewValue: 'Hoy'},
    {val: 3, viewValue: 'Hace tres días'},
    {val: 7, viewValue: 'Hace una semana '},
    {val: 31, viewValue: 'Hace un mes '},
  ];


  
  
  constructor(  private router: Router,
    private ordenService: OrdenService,
    private generalService: GeneralService,
    private clienteService: ClienteService ) {
      var currentTime = new Date()


    
      
  
     }
     

  ngOnInit() {
    this.dateInicio.setDate((new Date()).getDate() - 5);
    this.dateFin.setDate((new Date()).getDate() );

    var user  = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(user);


    this.id_interval = setInterval(() =>  { 
        this.buscar();
     }, 10000);

    this.clienteService.getAllClientes("",this.decodedToken.nameid).subscribe(list => { 
      
      this.clientes.push({label: "Todos los clientes", value: ''})
       list.forEach(x=> {
          this.clientes.push({ label: x.razon_social , value: x.id.toString() });
       })
    });
    this.generalService.getEstados(2).subscribe(list => { 
      this.estados.push({label: "Todos los estados", value: ''})
       list.forEach(x=> {
          this.estados.push({ label: x.nombreEstado , value: x.id.toString() });
       })
    });
    this.ordenService.getAllOrderTransport(this.selectedCliente,this.selectedEstado,this.decodedToken.nameid,
      this.dateInicio, this.dateFin).subscribe(list => { 
    //   this.frozenCols = [
    //     { field: 'id', header: 'Acciones' }
    // ];
      this.ordenes =  list;
      this.cols = 
      [
          {header: 'Acc', field: 'id' , width: '70px' },
          // {header: 'ID', field: 'id',   width: '70px'},
          {header: 'OT', field: 'numero_ot'  ,  width: '110px' },
          {header: 'ESTADO', field: 'estado'  , width: '120px'   },
          {header: 'CLIENTE', field: 'remitente'  ,  width: '180px'  },
          {header: 'SHIPMENT', field: 'shipment' , width: '120px'  },
          {header: 'DELIVERY', field: 'delivery'  , width: '120px'  },
          // {header: 'DESTINATARIO', field: 'destinatario'  ,  width: '200px'  },

          {header: 'DESTINO', field: 'provincia_entrega'  , width: '130px'  },
          {header: 'F. CARGA', field: 'fecha_carga' , width: '120px'  },
          {header: 'CONDUCTOR', field: 'chofer',width: '180px'    }, 
          {header: 'TRACTO', field: 'tracto', width: '120px'   },
          {header: 'CARRETA', field: 'carreta', width: '120px'  },
    
        ];
    
   
     
    });

  

      // this.items = [];
      // for (let i = 0; i < 10000; i++) {
      //     this.items.push({label: 'Item ' + i, value: 'Item ' + i});
      // }
    
      

  }


  // methodFromParent(cell) {
  //   var rowNode = this.gridApi.getRowNode(cell);
  //   this.router.navigate(['/seguimiento/verorden',rowNode.data.id]);
  // }
  // editar(cell) {
  //   var rowNode = this.gridApi.getRowNode(cell);
  //   this.router.navigate(['/seguimiento/editarorden',rowNode.data.id]);
  // }
  // eliminar(cell){
  //   var rowNode = this.gridApi.getRowNode(cell);
    
    
  // }
  ver(id){
    this.router.navigate(['/seguimiento/verorden',id]);
  }
  edit(id){
        this.router.navigate(['/seguimiento/editarorden',id]);
  }


  equipotransporte() {
    this.router.navigate(['/seguimiento/uploadfile']);
  }
 
  buscar(){
    
    var user  = localStorage.getItem('token');
    this.decodedToken = this.jwtHelper.decodeToken(user);


    this.ordenService.getAllOrderTransport(this.selectedCliente,this.selectedEstado,this.decodedToken.nameid,
      this.dateInicio, this.dateFin).subscribe(list => { 
      console.log(this.ordenes);
      this.ordenes =  list;

     
    });
  }
   Popup(id) {
    let url = this.router.createUrlTree(['/seguimiento/verorden/', id]);
    window.open("/seguimiento/seguimientoorden/", "_blank", "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, location=no, width=1000, height=600, left=100, top=100 " );
      // window.open("/seguimiento/verorden/" + id,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');
      }
  
}

