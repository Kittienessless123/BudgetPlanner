export interface UserDto {
  id?: string;
  email: string;
  passwordHash: string;
  name: string;
  defaultCurrency?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface LoginDto {
  email: string;
  password: string; 
}

export interface RegisterDto {
  email: string;
  name: string;
  password: string;
  passwordConfirm: string; 
}

export interface AuthResponseDto {
  user: UserDto;
  token: string;
  refreshToken?: string;
}

export interface TransactionDto {
  id?: string;
  userId: string;
  walletId: string;
  amount: number;
  description: string | null;
  operationDate: Date;
  moneyFlowTypeId: string;
  statusId: string;
  purchaseCatId: string | null;
  userCatId: string | null;
  relatedTxId: string | null;
  createdAt?: Date;
}

export interface CategoryDto {
  id?: string;
  name: string;
  parentId: string | null;
  isActive?: boolean;
  type: 'system' | 'user';
  parentType?: 'system' | 'user';
}

export interface DebtDto {
  id?: string;
  userId: string;
  personName: string;
  direction: 'borrowed' | 'lent';
  currentBalance: number;
  initialTxId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface CreditAgreementDto {
  id?: string;
  userId: string;
  bankId: string;
  contractNumber: string;
  principalAmount: number;
  currentPrincipal: number;
  status: 'active' | 'closed' | 'defaulted';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface WalletDto {
  id?: string;
  userId: string;
  name: string;
  currency: string;
  currentBalance: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface SettingsDto {
  id?: string;
  userId: string;
  key: string;
  value: any;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ReportDto {
  id?: string;
  userId: string;
  type: string;
  parameters: any;
  filePath: string | null;
  generatedAt?: Date;
}

export interface ScheduleDto {
  id?: string;
  userId: string;
  name: string;
  cronExpression: string;
  action: string;
  parameters: any;
  isActive: boolean;
  lastRunAt?: Date | null;
  nextRunAt?: Date | null;
  createdAt?: Date;
}

export interface StatisticDto {
  id?: string;
  userId: string;
  period: 'day' | 'week' | 'month' | 'year';
  startDate: Date;
  endDate: Date;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoryBreakdown: any;
  generatedAt?: Date;
}

export interface BankDto {
  id?: string;
  name: string;
  code: string | null;
  country: string | null;
}

export interface Data {
  value: string;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  message: string;
}

export type ServiceResult<T> = {
  data: T;
  result: 'success' | 'error' | 'partial';
  errors: string[];
  warnings?: string[];
  statusCode?: number;
};

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ValidationError {
  field: string;
  message: string;
  value?: any;
}

export interface ValidationErrorResponse {
  status: 'error';
  errors: ValidationError[];
  message: string;
}

export interface PutResponse {
  data: UserDto;
  result: 'success';
  errors: [];
}

export type SuccessResponse<T> = {
  data: T;
  result: 'success';
  errors: [];
};

export type ErrorResponse = {
  data: null;
  result: 'error';
  errors: string[];
};

export type ApiServiceResponse<T> = SuccessResponse<T> | ErrorResponse;

