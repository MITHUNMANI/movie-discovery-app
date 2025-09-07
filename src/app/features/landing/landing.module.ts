import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { MovieCardModule } from 'src/app/shared/movie-card/movie-card.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [
    LandingComponent,
    LandingPageComponent,
  ],
  imports: [
    CommonModule,
    LandingRoutingModule,
    MovieCardModule,
    SharedModule
]
})
export class LandingModule { }
