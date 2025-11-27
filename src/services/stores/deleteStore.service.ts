import { Stores } from "../../models/Stores";

export const deleteStoreService = async (
    id_stores: number
): Promise<boolean> => {
    try {
        const deletedCount = await Stores.destroy({
            where: { id_stores },
        });
        return deletedCount > 0;
    } catch (error) {
        throw error;
    }
};
