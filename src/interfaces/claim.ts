export interface Question {
  id: string;
  nombre: string;
  titulo: string;
  tipo: string;
  estado: string;
  fecha_creacion: string;
  fecha_modificacion: string | null;
  grupo: string;
  id_respuesta: string;
  respuesta: string;
  nombres?: string;
  apellidos?: string;
}

export interface Claim {
  afeccion: string;
  correo: string;
  enlace: string;
  entidad: string;
  estado: string;
  etapa: string;
  extraQuestions: Question[];
  fecha_creacion: string;
  fecha_modificacion: string | null;
  id: string;
  llamado: string;
  ocid: string;
  reclamo: string;
  tarea_descripcion: string;
  tarea_estado: string;
  tarea_fecha_asignacion: string;
  usuario: string;
  nombres?: string;
  apellidos?: string;
}
