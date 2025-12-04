export function estimateUsageRate(
  variety: string,
  type: 'green' | 'roasted' = 'green'
): number {
  // Since we don't have historical sales data yet, return a simple estimate
  // based on typical coffee shop usage patterns
  
  // In a real implementation, this would:
  // 1. Look up historical roasting records for green coffee
  // 2. Look up historical sales data for roasted coffee
  // 3. Calculate actual usage rates
  
  // For now, return conservative estimates:
  // - Green coffee: ~0.5 bags/week (roasted into customer orders)
  // - Roasted coffee: ~2 bags/week (sold to customers)
  
  if (type === 'roasted') {
    return 2.0; // 2 bags per week
  } else {
    return 0.5; // 0.5 bags per week (slower turnover for green)
  }
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