import { Stores } from "../../models/Stores";
import { StoresAttributes } from "../../interfaces/stores.interface";

export const updateStoreService = async (
    id_stores: number,
    storeData: Partial<StoresAttributes>
): Promise<StoresAttributes | null> => {
    try {
        const store = await Stores.findByPk(id_stores);
        if (!store) return null;

        await store.update(storeData);
        return store.toJSON() as StoresAttributes;
    } catch (error) {
        throw error;
    }
};
