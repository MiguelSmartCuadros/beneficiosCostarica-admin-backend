import { Stores } from "../../models/Stores";
import { StoresAttributes } from "../../interfaces/stores.interface";

export const getAllStoresService = async (): Promise<StoresAttributes[]> => {
    try {
        const stores = await Stores.findAll();
        return stores as unknown as StoresAttributes[];
    } catch (error) {
        throw error;
    }
};
