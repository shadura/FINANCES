export const CURRENCIES = [
  { value: 'USD', label: 'USD', symbol: '$' },
  { value: 'EUR', label: 'EUR', symbol: '€' },
  { value: 'UAH', label: 'UAH', symbol: '₴' },
  { value: 'PLN', label: 'PLN', symbol: 'zł' },
] as const;

export type Currency = typeof CURRENCIES[number]['value'];
