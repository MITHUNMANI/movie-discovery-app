import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TmdbService } from './tmdb.service';
import { environment } from 'src/environment/environment';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;
  const baseUrl = environment.tmdbBaseUrl;
  const apiKey = environment.tmdbApiKey;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TmdbService]
    });

    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should search movies', () => {
    const mockResponse = { results: [{ id: 1, title: 'Inception' }] };

    service.searchMovies('Inception').subscribe((res) => {
      expect(res.results.length).toBe(1);
      expect(res.results[0].title).toBe('Inception');
    });

    const req = httpMock.expectOne(
      `${baseUrl}/search/movie?api_key=${apiKey}&language=en-US&query=Inception&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should search person', () => {
    const mockResponse = { results: [{ id: 101, name: 'Leonardo DiCaprio' }] };

    service.searchPerson('Leonardo').subscribe((res) => {
      expect(res.results[0].name).toBe('Leonardo DiCaprio');
    });

    const req = httpMock.expectOne(
      `${baseUrl}/search/person?api_key=${apiKey}&language=en-US&query=Leonardo&page=1`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should get movie details', () => {
    const mockMovie = { id: 1, title: 'Inception' };

    service.getMovie(1).subscribe((res) => {
      expect(res.title).toBe('Inception');
    });

    const req = httpMock.expectOne(
      `${baseUrl}/movie/1?api_key=${apiKey}&language=en-US`
    );
    expect(req.request.method).toBe('GET');
    req.flush(mockMovie);
  });

  it('should handle error response', () => {
    const errorMessage = 'Invalid API key';

    service.searchMovies('Test').subscribe({
      next: () => fail('Expected error'),
      error: (err) => {
        expect(err.message).toContain(errorMessage);
      }
    });

    const req = httpMock.expectOne(
      `${baseUrl}/search/movie?api_key=${apiKey}&language=en-US&query=Test&page=1`
    );
    req.flush({ status_message: errorMessage }, { status: 401, statusText: 'Unauthorized' });
  });
});
