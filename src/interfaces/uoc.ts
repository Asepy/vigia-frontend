export interface UOCResume{
    consultas_aclaradas:string|number|null;
    en_proceso:string|number|null;
    horas_promedio:string|number|null;
    reclamos_resueltos:string|number|null;
}

export interface UOCContactPoint{
    contact_point_email:string|null;
    contact_point_name:string|null;
    contact_point_telephone:string|null;
}


export interface UOCContactPointResponse{
    entidad:string;
    data:Array<UOCContactPoint>|null;
}



