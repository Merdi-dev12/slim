import { environment } from '@env/environment';

export const appConfigValues = {
  apiUrl: environment.apiUrl,
  production: environment.production,
} as const;
