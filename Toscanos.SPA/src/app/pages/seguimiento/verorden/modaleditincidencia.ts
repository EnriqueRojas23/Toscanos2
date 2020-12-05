import { Component,Inject, ViewEncapsulation, OnInit} from '@angular/core';
import { DynamicDialogRef } from 'primeng/components/dynamicdialog/dynamicdialog-ref';
import { DynamicDialogConfig } from 'primeng/components/dynamicdialog/dynamicdialog-config';
import { OrdenService } from 'src/app/_services/seguimiento/orden.service';
import { AuthService } from 'src/app/_services/auth.service';
import { NgForm } from '@angular/forms';
import { SelectItem } from 'primeng/components/common/selectitem';
import { ToastrService } from 'ngx-toastr';
import { MAT_DATE_FORMATS, DateAdapter } from '@angular/material';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/_common/datepicker.extend';
import { DatosIncidencia } from 'src/app/_models/datosincidencia';

@Component({

    providers: [
        {
            provide: DateAdapter, useClass: AppDateAdapter
        },
        {
            provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS
        }],
    template:  `<div class="dialog-content-wrapper">
    <form #f="ngForm"  (ngSubmit)="actualizar(f)"  class="event-form w-100-p" fxLayout="column" fxFle>
        <div fxFlex="1 0 auto" fxLayout="column" fxLayout.gt-xs="row">

                    <mat-form-field appearance="outline" class="col-md-12" >
                        <mat-label>Fecha Incidencia</mat-label>
                        <input matInput  name="fecha_incidencia"
                        [(ngModel)]="Incidencia.fecha_incidencia" required type="datetime-local">
                    </mat-form-field>
        </div>
        <div >
            <mat-form-field class="col-12 col-sm-12 col-lg-12">
            <mat-label>Incidencia</mat-label>
            <mat-select [disabled]="true" name="maestro_incidencia_id" [(ngModel)]="Incidencia.maestro_incidencia_id" 
                        fxFlex="100" class="w-100-p">
                <mat-option *ngFor="let item of maestroIncidencias"
                     [value]="item.value">{{item.label}}</mat-option>
            </mat-select>
            </mat-form-field>
        </div>
        <div fxFlex="1 0 auto" fxLayout="column" fxLayout.gt-xs="row">
        <mat-form-field class="col-12 col-md-12 col-lg-12">
                <mat-label>Observación</mat-label>
                <input matInput
                       name="descripcion"
                       [(ngModel)]="Incidencia.descripcion"
                       required>
        </mat-form-field>
        </div>
        <div fxFlex="1 0 auto" fxLayout="column" fxLayout.gt-xs="row">
            <div class="col-sm-6">
                <button [disabled]="!f.valid" pButton type="submit" label="Actualizar"  class="ui-button-raised ui-button-success"></button>
            </div>
        </div>
    </form>
    </div>
    `
})

// tslint:disable-next-line: component-class-suffix
export class EditIncidenciaModalComponet  implements OnInit {

    Modal: DynamicDialogRef;
    Incidencia: DatosIncidencia;
    id: any;
    es: any;
    model: any = {};
    maestroIncidencias: SelectItem[] = [];
    dateInicio: Date = new Date(Date.now()) ;
    UserId: number;

    constructor(private ordenService: OrdenService, public ref: DynamicDialogRef, public config: DynamicDialogConfig,
                private toastService: ToastrService, private authService: AuthService ) {

        this.Incidencia = config.data.x;
        this.Modal = ref;
        this.ordenService.getMaestroIncidencias().subscribe(resp => {
            resp.forEach(element => {
                this.maestroIncidencias.push({ label: element.descripcion , value: element.id });
              });
            this.id = config.data.id;
            this.Incidencia = config.data.x;
        });

    }

    ngOnInit() {

        const token = this.authService.jwtHelper.decodeToken(localStorage.getItem('token'));
        this.UserId = token.nameid;
    }

    actualizar(form: NgForm) {
        if (form.invalid) {
          return;
        }
        this.model.id = this.Incidencia.id;
        this.model.fecha = this.Incidencia.fecha_incidencia;
        this.model.incidencia = this.Incidencia.maestro_incidencia_id;
        this.model.observacion = this.Incidencia.descripcion;
        this.model.usuario = this.UserId;

        this.ordenService.actualizarIncidencia(this.model).subscribe(x => {
        }, error => {
          this.toastService.error(error);
        }, () => {
          this.Modal.close();
          this.toastService.success('Se actualizó correctamente.');
        });
      }
}