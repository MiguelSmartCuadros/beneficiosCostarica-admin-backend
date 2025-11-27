import { Stores } from "../../models/Stores";
import { StoresAttributes } from "../../interfaces/stores.interface";

export const getStoreByIdService = async (
    id_stores: number
): Promise<StoresAttributes | null> => {
    try {
        const store = await Stores.findByPk(id_stores);
        return store ? (store.toJSON() as StoresAttributes) : null;
    } catch (error) {
        throw error;
    }
};
