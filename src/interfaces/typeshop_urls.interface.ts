import { Optional } from "sequelize";

export interface TypeshopUrlsAttributes {
    id_typeshop_urls: number;
    store_id: number;
    typeshop_id: number;
    url_store: string;
}

export interface TypeshopUrlsCreationAttributes extends Optional<TypeshopUrlsAttributes, "id_typeshop_urls"> { }
