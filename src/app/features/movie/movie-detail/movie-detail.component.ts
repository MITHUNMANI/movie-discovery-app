import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-movie-detail',
  templateUrl: './movie-detail.component.html'
})
export class MovieDetailComponent implements OnInit {
  movie: any;
  cast: any[] = [];
  similar: any[] = [];
  trailerUrl?: SafeResourceUrl;
  loading = true;
  error = '';

  constructor(
    private route: ActivatedRoute,
    private tmdb: TmdbService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
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
}
