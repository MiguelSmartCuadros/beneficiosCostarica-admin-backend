import { Optional } from "sequelize";

export interface TypeshopProfileAttributes {
    id_typeshop_profile: number;
    store_id: number;
    typeshop_id: number;
    url_store: string;
}

export interface TypeshopProfileCreationAttributes extends Optional<TypeshopProfileAttributes, "id_typeshop_profile"> { }
