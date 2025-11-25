import { Optional } from "sequelize";

export interface TipoDocumentoIdentidadAttributes {
    id: number;
    codigo: string;
    descripcion: string;
}

export type TipoDocumentoIdentidadCreationAttributes = Optional<TipoDocumentoIdentidadAttributes, "id">;
