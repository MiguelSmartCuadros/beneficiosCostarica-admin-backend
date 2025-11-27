import { TextElements } from "../../models/TextElements";
import { TextElementsAttributes } from "../../interfaces/text_elements.interface";

export const updateTextElementService = async (
    id_text_element: number,
    textElementData: Partial<TextElementsAttributes>
): Promise<TextElementsAttributes | null> => {
    try {
        const textElement = await TextElements.findByPk(id_text_element);
        if (!textElement) return null;

        await textElement.update(textElementData);
        return textElement.toJSON() as TextElementsAttributes;
    } catch (error) {
        throw error;
    }
};
