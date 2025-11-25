import { Optional } from "sequelize";

export interface TypeshopsAttributes {
    id_type_shop: number;
    shop_type_name: string;
}

export type TypeshopsCreationAttributes = Optional<TypeshopsAttributes, "id_type_shop">;

