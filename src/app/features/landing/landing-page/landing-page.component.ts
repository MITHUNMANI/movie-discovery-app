import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { Router } from '@angular/router';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { SearchService } from 'src/app/core/services/search.service';

interface Mood { key: string; label: string; params: any; }

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LandingPageComponent implements OnInit {
  moods: Mood[] = [
    { key: 'feelgood', label: 'Feel Good', params: { sort_by: 'popularity.desc', with_genres: ''} },
    { key: 'action', label: 'Action Fix', params: { with_genres: '28', sort_by: 'popularity.desc' } },
    { key: 'mind', label: 'Mind Benders', params: { with_genres: '9648,53', sort_by: 'popularity.desc' } }
  ];
  movies: any[] = [];
  initialMovies: any[] = [];
  loading = false;
  error!:any;
  actors: any[] = [];
  carouselOptions: OwlOptions = {
    loop: true,
    margin: 15,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      600: { items: 3 },
      1000: { items: 5 }
    }
  };
  constructor(private tmdb: TmdbService, private router: Router, private searchService: SearchService) {
  this.searchService.search$.subscribe(state => {
    this.loading = state.loading;
    this.error = state.error;

    if (!state.query) {
      this.movies = [...this.initialMovies];
      this.actors = [];
    } else if (state.type === 'movie') {
      this.movies = state.results;
      this.actors = [];
    } else {
      this.actors = state.results;
      this.movies = [];
    }
  });
}


  ngOnInit(): void {
    this.fetchMovies({ sort_by: 'popularity.desc' });
  }

  private fetchMovies(params: Record<string, any>) {
    this.loading = true;
    this.error = '';
    this.tmdb.discover(params).subscribe({
      next: (res) => {
        this.movies = res.results || [];
        this.initialMovies = [...this.movies];
        this.loading = false;
      },
      error: (err) => {
        this.error = err.message || 'Failed';
        this.loading = false;
      }
    });
  }

  selectMood(m: Mood) {
    this.loading = true;
    this.error = '';
    this.tmdb.discover(m.params).subscribe({
      next: (res) => { this.movies = res.results || []; this.loading = false; },
      error: (err) => { this.error = err.message || 'Failed'; this.loading = false; }
    });
  }
  openDetail(id: number){ this.router.navigate(['/movie', id]); }

  getKnownForNames(person: any): string {
  if (!person.known_for || !person.known_for.length) return '';
  return person.known_for.map((k: any) => k.title ? k.title : k.name).join(', ');
}

openActor(actor: any) {
  console.log('Actor clicked:', actor);
}
}
