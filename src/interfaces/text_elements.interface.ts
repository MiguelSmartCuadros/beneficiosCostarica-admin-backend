import { Optional } from "sequelize";

export interface TextElementsAttributes {
    id_text_element: number;
    store_id: number;
    discount_description: string;
    description: string | null;
    terms_conditions: string;
    url_terms_conditions: string | null;
    restrictions: string | null;
}

export type TextElementsCreationAttributes = Optional<TextElementsAttributes, "id_text_element">;
