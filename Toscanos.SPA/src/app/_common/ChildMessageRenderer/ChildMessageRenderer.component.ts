import {Component} from "@angular/core";
import {ICellRendererAngularComp} from "ag-grid-angular";

@Component({
    selector: 'child-cell',
    templateUrl: './ChildMessageRenderer.component.html',
    styles: [
        `.btn {
            line-height: 0.5;
            
        }
        .btn-group  > .btn.btn-primary{
            border-left-color:#e3e7ec;
        } `
    ]
})
export class ChildMessageRenderer implements ICellRendererAngularComp {
    public params: any;

    agInit(params: any): void {
        this.params = params;
    }

    public invokeParentMethod() {
        //this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Val: ${this.params.node.value}`)
        this.params.context.componentParent.methodFromParent(`${this.params.node.rowIndex}`);
    }
    public editarMethod() {
        //this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Val: ${this.params.node.value}`)
        this.params.context.componentParent.editar(`${this.params.node.rowIndex}`);
    }
    public eliminarMethod() {
        //this.params.context.componentParent.methodFromParent(`Row: ${this.params.node.rowIndex}, Val: ${this.params.node.value}`)
        this.params.context.componentParent.eliminar(`${this.params.node.rowIndex}`);
    }
    refresh(): boolean {
        return false;
    }
}