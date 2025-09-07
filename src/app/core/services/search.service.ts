import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface SearchState {
  results: any[];
  type: 'movie' | 'actor';
  query?: string;
  loading: boolean;
  error?: string;
}

@Injectable({ providedIn: 'root' })
export class SearchService {
  private searchSubject = new BehaviorSubject<SearchState>({
    results: [],
    type: 'movie',
    query: '',
    loading: false,
    error: ''
  });

  search$ = this.searchSubject.asObservable();

  update(state: Partial<SearchState>) {
    const current = this.searchSubject.value;
    this.searchSubject.next({ ...current, ...state });
  }

  reset() {
    const current = this.searchSubject.value;
    this.searchSubject.next({
      ...current,
      results: [],
      type: 'movie',
      query: '',
      loading: false,
      error: ''
    });
  }
}
