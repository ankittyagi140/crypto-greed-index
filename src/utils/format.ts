export function formatPrice(price: number): string {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: price < 1 ? 8 : 2
  });
  return formatter.format(price);
} 