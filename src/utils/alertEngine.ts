// @ts-nocheck
import type { GreenCoffeeBatch, InventorySafetySettings } from '../entities';

export interface LowStockAlert {
  variety: string;
  warehouse: string;
  currentBags: number;
  threshold: number;
}

export function getLowStockAlerts(
  greenBatches: GreenCoffeeBatch[],
  safetySettings: InventorySafetySettings
): LowStockAlert[] {
  const alerts: LowStockAlert[] = [];

  const aggregateMap = new Map<string, { variety: string; warehouse: string; totalBags: number }>();

  greenBatches.forEach((batch) => {
    const key = `${batch.variety}::${batch.warehouse}`;
    if (aggregateMap.has(key)) {
      const agg = aggregateMap.get(key)!;
      agg.totalBags += batch.quantityBags;
    } else {
      aggregateMap.set(key, {
        variety: batch.variety,
        warehouse: batch.warehouse,
        totalBags: batch.quantityBags,
      });
    }
  });

  aggregateMap.forEach((agg) => {
    let threshold = 0;

    if (safetySettings.lowStockThresholds[agg.variety]?.[agg.warehouse] !== undefined) {
      threshold = safetySettings.lowStockThresholds[agg.variety][agg.warehouse];
    } else if (safetySettings.defaultThresholdPerVariety !== undefined) {
      threshold = safetySettings.defaultThresholdPerVariety;
    } else if (safetySettings.defaultThresholdPerWarehouse !== undefined) {
      threshold = safetySettings.defaultThresholdPerWarehouse;
    }

    if (threshold > 0 && agg.totalBags <= threshold) {
      alerts.push({
        variety: agg.variety,
        warehouse: agg.warehouse,
        currentBags: agg.totalBags,
        threshold,
      });
    }
  });

  alerts.sort((a, b) => {
    const aRatio = a.currentBags / a.threshold;
    const bRatio = b.currentBags / b.threshold;
    return aRatio - bRatio;
  });

  return alerts;
}

export function getAlertUrgency(alert: LowStockAlert): 'critical' | 'warning' {
  const ratio = alert.currentBags / alert.threshold;
  if (ratio <= 0.5) {
    return 'critical';
  }
  return 'warning';
}