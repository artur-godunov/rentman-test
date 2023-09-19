import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Environment, ENVIRONMENT } from '@rentman-test/core/environments';

interface ResponseColumn {
  id: 'id' | 'name' | 'parent' | 'created';
  type: 'int' | 'string' | 'date';
  nullable: boolean;
}

export type ResponseDataItem = [number, string, number | null, string];

export interface ResponseData {
  columns: ResponseColumn[];
  data: ResponseDataItem[];
}

@Injectable({
  providedIn: 'root',
})
export class AppApiService {
  private readonly httpClient = inject(HttpClient);
  private readonly environment: Environment = inject(ENVIRONMENT);

  getData(): Observable<ResponseData> {
    return this.httpClient.get<ResponseData>(`${this.environment.apiUrl}`);
  }
}
