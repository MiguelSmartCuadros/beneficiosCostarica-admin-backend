import { Optional } from "sequelize";

export interface AsignedCodesUserAttributes {
    id: number;
    store_id: number;
    code_id: number;
    document_number: string;
    is_black: number;
    date: Date;
}

export type AsignedCodesUserCreationAttributes = Optional<AsignedCodesUserAttributes, "id">;
