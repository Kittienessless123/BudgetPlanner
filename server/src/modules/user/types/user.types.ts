import type { CurrencyCodeType } from "../../../shared/types/currency_types.ts";

export type User = { 
  id: number; 
  email: string;
  name: string;
  password : string;
  default_currency : CurrencyCodeType
}

