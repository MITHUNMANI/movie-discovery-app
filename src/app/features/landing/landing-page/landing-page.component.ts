import { Component, OnInit } from '@angular/core';
import { TmdbService } from 'src/app/core/services/tmdb.service';
import { Router } from '@angular/router';

interface Mood { key: string; label: string; params: any; }

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html'
})
export class LandingPageComponent implements OnInit {
  moods: Mood[] = [
    { key: 'feelgood', label: 'Feel Good', params: { sort_by: 'popularity.desc', with_genres: '' } },
    { key: 'action', label: 'Action Fix', params: { with_genres: '28', sort_by: 'popularity.desc' } },
    { key: 'mind', label: 'Mind Benders', params: { with_genres: '9648,53', sort_by: 'popularity.desc' } }
  ];
  movies: any[] = [];
  loading = false;
  error = '';

  constructor(private tmdb: TmdbService, private router: Router) {}

  ngOnInit(): void {}

  selectMood(m: Mood) {
    this.loading = true;
    this.error = '';
    this.tmdb.discover(m.params).subscribe({
      next: (res) => { this.movies = res.results || []; this.loading = false; },
      error: (err) => { this.error = err.message || 'Failed'; this.loading = false; }
    });
  }
  openDetail(id: number){ this.router.navigate(['/movie', id]); }
}
