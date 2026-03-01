// types/currency.types.ts

export type CurrencyCode = 
  | 'RUB' | 'USD' | 'EUR' | 'GBP' | 'CNY' | 'JPY'
  | 'KZT' | 'BYN' | 'UAH' | 'CHF' | 'CAD' | 'AUD'
  | 'AMD' | 'GEL' | 'AZN' | 'KGS' | 'MDL' | 'TJS'
  | 'TMT' | 'UZS' | 'PLN' | 'CZK' | 'SEK' | 'NOK'
  | 'DKK' | 'ISK' | 'HUF' | 'RON' | 'BGN' | 'TRY';

export interface Currency {
  code: CurrencyCode;
  symbol: string;
  name: string;
  decimalPlaces: number;
}