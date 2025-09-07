import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const KEY = 'movie_discovery_watchlist_v1';

@Injectable({
  providedIn: 'root'
})
export class WatchlistService {
  private itemsSubject = new BehaviorSubject<any[]>(this.load());
  items$ = this.itemsSubject.asObservable();

  private load(): any[] {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private save(items: any[]) {
    localStorage.setItem(KEY, JSON.stringify(items));
    this.itemsSubject.next(items);
  }

  toggle(movie: any) {
    const items = this.load();
    const idx = items.findIndex(m => m.id === movie.id);
    if (idx >= 0) {
      items.splice(idx, 1);
    } else {
      items.unshift(movie);
    }
    this.save(items);
  }

  isSaved(id: number): boolean {
    return this.load().some(m => m.id === id);
  }

  all(): any[] {
    return this.load();
  }
}
