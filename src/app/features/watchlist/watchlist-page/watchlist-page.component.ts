
import { Component, OnInit } from '@angular/core';
import { WatchlistService } from 'src/app/core/services/watchlist.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-watchlist-page',
  templateUrl: './watchlist-page.component.html',
  styleUrls: ['./watchlist-page.component.scss']
})
export class WatchlistPageComponent implements OnInit {
  public watchlist: any[] = [];

  constructor(private watchlistService: WatchlistService, private router: Router) {}

  ngOnInit() {
    this.watchlist = this.watchlistService.all();
    this.watchlistService.items$.subscribe(items => (this.watchlist = items));
  }

  removeFromWatchlist(movie: any) {
    this.watchlistService.toggle(movie);
  }

  open(id: number) {
    this.router.navigate(['/movie', id]);
  }
}
