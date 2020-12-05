import { Component, OnInit, ComponentFactoryResolver, ViewContainerRef, ComponentRef, AfterViewInit } from '@angular/core';
import { SeguimientoordenComponent } from '../../seguimientoorden/seguimientoorden.component';

@Component({
  selector: 'app-bypass',
  templateUrl: './bypass.component.html',
  styleUrls: ['./bypass.component.css']
})
export class BypassComponent implements OnInit  {
  public windowReference: any;
  constructor() { }

  ngOnInit() {
   // window.open("/seguimiento/seguimientoorden", "popUpWindow", "resizable=no, toolbar=no, scrollbars=no, menubar=no, status=no, directories=no, location=no, width=1000, height=600, left=100, top=100 " );
     window.open("#/seguimiento/seguimientoorden/" ,'popUpWindow','height=500,width=500,left=100,top=100,resizable=yes,scrollbars=yes,toolbar=yes,menubar=no,location=no,directories=no, status=yes');

    
  }
  


}
