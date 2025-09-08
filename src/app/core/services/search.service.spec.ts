import { TestBed } from '@angular/core/testing';
import { SearchService, SearchState } from './search.service';

describe('SearchService', () => {
  let service: SearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have default state', (done) => {
    service.search$.subscribe((state) => {
      expect(state.results).toEqual([]);
      expect(state.type).toBe('movie');
      expect(state.query).toBe('');
      expect(state.loading).toBeFalse();
      expect(state.error).toBe('');
      done();
    });
  });

  it('should update state', (done) => {
    const newState: Partial<SearchState> = {
      query: 'Inception',
      loading: true
    };

    service.update(newState);

    service.search$.subscribe((state) => {
      expect(state.query).toBe('Inception');
      expect(state.loading).toBeTrue();
      done();
    });
  });

  it('should reset state', (done) => {
    service.update({
      query: 'Leonardo',
      results: [{ id: 1, name: 'Leonardo DiCaprio' }],
      type: 'actor',
      loading: true,
      error: 'Some error'
    });

    service.reset();

    service.search$.subscribe((state) => {
      expect(state.results).toEqual([]);
      expect(state.type).toBe('movie');
      expect(state.query).toBe('');
      expect(state.loading).toBeFalse();
      expect(state.error).toBe('');
      done();
    });
  });
});
