import { TextElements } from "../../models/TextElements";
import { TextElementsAttributes } from "../../interfaces/text_elements.interface";

export const getAllTextElementsService = async (): Promise<TextElementsAttributes[]> => {
    try {
        const textElements = await TextElements.findAll();
        return textElements as unknown as TextElementsAttributes[];
    } catch (error) {
        throw error;
    }
};
