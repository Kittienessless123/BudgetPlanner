type NetworkErrorCode = 
  | 400 | 401 | 403 | 404 | 408 | 409 | 422 | 429 
  | 500 | 502 | 503 | 504

  | 'NETWORK_OFFLINE'
  | 'DNS_LOOKUP_FAILED'
  | 'CONNECTION_REFUSED'
  | 'SSL_CERTIFICATE_ERROR'
  | 'REQUEST_CANCELLED'
  | 'NO_INTERNET_CONNECTION';

export const networkErrorMessage: Record<NetworkErrorCode, string> = {
  400: 'Invalid request format',
  401: 'Authentication required. Please login',
  403: 'Access forbidden',
  404: 'Resource not found',
  408: 'Request timeout',
  409: 'Data conflict',
  422: 'Validation failed',
  429: 'Rate limit exceeded. Try again later',
  500: 'Server error',
  502: 'Bad gateway',
  503: 'Service unavailable',
  504: 'Gateway timeout',
  
  'NETWORK_OFFLINE': 'No network connection',
  'DNS_LOOKUP_FAILED': 'Cannot resolve hostname',
  'CONNECTION_REFUSED': 'Server refused connection',
  'SSL_CERTIFICATE_ERROR': 'SSL certificate verification failed',
  'REQUEST_CANCELLED': 'Request was cancelled',
  'NO_INTERNET_CONNECTION': 'Please check your internet connection'
};

export type NetworkError = {
  code: NetworkErrorCode;
  message: string;
  originalError?: Error;
  url?: string;
  statusText?: string;
};