import { Component, ElementRef, HostListener } from '@angular/core';
import { FormControl } from '@angular/forms';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { debounceTime, distinctUntilChanged, filter, switchMap, tap } from 'rxjs/operators';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-search',
  templateUrl: './search-page.component.html',
  styleUrls: ['./search-page.component.scss']
})
export class SearchPageComponent {
  searchControl = new FormControl('');
  searchType: 'movie' | 'actor' = 'movie';
  suggestions: any[] = [];
  loading = false;
  showDropdown = false;

  constructor(private tmdb: TmdbService, private searchService: SearchService,private elementRef: ElementRef) {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      filter(q => typeof q === 'string' && q.trim().length > 0),
      tap(() => { this.loading = true; this.showDropdown = true; }),
      switchMap(q => {
        if (this.searchType === 'movie') return this.tmdb.searchMovies(q!);
        else return this.tmdb.searchPerson(q!);
      })
    ).subscribe({
      next: (res: any) => {
        this.suggestions = res.results || [];
        this.loading = false;
        this.searchService.update({
          results: this.suggestions,
          type: this.searchType,
          query: this.searchControl.value ?? '',
          loading: false
        });
      },
      error: () => {
        this.suggestions = [];
        this.loading = false;
        this.searchService.update({ results: [], loading: false });
      }
    });
  }

  onTypeChange(event: any) {
    this.searchType = event.target.value;
    this.clearSearch();
  }

  selectItem(item: any) {
    this.showDropdown = false;
    this.searchService.update({
      results: [item],
      type: this.searchType,
      query: this.searchType === 'movie' ? item.title : item.name,
      loading: false
    });
  }

  clearSearch() {
    this.searchControl.setValue('');
    this.showDropdown = false;
    this.suggestions = [];
    this.searchService.reset();
  }

   @HostListener('document:click', ['$event.target'])
  onClickOutside(targetElement: any) {
    const clickedInside = this.elementRef.nativeElement.contains(targetElement);
    if (!clickedInside) {
      this.showDropdown = false;
    }
  }
}
