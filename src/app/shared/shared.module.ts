import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SkeletonLoaderComponent } from './skeleton-loader/skeleton-loader.component';
import { MovieCardModule } from './movie-card/movie-card.module';
import { MovieCarouselComponent } from './movie-carousel/movie-carousel.component';
import { CarouselModule } from "ngx-owl-carousel-o";
import { SearchPageComponent } from '../features/search/search-page/search-page.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActorCardComponent } from './actor-card/actor-card.component';

@NgModule({
  declarations: [SkeletonLoaderComponent, MovieCarouselComponent,SearchPageComponent, ActorCardComponent],
  imports: [CommonModule, MovieCardModule, CarouselModule,ReactiveFormsModule ],
  exports: [SkeletonLoaderComponent,MovieCardModule, MovieCarouselComponent,SearchPageComponent] 
})
export class SharedModule {}
