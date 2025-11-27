import { TextElements } from "../../models/TextElements";
import { TextElementsAttributes } from "../../interfaces/text_elements.interface";

export const getTextElementByIdService = async (
    id_text_element: number
): Promise<TextElementsAttributes | null> => {
    try {
        const textElement = await TextElements.findByPk(id_text_element);
        return textElement ? (textElement.toJSON() as TextElementsAttributes) : null;
    } catch (error) {
        throw error;
    }
};
