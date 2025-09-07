import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SearchPageComponent } from './features/search/search-page/search-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MovieCardModule } from './shared/movie-card/movie-card.module';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { ApiHeadersInterceptor } from './core/services/api-headers.interceptor';
import { WatchlistPageComponent } from './features/watchlist/watchlist-page/watchlist-page.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { HeaderComponent } from './shared/header/header.component';
import { FooterComponent } from './shared/footer/footer.component';
import { SharedModule } from './shared/shared.module';

@NgModule({
  declarations: [
    AppComponent,
    WatchlistPageComponent,
    HeaderComponent,
    FooterComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    CommonModule,
    ReactiveFormsModule,
    MovieCardModule,
    HttpClientModule,
    CarouselModule,
    SharedModule
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: ApiHeadersInterceptor, multi: true }],
  bootstrap: [AppComponent]
})
export class AppModule { }
