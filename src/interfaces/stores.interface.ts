import { Optional } from "sequelize";

export interface StoresAttributes {
    id_stores: number;
    id_user_responsible: number;
    store_name: string;
    category_id: number;
    shop_type_id: number;
    province_id: number;
    store_img_card: string;
    store_img_highlight: string;
    store_img_banner: string;
    start_date: string;
    end_date: string;
    discount_description: string;
    description: string | null;
    terms_conditions: string;
    restrictions: string | null;
    url_terms_conditions: string | null;
}

export type StoresCreationAttributes = Optional<StoresAttributes, "id_stores">;

