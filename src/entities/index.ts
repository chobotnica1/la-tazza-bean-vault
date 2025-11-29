export type CoffeeRating = 'AAA+' | 'AAA' | 'AA' | 'A';
export type WeightUnit = 'kg' | 'lb' | 'g' | 'oz';
export type RoastLevel = 'Light' | 'Medium' | 'Dark' | 'Espresso';
export type FormatType = '12oz' | '5kg' | 'custom';

export interface GreenCoffeeBatch {
  id: string;
  variety: string;
  origin: string;
  farm?: string;
  importer?: string;
  warehouse: string;
  bagSize: string;
  quantityBags: number;
  rating: CoffeeRating;
  pricePerBag?: number;
  receivedDate: string;
  notes?: string;
}

export interface RoastedCoffeeBatch {
  id: string;
  variety: string;
  origin: string;
  rating: CoffeeRating;
  roastLevel: RoastLevel;
  formatType: FormatType;
  formatSizeValue?: number;
  formatSizeUnit?: WeightUnit;
  quantityBags: number;
  warehouse: string;
  roastDate: string;
  notes?: string;
  linkedGreenBatchId?: string;
}

export interface Customer {
  id: string;
  name: string;
  contactPerson?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  taxId?: string;
  notes?: string;
}

export interface CuppingRecord {
  id: string;
  date: string;
  variety: string;
  origin: string;
  farm?: string;
  greenBatchId?: string;
  score: number;
  sweetness?: number;
  acidity?: number;
  body?: number;
  finish?: number;
  uniformity?: number;
  balance?: number;
  cleanliness?: number;
  descriptors?: string[];
  notes?: string;
}

export interface InventorySafetyThreshold {
  variety: string;
  warehouse: string;
  criticalThreshold: number;
  lowThreshold: number;
}

export interface InventorySafetySettings {
  defaultThresholdPerVariety?: number;
  defaultThresholdPerWarehouse?: number;
  lowStockThresholds: {
    [variety: string]: {
      [warehouse: string]: number;
    };
  };
}

export interface SalesEntry {
  id: string;
  date: string;
  productName: string;
  quantity: number;
  mappedVariety?: string;
}
export interface InventorySafetySettings {
  defaultThresholdPerVariety?: number;
  defaultThresholdPerWarehouse?: number;
  lowStockThresholds: {
    [variety: string]: {
      [warehouse: string]: number;
    };
  };
}