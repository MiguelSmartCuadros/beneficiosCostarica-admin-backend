import { TextElements } from "../../models/TextElements";
import { TextElementsAttributes, TextElementsCreationAttributes } from "../../interfaces/text_elements.interface";

export const createTextElementService = async (
    textElementData: TextElementsCreationAttributes
): Promise<TextElementsAttributes> => {
    try {
        const newTextElement = await TextElements.create(textElementData);
        return newTextElement.toJSON() as TextElementsAttributes;
    } catch (error) {
        throw error;
    }
};
