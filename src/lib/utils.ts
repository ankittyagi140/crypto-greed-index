export function formatLargeNumber(value: number): string {
  const trillion = 1e12;
  const billion = 1e9;
  const million = 1e6;
  const thousand = 1e3;

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

  if (value >= trillion) {
    return formatter.format(value / trillion).replace('$', '$') + 'T';
  } else if (value >= billion) {
    return formatter.format(value / billion).replace('$', '$') + 'B';
  } else if (value >= million) {
    return formatter.format(value / million).replace('$', '$') + 'M';
  } else if (value >= thousand) {
    return formatter.format(value / thousand).replace('$', '$') + 'K';
  }

  return formatter.format(value);
}

export function formatNumber(num: number | null | undefined): string {
  if (num === null || num === undefined) return '0';
  
  if (num >= 1e12) {
    return (num / 1e12).toFixed(2) + 'T';
  }
  if (num >= 1e9) {
    return (num / 1e9).toFixed(2) + 'B';
  }
  if (num >= 1e6) {
    return (num / 1e6).toFixed(2) + 'M';
  }
  if (num >= 1e3) {
    return (num / 1e3).toFixed(2) + 'K';
  }
  return num.toFixed(2);
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
} 