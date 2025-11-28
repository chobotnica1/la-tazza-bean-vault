export type CoffeeRating = "AAA+" | "AAA" | "AA" | "A";
export type WeightUnit = "kg" | "lb" | "g" | "oz";
export type RoastLevel = "Light" | "Medium" | "Dark" | "Espresso";
export type FormatType = "5kg" | "12oz" | "custom";
export type MovementType = "IN" | "OUT" | "TRANSFER";
export type DeliveryStatus = "Pending" | "Delivered" | "Invoiced";

export interface CoffeeMaster {
  id: string;
  variety: string;
  origin: string;
  farm?: string;
  importer?: string;
  rating: CoffeeRating;
}

export interface TransferHistoryEntry {
  date: string;
  fromWarehouse: string;
  toWarehouse: string;
  quantityBags: number;
}

export interface GreenCoffeeBatch {
  id: string;
  variety: string;
  origin: string;
  farm: string;
  importer: string;
  warehouse: string;
  bagSizeValue: number;
  bagSizeUnit: WeightUnit;
  quantityBags: number;
  rating: CoffeeRating;
  pricePerUnit: number;
  priceUnit: WeightUnit;
  deliveryCost?: number;
  receivedDate: string;
  notes?: string;
  transferHistory?: TransferHistoryEntry[];
}

export interface IncomingGreenOrder {
  id: string;
  variety: string;
  origin: string;
  farm: string;
  importer: string;
  warehouse: string;
  bagSizeValue: number;
  bagSizeUnit: WeightUnit;
  quantityBags: number;
  rating: CoffeeRating;
  pricePerUnit: number;
  priceUnit: WeightUnit;
  deliveryCost?: number;
  orderDate?: string;
  expectedArrival?: string;
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
  
  // Phase 2: Cost tracking fields
  greenInputWeight?: number;
  lossPercent?: number;
  roastedOutputWeight?: number;
  greenCostTotal?: number;
  roastingCost?: number;
  bagAndLabelCost?: number;
  deliveryCost?: number;
  totalBatchCost?: number;
  costPerBag?: number;
  costPerPound?: number;
}

export interface SalesMapping {
  id: string;
  cloverProductName: string;
  roastedProductKey: string;
}

export interface SalesEntry {
  id: string;
  date: string;
  cloverProductName: string;
  mappedVariety?: string;
  quantity: number;
  notes?: string;
}

export interface WarehouseMovement {
  id: string;
  date: string;
  variety: string;
  origin: string;
  warehouseFrom?: string;
  warehouseTo?: string;
  movementType: MovementType;
  bagSizeValue: number;
  bagSizeUnit: WeightUnit;
  quantityBags: number;
  notes?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  taxId?: string;
  notes?: string;
}

export interface DeliveryItem {
  variety: string;
  formatSizeValue: number;
  formatSizeUnit: WeightUnit | "oz-approx";
  quantityBags: number;
  unitPrice: number;
  lineTotal: number;
}

export interface Delivery {
  id: string;
  customerId: string;
  deliveryDate: string;
  invoiceNumber: string;
  status: DeliveryStatus;
  exportedToQuickBooks: boolean;
  items: DeliveryItem[];
  deliveryNotes?: string;
  totalAmount: number;
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

export interface CuppingSession {
  id: string;
  sessionDate: string;
  sessionName: string;
  cuppers: string[];
  recordIds: string[];
  overallNotes?: string;
}
