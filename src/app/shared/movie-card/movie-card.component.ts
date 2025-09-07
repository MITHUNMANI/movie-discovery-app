import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WatchlistService } from 'src/app/core/services/watchlist.service';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss']
})
export class MovieCardComponent implements OnInit {
  @Input() movie: any;
  @Output() open = new EventEmitter<number>();
  posterBase = environment.tmdbImageBaseUrl;
  saved = false;

  constructor(private watchlist: WatchlistService) {}

  ngOnInit(): void {
    this.saved = this.watchlist.isSaved(this.movie.id);
  }

  toggleWatchlist(e?: Event) {
    if (e) { e.stopPropagation(); }
    this.watchlist.toggle(this.movie);
    this.saved = !this.saved;
  }

  onOpen() {
    this.open.emit(this.movie.id);
  }
}
