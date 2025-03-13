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