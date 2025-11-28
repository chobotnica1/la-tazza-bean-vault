import type { RoastedCoffeeBatch, SalesEntry } from '../entities';

export function estimateUsageRate(
  variety: string,
  roastedBatches: RoastedCoffeeBatch[],
  salesEntries: SalesEntry[]
): number {
  const WEEKS_TO_ANALYZE = 12;
  const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

  const now = new Date();
  const cutoffDate = new Date(now.getTime() - WEEKS_TO_ANALYZE * MS_PER_WEEK);

  let roastedUsageRate = 0;
  try {
    const varietyRoasted = roastedBatches.filter(
      (batch) =>
        batch.variety.toLowerCase() === variety.toLowerCase() &&
        batch.roastDate &&
        new Date(batch.roastDate) >= cutoffDate
    );

    if (varietyRoasted.length > 0) {
      const totalBags = varietyRoasted.reduce((sum, batch) => {
        return sum + (batch.quantityBags || 0);
      }, 0);

      const dates = varietyRoasted
        .map((batch) => new Date(batch.roastDate).getTime())
        .filter((time) => !isNaN(time))
        .sort((a, b) => a - b);

      if (dates.length > 0) {
        const oldestDate = dates[0];
        const newestDate = dates[dates.length - 1];
        const timeSpanMs = newestDate - oldestDate;

        if (timeSpanMs > 0) {
          const weeksSpanned = Math.max(timeSpanMs / MS_PER_WEEK, 1);
          roastedUsageRate = totalBags / weeksSpanned;
        } else if (dates.length === 1) {
          roastedUsageRate = totalBags / WEEKS_TO_ANALYZE;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating roasted usage rate:', error);
    roastedUsageRate = 0;
  }

  let salesUsageRate = 0;
  try {
    const varietySales = salesEntries.filter(
      (entry) =>
        entry.mappedVariety &&
        entry.mappedVariety.toLowerCase() === variety.toLowerCase() &&
        entry.date &&
        new Date(entry.date) >= cutoffDate
    );

    if (varietySales.length > 0) {
      const totalQuantity = varietySales.reduce((sum, entry) => {
        return sum + (entry.quantity || 0);
      }, 0);

      const dates = varietySales
        .map((entry) => new Date(entry.date).getTime())
        .filter((time) => !isNaN(time))
        .sort((a, b) => a - b);

      if (dates.length > 0) {
        const oldestDate = dates[0];
        const newestDate = dates[dates.length - 1];
        const timeSpanMs = newestDate - oldestDate;

        if (timeSpanMs > 0) {
          const weeksSpanned = Math.max(timeSpanMs / MS_PER_WEEK, 1);
          salesUsageRate = totalQuantity / weeksSpanned;
        } else if (dates.length === 1) {
          salesUsageRate = totalQuantity / WEEKS_TO_ANALYZE;
        }
      }
    }
  } catch (error) {
    console.error('Error calculating sales usage rate:', error);
    salesUsageRate = 0;
  }

  const estimatedRate = Math.max(roastedUsageRate, salesUsageRate);
  return estimatedRate > 0 ? estimatedRate : 0;
}

export function estimateDepletionDate(
  currentBags: number,
  usageRatePerWeek: number,
  today: Date = new Date()
): Date | null {
  try {
    if (
      currentBags === undefined ||
      currentBags === null ||
      isNaN(currentBags) ||
      currentBags < 0
    ) {
      return null;
    }

    if (
      usageRatePerWeek === undefined ||
      usageRatePerWeek === null ||
      isNaN(usageRatePerWeek) ||
      usageRatePerWeek <= 0
    ) {
      return null;
    }

    if (currentBags <= 0) {
      return today;
    }

    const weeksLeft = currentBags / usageRatePerWeek;
    const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;
    const msUntilDepletion = weeksLeft * MS_PER_WEEK;
    const depletionDate = new Date(today.getTime() + msUntilDepletion);

    if (isNaN(depletionDate.getTime())) {
      return null;
    }

    return depletionDate;
  } catch (error) {
    console.error('Error calculating depletion date:', error);
    return null;
  }
}

export function formatDepletionEstimate(
  depletionDate: Date | null,
  currentDate: Date = new Date()
): string {
  if (!depletionDate) {
    return 'No depletion forecast';
  }

  const msUntilDepletion = depletionDate.getTime() - currentDate.getTime();
  const daysUntilDepletion = Math.floor(msUntilDepletion / (24 * 60 * 60 * 1000));

  if (daysUntilDepletion < 0) {
    return 'Already depleted';
  } else if (daysUntilDepletion === 0) {
    return 'Depleting today';
  } else if (daysUntilDepletion <= 7) {
    return `${daysUntilDepletion} days`;
  } else if (daysUntilDepletion <= 30) {
    const weeks = Math.floor(daysUntilDepletion / 7);
    return `~${weeks} week${weeks !== 1 ? 's' : ''}`;
  } else {
    const months = Math.floor(daysUntilDepletion / 30);
    return `~${months} month${months !== 1 ? 's' : ''}`;
  }
}

export function getDepletionUrgency(
  depletionDate: Date | null,
  currentDate: Date = new Date()
): 'critical' | 'warning' | 'normal' | 'none' {
  if (!depletionDate) {
    return 'none';
  }

  const msUntilDepletion = depletionDate.getTime() - currentDate.getTime();
  const daysUntilDepletion = msUntilDepletion / (24 * 60 * 60 * 1000);

  if (daysUntilDepletion <= 0) {
    return 'critical';
  } else if (daysUntilDepletion <= 14) {
    return 'critical';
  } else if (daysUntilDepletion <= 30) {
    return 'warning';
  } else {
    return 'normal';
  }
}

export function calculateReorderPoint(
  usageRatePerWeek: number,
  leadTimeWeeks: number = 4,
  safetyStockWeeks: number = 2
): number {
  try {
    if (usageRatePerWeek <= 0) {
      return 0;
    }

    const totalWeeks = leadTimeWeeks + safetyStockWeeks;
    const reorderPoint = usageRatePerWeek * totalWeeks;

    return Math.ceil(reorderPoint);
  } catch (error) {
    console.error('Error calculating reorder point:', error);
    return 0;
  }
}