import { create } from 'zustand';
import axios from 'axios';

// Create axios instance with base URL
const api = axios.create({
    baseURL: 'http://localhost:2000/api',
});

const useInventoryStore = create((set, get) => ({
    assets: [],
    consumables: [],
    selectedAsset: null,
    selectedConsumable: null,
    isLoading: false,
    error: null,

    // Fetch all assets
    fetchAssets: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/assets/all-assets');
            set({ assets: response.data.data, isLoading: false });
        } catch (error) {
            console.error("Error fetching assets:", error);
            set({ error: "Failed to fetch assets", isLoading: false });
        }
    },

    // Fetch all consumables
    fetchConsumables: async () => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.get('/assets/all-consuambles');
            set({ consumables: response.data.data, isLoading: false });
        } catch (error) {
            console.error("Error fetching consumables:", error);
            set({ error: "Failed to fetch consumables", isLoading: false });
        }
    },

    // Fetch a single asset by ID
    fetchAssetById: async (assetId) => {
        if (!assetId) {
            console.error('No asset ID provided');
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/assets/assets/${assetId}`);
            set({ selectedAsset: response.data.data, isLoading: false });
        } catch (error) {
            console.error("Error fetching asset details:", error);
            set({ error: "Failed to fetch asset details", isLoading: false });
        }
    },

    // Fetch a single consumable by ID
    fetchConsumableById: async (consumableId) => {
        if (!consumableId) {
            console.error('No consumable ID provided');
            return;
        }
        set({ isLoading: true, error: null });
        try {
            const response = await api.get(`/assets/consumable/${consumableId}`);
            set({ selectedConsumable: response.data.data, isLoading: false });
        } catch (error) {
            console.error("Error fetching consumable details:", error);
            set({ error: "Failed to fetch consumable details", isLoading: false });
        }
    },

    // Add a new asset
    addAsset: async (assetData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/assets/add-assets', assetData);
            set((state) => ({
                assets: [...state.assets, { ...assetData, asset_id: response.data.asset_id }],
                isLoading: false
            }));
        } catch (error) {
            console.error("Error adding asset:", error);
            set({ error: "Failed to add asset", isLoading: false });
        }
    },

    // Add a new consumable
    addConsumable: async (consumableData) => {
        set({ isLoading: true, error: null });
        try {
            const response = await api.post('/assets/add-consumable', consumableData);
            set((state) => ({
                consumables: [...state.consumables, { ...consumableData, consumable_id: response.data.consumable_id }],
                isLoading: false
            }));
        } catch (error) {
            console.error("Error adding consumable:", error);
            set({ error: "Failed to add consumable", isLoading: false });
        }
    },
}));

export default useInventoryStore;
