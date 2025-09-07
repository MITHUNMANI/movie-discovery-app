import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MovieRoutingModule } from './movie-routing.module';
import { MovieComponent } from './movie.component';
import { MovieDetailComponent } from './movie-detail/movie-detail.component';
import { MovieCardModule } from "src/app/shared/movie-card/movie-card.module";


@NgModule({
  declarations: [
    MovieComponent,
    MovieDetailComponent
  ],
  imports: [
    CommonModule,
    MovieRoutingModule,
    MovieCardModule
]
})
export class MovieModule { }
