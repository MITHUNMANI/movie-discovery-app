import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { SearchService } from 'src/app/core/services/search.service';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html',
  styleUrls: ['./movie-detail.component.scss']
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  cast: any[] = [];
  similar: any[] = [];
  trailerUrl?: SafeResourceUrl;
  loading = true;
  error!:any;
  searchActive = false;
  searchType: 'movie' | 'actor' = 'movie';
  searchMovies: any[] = [];
  searchActors: any[] = [];
  searchLoading = false;
  searchError:any = '';
  constructor(
    private route: ActivatedRoute,
    private tmdb: TmdbService,
    private router: Router, 
    private sanitizer: DomSanitizer,
    private searchService: SearchService
  ) {}

  ngOnInit(): void {
     this.searchService.search$.subscribe(state => {
      this.searchActive = !!state.query;
      this.searchType = state.type;
      this.searchLoading = state.loading;
      this.searchError = state.error;

      if (state.type === 'movie') {
        this.searchMovies = state.results;
        this.searchActors = [];
      } else if (state.type === 'actor') {
        this.searchActors = state.results;
        this.searchMovies = [];
      }
      if (!state.query) {
        this.searchActive = false;
        this.searchMovies = [];
        this.searchActors = [];
      }
    });
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.load(id);
  }

  private load(id: number) {
    this.loading = true;
    this.tmdb.getMovie(id).subscribe({
      next: (m) => { this.movie = m; },
      error: (e) => { this.error = e.message; }
    });

    this.tmdb.getMovieVideos(id).subscribe({
      next: (v) => {
        const video = (v.results || []).find((x: any) => x.site === 'YouTube' && x.type === 'Trailer') || (v.results || [])[0];
        if (video) {
          this.trailerUrl = this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${video.key}`);
        }
      }
    });

    this.tmdb.getCredits(id).subscribe({ next: (c) => this.cast = c.cast || []});
    this.tmdb.getSimilar(id).subscribe({ next: (s) => this.similar = (s.results || [])});
    this.loading = false;
  }

  openDetail(id: number) {
    this.router.navigate(['/movie', id]).then(() => {
      this.load(id);
    });
  }

  getKnownForNames(person: any): string {
  if (!person.known_for || !person.known_for.length) return '';
  return person.known_for
    .map((k: any) => k.title ? k.title : k.name)
    .join(', ');
}

}
