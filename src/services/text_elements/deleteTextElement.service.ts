import { TextElements } from "../../models/TextElements";

export const deleteTextElementService = async (
    id_text_element: number
): Promise<boolean> => {
    try {
        const deletedCount = await TextElements.destroy({
            where: { id_text_element },
        });
        return deletedCount > 0;
    } catch (error) {
        throw error;
    }
};
