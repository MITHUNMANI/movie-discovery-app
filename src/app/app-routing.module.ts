import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SearchPageComponent } from './features/search/search-page/search-page.component';
import { WatchlistPageComponent } from './features/watchlist/watchlist-page/watchlist-page.component';

const routes: Routes = [
  { path: '', redirectTo: 'landing', pathMatch: 'full' },
  { path: 'landing', loadChildren: () => import('./features/landing/landing.module').then(m => m.LandingModule) },
  { path: 'search', component: SearchPageComponent },
  { path: 'movie/:id', loadChildren: () => import('./features/movie/movie.module').then(m => m.MovieModule) },
  { path: 'watchlist', component: WatchlistPageComponent },
  { path: '**', redirectTo: 'landing' }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
