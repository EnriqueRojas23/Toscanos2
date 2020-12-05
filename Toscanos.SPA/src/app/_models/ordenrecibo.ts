import { NumberSymbol } from '@angular/common';


export interface ActivityPropios {
     placa: string;
     NombreCompleto: string;
     razon_social: string;
     nombreEstado: string;
     proveedor_id: number;
}
export interface AsignacionUnidadesVehiculo {
     fecha_carga: Date;
     cantidad: number;
     disponibilidad: number;
}

export interface DespachosPuntualidad {
     id: number;
     numero_ot: string;
     fecha_hora_programada: Date;
     fecha_hora_llegada: Date;
     diferencia: number;

}
export interface ReporteEncuesta {
     nivel_satisfaccion: number;

}
export interface CantidadxManifiesto {
     id: number;
     numero_manifiesto: string;
     cantidad: number;

}
export interface DaysOfWeek {
     cantidad: number;
     dayofw: String;

}

export interface TiempoEntrega {
     id: number;
     tiempo: number;
     llegada: Date;
     entrega: Date;
}
export interface DespachosATiempo {
     atiempo: number;
     notiempo: number;
}
export interface CantidadDespacho {
     ok: number;
     rechazado: number;
     total: number;
     entregado: number;
     demorado: number;
     noentregado: number;
     entregaparcial: number;
     edireccion: number;
     pendientes: number;
}
export interface OrdenTransporte {
     id?: number;
     numero_ot: string;
     shipment: string;
     delivery: string;
     destinatario: string;
     remitente: string;
     por_asignar: boolean;
     remitente_id: number;
     destinatario_id: number;
     factura: string;
     oc: string;
     guias: string;
     cantidad: number;
     volumen: number;
     peso: number;
     tiposervicio_id: number;
     distrito_carga_id: number;
     distrito_carga: string;
     direccion_carga: string;
     fecha_carga: Date;
     hora_carga: string;
     distrito_servicio: string;
     direccion_destino_servicio: string;
     fecha_salida: Date;
     hora_salida: string;
     fecha_entrega: Date;
     direccion_entrega: string;
     provincia_entrega: string;
     hora_entrega: string;
     numero_manifiesto: string;
     tracto: string;
     carreta: string;
     chofer: string;
     usuario_registro: string;
     estado_id: number;
     lat_entrega: number;
     lng_entrega: number;
     nivel_satisfaccion: number;
}
export interface ActivityTotal {
     razon_social: string;
     total: number;
     tipo: string;
}
export interface ActivityVehiculosRuta {
      placa: string ;
      estado_id: number;
}
export interface ActivityTotalPendientes {
     enTransito: number;
}
export interface ReporteServicio {
     razon_social: string;
     ots: string;
     costo: number;
     valorizado: number;
     fecha_carga: string;
}
