import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCarouselComponent } from './movie-carousel.component';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // ✅ add this
import { environment } from 'src/environment/environment';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('MovieCarouselComponent', () => {
  let component: MovieCarouselComponent;
  let fixture: ComponentFixture<MovieCarouselComponent>;

  const mockItems = [
    { id: 1, title: 'Inception' },
    { id: 2, title: 'The Dark Knight' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieCarouselComponent],
      imports: [
        CarouselModule,
        BrowserAnimationsModule 
      ],
       schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCarouselComponent);
    component = fixture.componentInstance;
    component.items = mockItems;
    component.type = 'movie';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have posterBase set from environment', () => {
    expect(component.posterBase).toBe(environment.tmdbImageBaseUrl);
  });
});
