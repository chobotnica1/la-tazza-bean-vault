export interface InventorySafetySettings {
  id: string; // use "global" as the single record ID
  lowStockThresholds: {
    [variety: string]: {
      [warehouse: string]: number;
    };
  };
  defaultThresholdPerVariety?: number;
  defaultThresholdPerWarehouse?: number;
}