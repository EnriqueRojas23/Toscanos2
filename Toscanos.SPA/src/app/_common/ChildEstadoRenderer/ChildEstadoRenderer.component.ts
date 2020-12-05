import { Component, OnInit } from '@angular/core';
import { ICellRendererAngularComp } from 'ag-grid-angular';

@Component({
  selector: 'app-ChildEstadoRenderer',
  templateUrl: './ChildEstadoRenderer.component.html',
  styles: [
    `.btn {
        line-height: 0.5;
    }
  .success {background-color: #4CAF50;} 
  .info {background-color: #2196F3;} 
  .warning {background-color: #ff9800;} 
  .danger {background-color: #f44336;}
  .other {background-color: #e7e7e7; color: black;} `
]
})
export class ChildEstadoRenderer implements ICellRendererAngularComp {
  public params: any;

  agInit(params: any): void {
      this.params = params;
  }

  public invokeParentMethod() {
      this.params.context.componentParent.methodFromParent(`${this.params.node.rowIndex}`);
  }

  refresh(): boolean {
      return false;
  }
}
