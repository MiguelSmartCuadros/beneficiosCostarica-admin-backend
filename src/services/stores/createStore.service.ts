import { Stores } from "../../models/Stores";
import { StoresAttributes, StoresCreationAttributes } from "../../interfaces/stores.interface";

export const createStoreService = async (
    storeData: StoresCreationAttributes
): Promise<StoresAttributes> => {
    try {
        const newStore = await Stores.create(storeData);
        return newStore.toJSON() as StoresAttributes;
    } catch (error) {
        throw error;
    }
};
