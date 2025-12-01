import { Optional } from "sequelize";

export interface DiscountCodesAttributes {
    id_discout_codes: number;
    store_id: number;
    codes: string;
}

export type DiscountCodesCreationAttributes = Optional<DiscountCodesAttributes, "id_discout_codes">;
