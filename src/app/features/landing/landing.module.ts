import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MovieCardComponent } from 'src/app/shared/movie-card/movie-card.component';


@NgModule({
  declarations: [
    LandingComponent,
    LandingPageComponent,
    MovieCardComponent
  ],
  imports: [
    CommonModule,
    LandingRoutingModule
  ]
})
export class LandingModule { }
