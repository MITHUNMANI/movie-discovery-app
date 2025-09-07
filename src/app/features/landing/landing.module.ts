import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MovieCardModule } from 'src/app/shared/movie-card/movie-card.module';


@NgModule({
  declarations: [
    LandingComponent,
    LandingPageComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MovieCardModule
  ]
})
export class LandingModule { }
