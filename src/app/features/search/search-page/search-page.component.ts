import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';

@Component({
  selector: 'app-search-page',
  templateUrl: './search-page.component.html'
})
export class SearchPageComponent implements OnInit {
  searchControl = new FormControl('');
  movieResults: any[] = [];
  personResults: any[] = [];
  loading = false;
  error = '';

  constructor(private tmdb: TmdbService) {}

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => typeof q === 'string' && q.trim().length > 1),
      tap(() => { this.loading = true; this.error = ''; }),
      switchMap(q => this.tmdb.searchMovies(q!))
    ).subscribe({
      next: (res) => { this.movieResults = res.results || []; this.loading = false; },
      error: (err) => { this.error = err.message || 'Search failed'; this.loading = false; }
    });

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => typeof q === 'string' && q.trim().length > 1),
      switchMap(q => this.tmdb.searchPerson(q!))
    ).subscribe({
      next: (res) => { this.personResults = res.results || []; },
      error: () => {}
    });
  }

  openDetail(event: any): void {
    console.log('Open detail for:', event);
  }

  getKnownForNames(person: any): string {
  if (!person.known_for || !person.known_for.length) return '';
  return person.known_for.map((k: any) => k.title || k.name).join(', ');
}
}
