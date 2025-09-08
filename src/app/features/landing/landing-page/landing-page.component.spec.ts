import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LandingPageComponent } from './landing-page.component';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { SearchService } from 'src/app/core/services/search.service';

describe('LandingPageComponent', () => {
  let component: LandingPageComponent;
  let fixture: ComponentFixture<LandingPageComponent>;
  let tmdbServiceSpy: jasmine.SpyObj<TmdbService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let searchService: SearchService;

  beforeEach(async () => {
    tmdbServiceSpy = jasmine.createSpyObj('TmdbService', ['discover']);
    routerSpy = jasmine.createSpyObj('Router', ['navigate']);

    await TestBed.configureTestingModule({
      declarations: [LandingPageComponent],
      providers: [
        { provide: TmdbService, useValue: tmdbServiceSpy },
        { provide: Router, useValue: routerSpy },
        SearchService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LandingPageComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call fetchMovies with default params', () => {
      tmdbServiceSpy.discover.and.returnValue(of({ results: [{ id: 1, title: 'Test Movie' }] }));

      component.ngOnInit();

      expect(tmdbServiceSpy.discover).toHaveBeenCalledWith({ sort_by: 'popularity.desc' });
      expect(component.movies.length).toBe(1);
      expect(component.initialMovies.length).toBe(1);
      expect(component.loading).toBeFalse();
    });
  });

  describe('fetchMovies', () => {
    it('should set movies on success', () => {
      const mockResults = { results: [{ id: 1, title: 'Movie 1' }] };
      tmdbServiceSpy.discover.and.returnValue(of(mockResults));

      (component as any).fetchMovies({ sort_by: 'popularity.desc' });

      expect(component.movies).toEqual(mockResults.results);
      expect(component.initialMovies).toEqual(mockResults.results);
      expect(component.loading).toBeFalse();
    });

    it('should set error on failure', () => {
      tmdbServiceSpy.discover.and.returnValue(throwError(() => new Error('API failed')));

      (component as any).fetchMovies({ sort_by: 'popularity.desc' });

      expect(component.error).toBe('API failed');
      expect(component.loading).toBeFalse();
    });
  });

  describe('selectMood', () => {
    it('should fetch movies for mood', () => {
      const mockResults = { results: [{ id: 2, title: 'Mood Movie' }] };
      tmdbServiceSpy.discover.and.returnValue(of(mockResults));

      component.selectMood(component.moods[0]);

      expect(component.movies).toEqual(mockResults.results);
      expect(component.loading).toBeFalse();
    });

    it('should handle error when mood fetch fails', () => {
      tmdbServiceSpy.discover.and.returnValue(throwError(() => new Error('Mood API failed')));

      component.selectMood(component.moods[0]);

      expect(component.error).toBe('Mood API failed');
      expect(component.loading).toBeFalse();
    });
  });

  describe('openDetail', () => {
    it('should navigate to movie detail', () => {
      component.openDetail(42);
      expect(routerSpy.navigate).toHaveBeenCalledWith(['/movie', 42]);
    });
  });

  describe('getKnownForNames', () => {
    it('should return empty string if no known_for', () => {
      const actor = { known_for: [] };
      expect(component.getKnownForNames(actor)).toBe('');
    });

    it('should join titles and names', () => {
      const actor = { known_for: [{ title: 'Inception' }, { name: 'Breaking Bad' }] };
      expect(component.getKnownForNames(actor)).toBe('Inception, Breaking Bad');
    });
  });

  describe('openActor', () => {
    it('should log actor to console', () => {
      spyOn(console, 'log');
      const mockActor = { id: 99, name: 'Test Actor' };

      component.openActor(mockActor);

      expect(console.log).toHaveBeenCalledWith('Actor clicked:', mockActor);
    });
  });

  describe('searchService integration', () => {
    it('should update movies when search state changes to movie', () => {
      searchService.update({ type: 'movie', results: [{ id: 5, title: 'Search Movie' }], query: 'test' });
      expect(component.movies.length).toBe(1);
      expect(component.actors.length).toBe(0);
    });

    it('should update actors when search state changes to actor', () => {
      searchService.update({ type: 'actor', results: [{ id: 7, name: 'Actor' }], query: 'test' });
      expect(component.actors.length).toBe(1);
      expect(component.movies.length).toBe(0);
    });

    it('should reset movies when search query is empty', () => {
      component.initialMovies = [{ id: 10, title: 'Initial Movie' }];
      searchService.update({ query: '' });

      expect(component.movies.length).toBe(1);
      expect(component.actors.length).toBe(0);
    });
  });
});
