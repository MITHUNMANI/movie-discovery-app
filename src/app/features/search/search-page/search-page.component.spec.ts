import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { SearchPageComponent } from './search-page.component';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { ElementRef } from '@angular/core';
import { of, throwError } from 'rxjs';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { SearchService } from 'src/app/core/services/search.service';


describe('SearchPageComponent', () => {
  let component: SearchPageComponent;
  let fixture: ComponentFixture<SearchPageComponent>;
  let tmdbSpy: jasmine.SpyObj<TmdbService>;
  let searchService: SearchService;
  let elementRefMock: ElementRef;

  beforeEach(async () => {
     const host = document.createElement('div');
     elementRefMock = { nativeElement: host };
     host.appendChild(document.createElement('div'));
    tmdbSpy = jasmine.createSpyObj('TmdbService', ['searchMovies', 'searchPerson']);
    elementRefMock = { nativeElement: document.createElement('div') };

    await TestBed.configureTestingModule({
      declarations: [SearchPageComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: TmdbService, useValue: tmdbSpy },
        { provide: ElementRef, useValue: elementRefMock },
        SearchService
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchPageComponent);
    component = fixture.componentInstance;
    searchService = TestBed.inject(SearchService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.searchControl instanceof FormControl).toBeTrue();
  });

  describe('Reactive search flow', () => {
    it('should search movies when typing query', fakeAsync(() => {
      tmdbSpy.searchMovies.and.returnValue(of({ results: [{ id: 1, title: 'Test Movie' }] }));

      component.searchControl.setValue('Avengers');
      tick(300); 

      expect(tmdbSpy.searchMovies).toHaveBeenCalledWith('Avengers');
      expect(component.suggestions.length).toBe(1);
      expect(component.loading).toBeFalse();
    }));

    it('should search actors when searchType=actor', fakeAsync(() => {
      component.searchType = 'actor';
      tmdbSpy.searchPerson.and.returnValue(of({ results: [{ id: 2, name: 'Actor' }] }));

      component.searchControl.setValue('Robert');
      tick(300);

      expect(tmdbSpy.searchPerson).toHaveBeenCalledWith('Robert');
      expect(component.suggestions.length).toBe(1);
      expect(component.loading).toBeFalse();
    }));

    it('should handle API error', fakeAsync(() => {
      tmdbSpy.searchMovies.and.returnValue(throwError(() => new Error('API failed')));

      component.searchControl.setValue('BadQuery');
      tick(300);

      expect(component.suggestions.length).toBe(0);
      expect(component.loading).toBeFalse();
    }));
  });

  describe('onTypeChange', () => {
    it('should change type and clear search', () => {
      spyOn(component, 'clearSearch');
      component.onTypeChange({ target: { value: 'actor' } });
      expect(component.searchType).toBe('actor');
      expect(component.clearSearch).toHaveBeenCalled();
    });
  });

  describe('selectItem', () => {
    it('should update searchService with selected movie', () => {
      spyOn(searchService, 'update');
      const movie = { id: 1, title: 'Inception' };

      component.searchType = 'movie';
      component.selectItem(movie);

      expect(component.showDropdown).toBeFalse();
      expect(searchService.update).toHaveBeenCalledWith({
        results: [movie],
        type: 'movie',
        query: 'Inception',
        loading: false
      });
    });

    it('should update searchService with selected actor', () => {
      spyOn(searchService, 'update');
      const actor = { id: 2, name: 'Leonardo' };

      component.searchType = 'actor';
      component.selectItem(actor);

      expect(searchService.update).toHaveBeenCalledWith({
        results: [actor],
        type: 'actor',
        query: 'Leonardo',
        loading: false
      });
    });
  });

  describe('clearSearch', () => {
    it('should reset state and call searchService.reset()', () => {
      spyOn(searchService, 'reset');
      component.suggestions = [{ id: 1 }];
      component.searchControl.setValue('query');

      component.clearSearch();

      expect(component.searchControl.value).toBe('');
      expect(component.showDropdown).toBeFalse();
      expect(component.suggestions.length).toBe(0);
      expect(searchService.reset).toHaveBeenCalled();
    });
  });

  describe('onClickOutside', () => {
    it('should close dropdown when click is outside', () => {
      component.showDropdown = true;
      const outsideElement = document.createElement('div');

      component.onClickOutside(outsideElement);

      expect(component.showDropdown).toBeFalse();
    });
  });
});
