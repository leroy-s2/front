//reaccion.ts
export interface reaccion_publicacion{ 
    tipo_reaccion : string;
    publicacion : {
        id: number;
    }
}

export interface reaccion_comentario{
    tipo_reaccion : string;
    comentario:{
        id: number;
    }
}