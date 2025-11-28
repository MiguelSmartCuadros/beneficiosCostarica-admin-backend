import { Optional } from "sequelize";

export interface ProvinceXStoreAttributes {
    id: number;
    province_id: number;
    store_id: number;
}

export type ProvinceXStoreCreationAttributes = Optional<ProvinceXStoreAttributes, "id">;
