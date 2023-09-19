import { InjectionToken } from '@angular/core';

export interface Environment {
  readonly production: boolean;
  readonly apiUrl: string;
}

export const ENVIRONMENT = new InjectionToken<Environment>('ENVIRONMENT');
