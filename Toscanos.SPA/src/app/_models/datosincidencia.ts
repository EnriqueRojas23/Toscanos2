export interface DatosIncidencia {
    id: number;
    maestro_incidencia_id: number;
    orden_trabajo_id: number;
    incidencia: string;
    descripcion: string;
    observacion: string;
    fecha_incidencia: Date;
    fecha_registro: Date;
    usuario_id: number;
    activo: boolean;
    documento: string ;
    recurso: string ;
    fecha: Date ;
}