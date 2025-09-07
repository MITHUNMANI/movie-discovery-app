import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { OwlOptions } from 'ngx-owl-carousel-o';
import { environment } from 'src/environment/environment';

@Component({
  selector: 'app-movie-carousel',
  templateUrl: './movie-carousel.component.html',
  styleUrls: ['./movie-carousel.component.scss']
})
export class MovieCarouselComponent implements OnInit {
  @Input() items: any[] = [];
  @Input() type: 'movie' | 'actor' = 'movie'; 
  @Output() open = new EventEmitter<number>();

  posterBase = environment.tmdbImageBaseUrl;

  carouselOptions: OwlOptions = {
    loop: true,
    margin: 15,
    nav: true,
    dots: false,
    responsive: {
      0: { items: 1 },
      576: { items: 2 },
      768: { items: 3 },
      1200: { items: 5 }
    }
  };

  constructor() {}

  ngOnInit(): void {}

  onOpen(id: number) {
    this.open.emit(id);
  }
}
