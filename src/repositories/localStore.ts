import type {
  GreenCoffeeBatch,
  IncomingGreenOrder,
  RoastedCoffeeBatch,
  Customer,
  Delivery,
  SalesMapping,
  SalesEntry,
  WarehouseMovement,
  CuppingRecord,
  CuppingSession,
  InventorySafetySettings,
} from '../entities';

// Storage keys
const STORAGE_KEYS = {
  GREEN_BATCHES: 'laTazza_greenCoffeeBatches',
  INCOMING_ORDERS: 'laTazza_incomingGreenOrders',
  ROASTED_BATCHES: 'laTazza_roastedCoffeeBatches',
  CUSTOMERS: 'laTazza_customers',
  DELIVERIES: 'laTazza_deliveries',
  SALES_MAPPINGS: 'laTazza_salesMappings',
  SALES_ENTRIES: 'laTazza_salesEntries',
  WAREHOUSE_MOVEMENTS: 'laTazza_warehouseMovements',
  CUPPING_RECORDS: 'laTazza_cuppingRecords',
  CUPPING_SESSIONS: 'laTazza_cuppingSessions',
  SAFETY_SETTINGS: 'laTazza_safetySettings',
};

// Generic functions
export function getAll<T>(key: string): T[] {
  try {
    const data = localStorage.getItem(key);
    if (!data) return [];
    return JSON.parse(data) as T[];
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error);
    return [];
  }
}

export function saveAll<T>(key: string, items: T[]): void {
  try {
    localStorage.setItem(key, JSON.stringify(items));
  } catch (error) {
    console.error(`Error saving to localStorage key "${key}":`, error);
  }
}

// Green Coffee Batches
export function getAllGreenBatches(): GreenCoffeeBatch[] {
  return getAll<GreenCoffeeBatch>(STORAGE_KEYS.GREEN_BATCHES);
}

export function saveAllGreenBatches(batches: GreenCoffeeBatch[]): void {
  saveAll(STORAGE_KEYS.GREEN_BATCHES, batches);
}

export function addGreenBatch(batch: GreenCoffeeBatch): void {
  const batches = getAllGreenBatches();
  batches.push(batch);
  saveAllGreenBatches(batches);
}

export function updateGreenBatch(batch: GreenCoffeeBatch): void {
  const batches = getAllGreenBatches();
  const index = batches.findIndex((b) => b.id === batch.id);
  if (index !== -1) {
    batches[index] = batch;
    saveAllGreenBatches(batches);
  }
}

export function deleteGreenBatch(id: string): void {
  const batches = getAllGreenBatches();
  const filtered = batches.filter((b) => b.id !== id);
  saveAllGreenBatches(filtered);
}

// Incoming Green Orders
export function getAllIncomingOrders(): IncomingGreenOrder[] {
  return getAll<IncomingGreenOrder>(STORAGE_KEYS.INCOMING_ORDERS);
}

export function saveAllIncomingOrders(orders: IncomingGreenOrder[]): void {
  saveAll(STORAGE_KEYS.INCOMING_ORDERS, orders);
}

export function addIncomingOrder(order: IncomingGreenOrder): void {
  const orders = getAllIncomingOrders();
  orders.push(order);
  saveAllIncomingOrders(orders);
}

export function updateIncomingOrder(order: IncomingGreenOrder): void {
  const orders = getAllIncomingOrders();
  const index = orders.findIndex((o) => o.id === order.id);
  if (index !== -1) {
    orders[index] = order;
    saveAllIncomingOrders(orders);
  }
}

export function deleteIncomingOrder(id: string): void {
  const orders = getAllIncomingOrders();
  const filtered = orders.filter((o) => o.id !== id);
  saveAllIncomingOrders(filtered);
}

// Roasted Coffee Batches
export function getAllRoastedBatches(): RoastedCoffeeBatch[] {
  return getAll<RoastedCoffeeBatch>(STORAGE_KEYS.ROASTED_BATCHES);
}

export function saveAllRoastedBatches(batches: RoastedCoffeeBatch[]): void {
  saveAll(STORAGE_KEYS.ROASTED_BATCHES, batches);
}

export function addRoastedBatch(batch: RoastedCoffeeBatch): void {
  const batches = getAllRoastedBatches();
  batches.push(batch);
  saveAllRoastedBatches(batches);
}

export function updateRoastedBatch(batch: RoastedCoffeeBatch): void {
  const batches = getAllRoastedBatches();
  const index = batches.findIndex((b) => b.id === batch.id);
  if (index !== -1) {
    batches[index] = batch;
    saveAllRoastedBatches(batches);
  }
}

export function deleteRoastedBatch(id: string): void {
  const batches = getAllRoastedBatches();
  const filtered = batches.filter((b) => b.id !== id);
  saveAllRoastedBatches(filtered);
}

// Customers
export function getAllCustomers(): Customer[] {
  return getAll<Customer>(STORAGE_KEYS.CUSTOMERS);
}

export function saveAllCustomers(customers: Customer[]): void {
  saveAll(STORAGE_KEYS.CUSTOMERS, customers);
}

export function addCustomer(customer: Customer): void {
  const customers = getAllCustomers();
  customers.push(customer);
  saveAllCustomers(customers);
}

export function updateCustomer(customer: Customer): void {
  const customers = getAllCustomers();
  const index = customers.findIndex((c) => c.id === customer.id);
  if (index !== -1) {
    customers[index] = customer;
    saveAllCustomers(customers);
  }
}

export function deleteCustomer(id: string): void {
  const customers = getAllCustomers();
  const filtered = customers.filter((c) => c.id !== id);
  saveAllCustomers(filtered);
}

// Deliveries
export function getAllDeliveries(): Delivery[] {
  return getAll<Delivery>(STORAGE_KEYS.DELIVERIES);
}

export function saveAllDeliveries(deliveries: Delivery[]): void {
  saveAll(STORAGE_KEYS.DELIVERIES, deliveries);
}

export function addDelivery(delivery: Delivery): void {
  const deliveries = getAllDeliveries();
  deliveries.push(delivery);
  saveAllDeliveries(deliveries);
}

export function updateDelivery(delivery: Delivery): void {
  const deliveries = getAllDeliveries();
  const index = deliveries.findIndex((d) => d.id === delivery.id);
  if (index !== -1) {
    deliveries[index] = delivery;
    saveAllDeliveries(deliveries);
  }
}

export function deleteDelivery(id: string): void {
  const deliveries = getAllDeliveries();
  const filtered = deliveries.filter((d) => d.id !== id);
  saveAllDeliveries(filtered);
}

// Sales Mappings
export function getAllSalesMappings(): SalesMapping[] {
  return getAll<SalesMapping>(STORAGE_KEYS.SALES_MAPPINGS);
}

export function saveAllSalesMappings(mappings: SalesMapping[]): void {
  saveAll(STORAGE_KEYS.SALES_MAPPINGS, mappings);
}

export function addSalesMapping(mapping: SalesMapping): void {
  const mappings = getAllSalesMappings();
  mappings.push(mapping);
  saveAllSalesMappings(mappings);
}

export function updateSalesMapping(mapping: SalesMapping): void {
  const mappings = getAllSalesMappings();
  const index = mappings.findIndex((m) => m.id === mapping.id);
  if (index !== -1) {
    mappings[index] = mapping;
    saveAllSalesMappings(mappings);
  }
}

export function deleteSalesMapping(id: string): void {
  const mappings = getAllSalesMappings();
  const filtered = mappings.filter((m) => m.id !== id);
  saveAllSalesMappings(filtered);
}

// Sales Entries
export function getAllSalesEntries(): SalesEntry[] {
  return getAll<SalesEntry>(STORAGE_KEYS.SALES_ENTRIES);
}

export function saveAllSalesEntries(entries: SalesEntry[]): void {
  saveAll(STORAGE_KEYS.SALES_ENTRIES, entries);
}

export function addSalesEntry(entry: SalesEntry): void {
  const entries = getAllSalesEntries();
  entries.push(entry);
  saveAllSalesEntries(entries);
}

export function updateSalesEntry(entry: SalesEntry): void {
  const entries = getAllSalesEntries();
  const index = entries.findIndex((e) => e.id === entry.id);
  if (index !== -1) {
    entries[index] = entry;
    saveAllSalesEntries(entries);
  }
}

export function deleteSalesEntry(id: string): void {
  const entries = getAllSalesEntries();
  const filtered = entries.filter((e) => e.id !== id);
  saveAllSalesEntries(filtered);
}

// Warehouse Movements
export function getAllWarehouseMovements(): WarehouseMovement[] {
  return getAll<WarehouseMovement>(STORAGE_KEYS.WAREHOUSE_MOVEMENTS);
}

export function saveAllWarehouseMovements(movements: WarehouseMovement[]): void {
  saveAll(STORAGE_KEYS.WAREHOUSE_MOVEMENTS, movements);
}

export function addWarehouseMovement(movement: WarehouseMovement): void {
  const movements = getAllWarehouseMovements();
  movements.push(movement);
  saveAllWarehouseMovements(movements);
}

export function updateWarehouseMovement(movement: WarehouseMovement): void {
  const movements = getAllWarehouseMovements();
  const index = movements.findIndex((m) => m.id === movement.id);
  if (index !== -1) {
    movements[index] = movement;
    saveAllWarehouseMovements(movements);
  }
}

export function deleteWarehouseMovement(id: string): void {
  const movements = getAllWarehouseMovements();
  const filtered = movements.filter((m) => m.id !== id);
  saveAllWarehouseMovements(filtered);
}

// Cupping Records
export function getAllCuppingRecords(): CuppingRecord[] {
  return getAll<CuppingRecord>(STORAGE_KEYS.CUPPING_RECORDS);
}

export function saveAllCuppingRecords(records: CuppingRecord[]): void {
  saveAll(STORAGE_KEYS.CUPPING_RECORDS, records);
}

export function addCuppingRecord(record: CuppingRecord): void {
  const records = getAllCuppingRecords();
  records.push(record);
  saveAllCuppingRecords(records);
}

export function updateCuppingRecord(record: CuppingRecord): void {
  const records = getAllCuppingRecords();
  const index = records.findIndex((r) => r.id === record.id);
  if (index !== -1) {
    records[index] = record;
    saveAllCuppingRecords(records);
  }
}

export function deleteCuppingRecord(id: string): void {
  const records = getAllCuppingRecords();
  const filtered = records.filter((r) => r.id !== id);
  saveAllCuppingRecords(filtered);
}

// Cupping Sessions
export function getAllCuppingSessions(): CuppingSession[] {
  return getAll<CuppingSession>(STORAGE_KEYS.CUPPING_SESSIONS);
}

export function saveAllCuppingSessions(sessions: CuppingSession[]): void {
  saveAll(STORAGE_KEYS.CUPPING_SESSIONS, sessions);
}

export function addCuppingSession(session: CuppingSession): void {
  const sessions = getAllCuppingSessions();
  sessions.push(session);
  saveAllCuppingSessions(sessions);
}

export function updateCuppingSession(session: CuppingSession): void {
  const sessions = getAllCuppingSessions();
  const index = sessions.findIndex((s) => s.id === session.id);
  if (index !== -1) {
    sessions[index] = session;
    saveAllCuppingSessions(sessions);
  }
}

export function deleteCuppingSession(id: string): void {
  const sessions = getAllCuppingSessions();
  const filtered = sessions.filter((s) => s.id !== id);
  saveAllCuppingSessions(filtered);
}

// Inventory Safety Settings
export function getSafetySettings(): InventorySafetySettings {
  try {
    const data = localStorage.getItem(STORAGE_KEYS.SAFETY_SETTINGS);
    if (!data) {
      return {
        id: 'global',
        lowStockThresholds: {},
      };
    }
    return JSON.parse(data) as InventorySafetySettings;
  } catch (error) {
    console.error('Error reading safety settings from localStorage:', error);
    return {
      id: 'global',
      lowStockThresholds: {},
    };
  }
}

export function saveSafetySettings(settings: InventorySafetySettings): void {
  try {
    const settingsToSave = {
      ...settings,
      id: 'global',
    };
    localStorage.setItem(STORAGE_KEYS.SAFETY_SETTINGS, JSON.stringify(settingsToSave));
  } catch (error) {
    console.error('Error saving safety settings to localStorage:', error);
  }
}

export function getThreshold(variety: string, warehouse: string): number | undefined {
  const settings = getSafetySettings();
  
  if (settings.lowStockThresholds[variety]?.[warehouse] !== undefined) {
    return settings.lowStockThresholds[variety][warehouse];
  }
  
  if (settings.defaultThresholdPerVariety !== undefined) {
    return settings.defaultThresholdPerVariety;
  }
  
  if (settings.defaultThresholdPerWarehouse !== undefined) {
    return settings.defaultThresholdPerWarehouse;
  }
  
  return undefined;
}

export function isLowStock(batch: GreenCoffeeBatch): boolean {
  const threshold = getThreshold(batch.variety, batch.warehouse);
  if (threshold === undefined) return false;
  return batch.quantityBags <= threshold;
}

export function setThreshold(variety: string, warehouse: string, threshold: number): void {
  const settings = getSafetySettings();
  
  if (!settings.lowStockThresholds[variety]) {
    settings.lowStockThresholds[variety] = {};
  }
  
  settings.lowStockThresholds[variety][warehouse] = threshold;
  saveSafetySettings(settings);
}

export function removeThreshold(variety: string, warehouse: string): void {
  const settings = getSafetySettings();
  
  if (settings.lowStockThresholds[variety]?.[warehouse] !== undefined) {
    delete settings.lowStockThresholds[variety][warehouse];
    
    if (Object.keys(settings.lowStockThresholds[variety]).length === 0) {
      delete settings.lowStockThresholds[variety];
    }
    
    saveSafetySettings(settings);
  }
}