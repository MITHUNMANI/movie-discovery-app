import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchlistPageComponent } from './watchlist-page.component';
import { Router } from '@angular/router';
import { of, BehaviorSubject } from 'rxjs';
import { WatchlistService } from 'src/app/core/services/watchlist.service';
import { SearchService, SearchState } from 'src/app/core/services/search.service';


describe('WatchlistPageComponent', () => {
  let component: WatchlistPageComponent;
  let fixture: ComponentFixture<WatchlistPageComponent>;
  let routerSpy: jasmine.SpyObj<Router>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;
  let searchService: SearchService;
  let searchSubject: BehaviorSubject<SearchState>;

  const mockMovie = { id: 1, title: 'Inception' };

  beforeEach(async () => {
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', ['all', 'toggle'], { items$: of([mockMovie]) });

    searchSubject = new BehaviorSubject<SearchState>({
      results: [],
      type: 'movie',
      query: '',
      loading: false,
      error: ''
    });

    await TestBed.configureTestingModule({
      declarations: [WatchlistPageComponent],
      providers: [
        { provide: Router, useValue: routerSpy },
        { provide: WatchlistService, useValue: watchlistServiceSpy },
        {
          provide: SearchService,
          useFactory: () => {
            const svc = new SearchService();
            (svc as any).searchSubject = searchSubject; 
            svc.search$ = searchSubject.asObservable();
            return svc;
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(WatchlistPageComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should load initial watchlist from service', () => {
      watchlistServiceSpy.all.and.returnValue([mockMovie]);
      component.ngOnInit();
      expect(component.watchlist).toEqual([mockMovie]);
      expect(component.initialWatchlist).toEqual([mockMovie]);
    });

    it('should update watchlist when items$ emits', () => {
      const updated = [{ id: 2, title: 'Matrix' }];
      (Object.getOwnPropertyDescriptor(watchlistServiceSpy, 'items$')!.get as jasmine.Spy).and.returnValue(of(updated));

      watchlistServiceSpy.all.and.returnValue([mockMovie]);
      component.ngOnInit();

      expect(component.watchlist).toEqual(updated);
      expect(component.initialWatchlist).toEqual(updated);
    });

    it('should update search state from searchService', () => {
      watchlistServiceSpy.all.and.returnValue([mockMovie]);
      component.ngOnInit();

      searchSubject.next({
        results: [{ id: 99, title: 'Avatar' }],
        type: 'movie',
        query: 'ava',
        loading: true,
        error: ''
      });

      expect(component.searchResults.length).toBe(1);
      expect(component.searchType).toBe('movie');
      expect(component.loading).toBeTrue();
    });

    it('should clear searchResults if empty results', () => {
      watchlistServiceSpy.all.and.returnValue([mockMovie]);
      component.ngOnInit();

      searchSubject.next({
        results: [],
        type: 'actor',
        query: 'test',
        loading: false,
        error: ''
      });

      expect(component.searchResults).toEqual([]);
      expect(component.searchType).toBeNull();
    });
  });

  describe('open', () => {
    it('should navigate to movie detail page', () => {
      component.open(1);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/movie', 1]);
    });
  });

  describe('removeFromWatchlist', () => {
    it('should call watchlistService.toggle', () => {
      component.removeFromWatchlist(mockMovie);
      expect(watchlistServiceSpy.toggle).toHaveBeenCalledWith(mockMovie);
    });
  });

  describe('getKnownForNames', () => {
    it('should return empty string if no known_for', () => {
      expect(component.getKnownForNames({})).toBe('');
    });

    it('should join titles and names from known_for', () => {
      const person = {
        known_for: [
          { title: 'Movie 1' },
          { name: 'Series 1' }
        ]
      };
      expect(component.getKnownForNames(person)).toBe('Movie 1, Series 1');
    });
  });
});
