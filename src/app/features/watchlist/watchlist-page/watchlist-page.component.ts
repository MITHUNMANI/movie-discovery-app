import { Component, OnInit } from '@angular/core';
import { WatchlistService } from 'src/app/core/services/watchlist.service';
import { Router } from '@angular/router';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.scss']
})
export class WatchlistPageComponent implements OnInit {
  public watchlist: any[] = [];
  public initialWatchlist: any[] = [];
  loading = false;
  error:any = '';
  searchResults: any[] = [];
  searchType: 'movie' | 'actor' | null = null;

  constructor(
    private watchlistService: WatchlistService,
    private router: Router,
    private searchService: SearchService
  ) {}

  ngOnInit() {
    this.watchlist = this.watchlistService.all();
    this.initialWatchlist = [...this.watchlist];

    this.watchlistService.items$.subscribe(items => {
      this.watchlist = items;
      this.initialWatchlist = [...items];
    });

    this.searchService.search$.subscribe(state => {
      this.loading = state.loading;
      this.error = state.error;

      if (state.results && state.results.length) {
        this.searchResults = state.results;
        this.searchType = state.type;
      } else {
        this.searchResults = [];
        this.searchType = null;
      }
    });
  }

  open(id: number) {
    this.router.navigate(['/movie', id]);
  }

  removeFromWatchlist(movie: any) {
    this.watchlistService.toggle(movie);
  }

  getKnownForNames(person: any): string {
    if (!person.known_for || !person.known_for.length) return '';
    return person.known_for.map((k: any) => k.title ? k.title : k.name).join(', ');
  }
}
