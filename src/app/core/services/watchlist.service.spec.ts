import { TestBed } from '@angular/core/testing';
import { WatchlistService } from './watchlist.service';

describe('WatchlistService', () => {
  let service: WatchlistService;
  let store: Record<string, string>;

  const KEY = 'movie_discovery_watchlist_v1';
  const movie = { id: 1, title: 'Inception' };

  beforeEach(() => {
    store = {};
    spyOn(localStorage, 'getItem').and.callFake((key: string) => store[key] || null);
    spyOn(localStorage, 'setItem').and.callFake((key: string, value: string) => {
      store[key] = value;
    });

    TestBed.configureTestingModule({});
    service = TestBed.inject(WatchlistService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should load empty list initially', () => {
    expect(service.all()).toEqual([]);
  });

  it('should add a movie to the watchlist', () => {
    service.toggle(movie);
    expect(service.all().length).toBe(1);
    expect(service.isSaved(movie.id)).toBeTrue();
    expect(JSON.parse(store[KEY])).toEqual([movie]);
  });

  it('should remove a movie when toggled twice', () => {
    service.toggle(movie);
    service.toggle(movie);
    expect(service.all()).toEqual([]);
    expect(service.isSaved(movie.id)).toBeFalse();
  });

  it('should prepend new movies to the list', () => {
    const movie2 = { id: 2, title: 'Interstellar' };
    service.toggle(movie);
    service.toggle(movie2);
    const all = service.all();
    expect(all[0]).toEqual(movie2);
    expect(all[1]).toEqual(movie);
  });

  it('items$ should emit updates when list changes', (done) => {
    service.items$.subscribe(items => {
      if (items.length > 0) {
        expect(items[0]).toEqual(movie);
        done();
      }
    });
    service.toggle(movie);
  });
});
