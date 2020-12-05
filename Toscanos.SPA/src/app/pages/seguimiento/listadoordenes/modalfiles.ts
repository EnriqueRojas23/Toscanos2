import {Component, OnInit} from '@angular/core';


import { DynamicDialogRef } from 'primeng/components/dynamicdialog/dynamicdialog-ref';
import { DynamicDialogConfig } from 'primeng/components/dynamicdialog/dynamicdialog-config';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';

@Component({
    template: `
    <p-carousel [value]="documentos" [numVisible]="1" [numScroll]="1" [circular]="true" >
    <ng-template pTemplate="header">
        <h5>Basic</h5>
    </ng-template>
    <ng-template let-product pTemplate="item">
        <div class="product-item">
            <div class="product-item-content">
                <div class="p-mb-3">
                    <img src="assets/uploadedfiles/{{this.id}}/{{product.nombre}}" width="200" height="240" />
                </div>
            </div>
        </div>
    </ng-template>
</p-carousel>
    `
})
export class FileModalComponent  implements OnInit {

    documentos: any[];
    id: any;

    constructor(private ordenService: OrdenService
        ,       public ref: DynamicDialogRef, public config: DynamicDialogConfig) {

            this.id = config.data.id;
            this.ordenService.getAllDocumentos(config.data.id ).subscribe(x => {
                this.documentos = x;


          });
         }

    ngOnInit() {

    }

    downloadFile(documentoId: number) {
        this.ordenService.downloadDocumento(documentoId).subscribe(
          (response: any) => {
              const dataType = response.type;
              const binaryData = [];
              binaryData.push(response);
              const downloadLink = document.createElement('a');
              downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, {type: dataType}));
             // document.body.appendChild(downloadLink);
              // downloadLink.click();
             // this.createImageFromBlob(new Blob(binaryData, {type: dataType}));

              window.open(downloadLink.href);
          }
        );
      }

}
