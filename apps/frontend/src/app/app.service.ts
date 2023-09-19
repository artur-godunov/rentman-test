import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

import { AppApiService, ResponseData } from './app-api.service';

export interface Node {
  id: number;
  name: string;
  parentId: number | null;
  date: string;
  isExpanded: boolean;
  children: Node[];
}

export interface Nodes {
  [key: string]: Node;
}

export const EXPANDED_DATE = '2023-05-01';

@Injectable({
  providedIn: 'root',
})
export class AppService {
  private readonly appApiService = inject(AppApiService);

  getNodes(): Observable<Nodes> {
    return this.appApiService.getData().pipe(
      map((response: ResponseData) => response.data
        .reduce((accumulator, [id, name, parentId, date]) => ({
          ...accumulator,
          [id]: {
            id,
            name,
            parentId,
            date,
            isExpanded: this.isExpanded(date),
            children: [],
          },
        }), {})
      ),
    );
  }

  private isExpanded(date: string): boolean {
    return new Date(EXPANDED_DATE).getTime() - new Date(date).getTime() > 0;
  }
}
