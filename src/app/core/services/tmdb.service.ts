import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environment/environment.local';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class TmdbService {
  private base = environment.tmdbBaseUrl;

  constructor(private http: HttpClient) {}

  private params(extra?: Record<string, string | number | boolean>): HttpParams {
    let p = new HttpParams().set('language', 'en-US');
    if (extra) {
      Object.entries(extra).forEach(([k, v]) => {
        p = p.set(k, String(v));
      });
    }
    return p;
  }

  searchMovies(query: string, page = 1): Observable<any> {
    return this.http.get(`${this.base}/search/movie`, { params: this.params({ query, page }) })
      .pipe(catchError(this.handleError));
  }

  searchPerson(query: string, page = 1): Observable<any> {
    return this.http.get(`${this.base}/search/person`, { params: this.params({ query, page }) })
      .pipe(catchError(this.handleError));
  }

  discover(params: Record<string, any>): Observable<any> {
    return this.http.get(`${this.base}/discover/movie`, { params: this.params(params) })
      .pipe(catchError(this.handleError));
  }

  getMovie(id: number): Observable<any> {
    return this.http.get(`${this.base}/movie/${id}`, { params: this.params() })
      .pipe(catchError(this.handleError));
  }

  getMovieVideos(id: number): Observable<any> {
    return this.http.get(`${this.base}/movie/${id}/videos`, { params: this.params() })
      .pipe(catchError(this.handleError));
  }

  getCredits(id: number): Observable<any> {
    return this.http.get(`${this.base}/movie/${id}/credits`, { params: this.params() })
      .pipe(catchError(this.handleError));
  }

  getSimilar(id: number): Observable<any> {
    return this.http.get(`${this.base}/movie/${id}/similar`, { params: this.params() })
      .pipe(catchError(this.handleError));
  }

  private handleError = (err: any) => {
    const message = err?.error?.status_message || err?.message || 'TMDB request failed';
    return throwError(() => new Error(message));
  };
}
