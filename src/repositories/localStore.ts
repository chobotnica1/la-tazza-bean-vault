import { supabase } from '../supabaseClient';
import type {
  GreenCoffeeBatch,
  RoastedCoffeeBatch,
  Customer,
  CuppingRecord,
  InventorySafetyThreshold,
} from '../entities';

// ============================================================================
// GREEN COFFEE BATCHES
// ============================================================================

export async function getAllGreenBatches(): Promise<GreenCoffeeBatch[]> {
  const { data, error } = await supabase
    .from('green_batches')
    .select('*')
    .order('received_date', { ascending: false });

  if (error) {
    console.error('Error fetching green batches:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    variety: row.variety,
    origin: row.origin,
    farm: row.farm,
    importer: row.importer,
    warehouse: row.warehouse,
    quantityBags: row.quantity_bags,
    bagSize: row.bag_size,
    rating: row.rating,
    pricePerBag: row.price_per_bag,
    receivedDate: row.received_date,
    notes: row.notes,
  }));
}

export async function addGreenBatch(batch: GreenCoffeeBatch): Promise<void> {
  const { error } = await supabase.from('green_batches').insert({
    id: batch.id,
    variety: batch.variety,
    origin: batch.origin,
    farm: batch.farm,
    importer: batch.importer,
    warehouse: batch.warehouse,
    quantity_bags: batch.quantityBags,
    bag_size: batch.bagSize,
    rating: batch.rating,
    price_per_bag: batch.pricePerBag,
    received_date: batch.receivedDate,
    notes: batch.notes,
  });

  if (error) {
    console.error('Error adding green batch:', error);
    throw error;
  }
}

export async function updateGreenBatch(batch: GreenCoffeeBatch): Promise<void> {
  const { error } = await supabase
    .from('green_batches')
    .update({
      variety: batch.variety,
      origin: batch.origin,
      farm: batch.farm,
      importer: batch.importer,
      warehouse: batch.warehouse,
      quantity_bags: batch.quantityBags,
      bag_size: batch.bagSize,
      rating: batch.rating,
      price_per_bag: batch.pricePerBag,
      received_date: batch.receivedDate,
      notes: batch.notes,
    })
    .eq('id', batch.id);

  if (error) {
    console.error('Error updating green batch:', error);
    throw error;
  }
}

export async function deleteGreenBatch(id: string): Promise<void> {
  const { error } = await supabase.from('green_batches').delete().eq('id', id);

  if (error) {
    console.error('Error deleting green batch:', error);
    throw error;
  }
}

// ============================================================================
// ROASTED COFFEE BATCHES
// ============================================================================

export async function getAllRoastedBatches(): Promise<RoastedCoffeeBatch[]> {
  const { data, error } = await supabase
    .from('roasted_batches')
    .select('*')
    .order('roast_date', { ascending: false });

  if (error) {
    console.error('Error fetching roasted batches:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    variety: row.variety,
    origin: row.origin,
    rating: row.rating,
    roastLevel: row.roast_level,
    formatType: row.format_type,
    formatSizeValue: row.format_size_value,
    formatSizeUnit: row.format_size_unit,
    quantityBags: row.quantity_bags,
    warehouse: row.warehouse,
    roastDate: row.roast_date,
    notes: row.notes,
    linkedGreenBatchId: row.linked_green_batch_id,
  }));
}

export async function addRoastedBatch(batch: RoastedCoffeeBatch): Promise<void> {
  const { error } = await supabase.from('roasted_batches').insert({
    id: batch.id,
    variety: batch.variety,
    origin: batch.origin,
    rating: batch.rating,
    roast_level: batch.roastLevel,
    format_type: batch.formatType,
    format_size_value: batch.formatSizeValue,
    format_size_unit: batch.formatSizeUnit,
    quantity_bags: batch.quantityBags,
    warehouse: batch.warehouse,
    roast_date: batch.roastDate,
    notes: batch.notes,
    linked_green_batch_id: batch.linkedGreenBatchId,
  });

  if (error) {
    console.error('Error adding roasted batch:', error);
    throw error;
  }
}

export async function updateRoastedBatch(batch: RoastedCoffeeBatch): Promise<void> {
  const { error } = await supabase
    .from('roasted_batches')
    .update({
      variety: batch.variety,
      origin: batch.origin,
      rating: batch.rating,
      roast_level: batch.roastLevel,
      format_type: batch.formatType,
      format_size_value: batch.formatSizeValue,
      format_size_unit: batch.formatSizeUnit,
      quantity_bags: batch.quantityBags,
      warehouse: batch.warehouse,
      roast_date: batch.roastDate,
      notes: batch.notes,
      linked_green_batch_id: batch.linkedGreenBatchId,
    })
    .eq('id', batch.id);

  if (error) {
    console.error('Error updating roasted batch:', error);
    throw error;
  }
}

export async function deleteRoastedBatch(id: string): Promise<void> {
  const { error } = await supabase.from('roasted_batches').delete().eq('id', id);

  if (error) {
    console.error('Error deleting roasted batch:', error);
    throw error;
  }
}

// ============================================================================
// CUSTOMERS
// ============================================================================

export async function getAllCustomers(): Promise<Customer[]> {
  const { data, error } = await supabase
    .from('customers')
    .select('*')
    .order('name', { ascending: true });

  if (error) {
    console.error('Error fetching customers:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    name: row.name,
    contactPerson: row.contact_person,
    email: row.email,
    phone: row.phone,
    address: row.address,
    city: row.city,
    state: row.state,
    zip: row.zip,
    country: row.country,
    taxId: row.tax_id,
    notes: row.notes,
  }));
}

export async function addCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase.from('customers').insert({
    id: customer.id,
    name: customer.name,
    contact_person: customer.contactPerson,
    email: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    state: customer.state,
    zip: customer.zip,
    country: customer.country,
    tax_id: customer.taxId,
    notes: customer.notes,
  });

  if (error) {
    console.error('Error adding customer:', error);
    throw error;
  }
}

export async function updateCustomer(customer: Customer): Promise<void> {
  const { error } = await supabase
    .from('customers')
    .update({
      name: customer.name,
      contact_person: customer.contactPerson,
      email: customer.email,
      phone: customer.phone,
      address: customer.address,
      city: customer.city,
      state: customer.state,
      zip: customer.zip,
      country: customer.country,
      tax_id: customer.taxId,
      notes: customer.notes,
    })
    .eq('id', customer.id);

  if (error) {
    console.error('Error updating customer:', error);
    throw error;
  }
}

export async function deleteCustomer(id: string): Promise<void> {
  const { error } = await supabase.from('customers').delete().eq('id', id);

  if (error) {
    console.error('Error deleting customer:', error);
    throw error;
  }
}

// ============================================================================
// CUPPING RECORDS
// ============================================================================

export async function getAllCuppingRecords(): Promise<CuppingRecord[]> {
  const { data, error } = await supabase
    .from('cupping_records')
    .select('*')
    .order('date', { ascending: false });

  if (error) {
    console.error('Error fetching cupping records:', error);
    return [];
  }

  return data.map((row) => ({
    id: row.id,
    date: row.date,
    variety: row.variety,
    origin: row.origin,
    farm: row.farm,
    greenBatchId: row.green_batch_id,
    score: row.score,
    sweetness: row.sweetness,
    acidity: row.acidity,
    body: row.body,
    finish: row.finish,
    uniformity: row.uniformity,
    balance: row.balance,
    cleanliness: row.cleanliness,
    descriptors: row.descriptors,
    notes: row.notes,
  }));
}

export async function addCuppingRecord(record: CuppingRecord): Promise<void> {
  const { error } = await supabase.from('cupping_records').insert({
    id: record.id,
    date: record.date,
    variety: record.variety,
    origin: record.origin,
    farm: record.farm,
    green_batch_id: record.greenBatchId,
    score: record.score,
    sweetness: record.sweetness,
    acidity: record.acidity,
    body: record.body,
    finish: record.finish,
    uniformity: record.uniformity,
    balance: record.balance,
    cleanliness: record.cleanliness,
    descriptors: record.descriptors,
    notes: record.notes,
  });

  if (error) {
    console.error('Error adding cupping record:', error);
    throw error;
  }
}

export async function updateCuppingRecord(record: CuppingRecord): Promise<void> {
  const { error } = await supabase
    .from('cupping_records')
    .update({
      date: record.date,
      variety: record.variety,
      origin: record.origin,
      farm: record.farm,
      green_batch_id: record.greenBatchId,
      score: record.score,
      sweetness: record.sweetness,
      acidity: record.acidity,
      body: record.body,
      finish: record.finish,
      uniformity: record.uniformity,
      balance: record.balance,
      cleanliness: record.cleanliness,
      descriptors: record.descriptors,
      notes: record.notes,
    })
    .eq('id', record.id);

  if (error) {
    console.error('Error updating cupping record:', error);
    throw error;
  }
}

export async function deleteCuppingRecord(id: string): Promise<void> {
  const { error } = await supabase.from('cupping_records').delete().eq('id', id);

  if (error) {
    console.error('Error deleting cupping record:', error);
    throw error;
  }
}

// ============================================================================
// SETTINGS
// ============================================================================

export async function getAllThresholds(): Promise<InventorySafetyThreshold[]> {
  const { data, error } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'thresholds')
    .single();

  if (error || !data) {
    return [];
  }

  return data.value as InventorySafetyThreshold[];
}

export async function saveAllThresholds(thresholds: InventorySafetyThreshold[]): Promise<void> {
  const { data: existing } = await supabase
    .from('settings')
    .select('*')
    .eq('key', 'thresholds')
    .single();

  if (existing) {
    const { error } = await supabase
      .from('settings')
      .update({ value: thresholds, updated_at: new Date().toISOString() })
      .eq('key', 'thresholds');

    if (error) {
      console.error('Error updating thresholds:', error);
      throw error;
    }
  } else {
    const { error } = await supabase.from('settings').insert({
      key: 'thresholds',
      value: thresholds,
    });

    if (error) {
      console.error('Error creating thresholds:', error);
      throw error;
    }
  }
}

// ============================================================================
// SALES ENTRIES (Stub for reports)
// ============================================================================

export function getAllSalesEntries(): any[] {
  // This is a placeholder - in a real system, this would come from Clover or another POS
  // For now, return empty array
  return [];
}