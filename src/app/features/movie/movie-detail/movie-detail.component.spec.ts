import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieDetailComponent } from './movie-detail.component';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { of, throwError } from 'rxjs';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { SearchService } from 'src/app/core/services/search.service';


describe('MovieDetailComponent', () => {
  let component: MovieDetailComponent;
  let fixture: ComponentFixture<MovieDetailComponent>;
  let tmdbSpy: jasmine.SpyObj<TmdbService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let sanitizer: DomSanitizer;
  let searchService: SearchService;

  beforeEach(async () => {
    tmdbSpy = jasmine.createSpyObj('TmdbService', ['getMovie', 'getMovieVideos', 'getCredits', 'getSimilar']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [MovieDetailComponent],
      providers: [
        { provide: TmdbService, useValue: tmdbSpy },
        { provide: Router, useValue: routerSpy },
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: new Map([['id', '123']]) } }
        },
        SearchService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieDetailComponent);
    component = fixture.componentInstance;
    sanitizer = TestBed.inject(DomSanitizer);
    searchService = TestBed.inject(SearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call load with route id', () => {
      spyOn<any>(component, 'load');
      component.ngOnInit();
      expect((component as any).load).toHaveBeenCalledWith(123);
    });

    it('should update search state from service (movies)', () => {
      component.ngOnInit();
      searchService.update({ query: 'test', type: 'movie', results: [{ id: 1, title: 'Search Movie' }], loading: true });

      expect(component.searchActive).toBeTrue();
      expect(component.searchType).toBe('movie');
      expect(component.searchMovies.length).toBe(1);
      expect(component.searchActors.length).toBe(0);
    });

    it('should update search state from service (actors)', () => {
      component.ngOnInit();
      searchService.update({ query: 'actor', type: 'actor', results: [{ id: 2, name: 'Actor' }] });

      expect(component.searchActors.length).toBe(1);
      expect(component.searchMovies.length).toBe(0);
    });

    it('should reset search when query is empty', () => {
      component.ngOnInit();
      searchService.update({ query: '' });

      expect(component.searchActive).toBeFalse();
      expect(component.searchMovies.length).toBe(0);
      expect(component.searchActors.length).toBe(0);
    });
  });

  describe('load', () => {
    it('should fetch movie and set movie property', () => {
      tmdbSpy.getMovie.and.returnValue(of({ id: 123, title: 'Test Movie' }));
      tmdbSpy.getMovieVideos.and.returnValue(of({ results: [] }));
      tmdbSpy.getCredits.and.returnValue(of({ cast: [{ id: 1, name: 'Actor' }] }));
      tmdbSpy.getSimilar.and.returnValue(of({ results: [{ id: 10, title: 'Similar' }] }));

      (component as any).load(123);

      expect(component.movie).toEqual({ id: 123, title: 'Test Movie' });
      expect(component.cast.length).toBe(1);
      expect(component.similar.length).toBe(1);
      expect(component.loading).toBeFalse();
    });

    it('should handle movie API error', () => {
      tmdbSpy.getMovie.and.returnValue(throwError(() => new Error('Movie API failed')));
      tmdbSpy.getMovieVideos.and.returnValue(of({ results: [] }));
      tmdbSpy.getCredits.and.returnValue(of({ cast: [] }));
      tmdbSpy.getSimilar.and.returnValue(of({ results: [] }));

      (component as any).load(123);

      expect(component.error).toBe('Movie API failed');
      expect(component.loading).toBeFalse();
    });

    it('should set trailerUrl when YouTube trailer exists', () => {
      tmdbSpy.getMovie.and.returnValue(of({}));
      tmdbSpy.getMovieVideos.and.returnValue(of({ results: [{ site: 'YouTube', type: 'Trailer', key: 'abc123' }] }));
      tmdbSpy.getCredits.and.returnValue(of({ cast: [] }));
      tmdbSpy.getSimilar.and.returnValue(of({ results: [] }));

      spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();

      (component as any).load(123);

      expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith('https://www.youtube.com/embed/abc123');
      expect(component.trailerUrl).toBeTruthy();
    });
  });

  describe('openDetail', () => {
    it('should navigate and reload movie', async () => {
      spyOn<any>(component, 'load');
      routerSpy.navigate.and.returnValue(Promise.resolve(true));

      component.openDetail(456);

      expect(routerSpy.navigate).toHaveBeenCalledWith(['/movie', 456]);

      await Promise.resolve();
      expect((component as any).load).toHaveBeenCalledWith(456);
    });
  });

  describe('getKnownForNames', () => {
    it('should return empty string if no known_for', () => {
      const person = { known_for: [] };
      expect(component.getKnownForNames(person)).toBe('');
    });

    it('should join titles and names', () => {
      const person = { known_for: [{ title: 'Inception' }, { name: 'Breaking Bad' }] };
      expect(component.getKnownForNames(person)).toBe('Inception, Breaking Bad');
    });
  });
});
