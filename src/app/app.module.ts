import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './features/search/search-page/search-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieCardModule } from './shared/movie-card/movie-card.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiHeadersInterceptor } from './core/services/api-headers.interceptor';
import { WatchlistPageComponent } from './features/watchlist/watchlist-page/watchlist-page.component';

@NgModule({
  declarations: [
    AppComponent,
    SearchPageComponent,
    WatchlistPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MovieCardModule,
    HttpClientModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiHeadersInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
