/**
 * Format the number to locale
 * @param number number to format
 * @returns string formatted number
 */
export function formatNumber(num: number): string{
  return num.toFixed(2).replace('.', ',');
}