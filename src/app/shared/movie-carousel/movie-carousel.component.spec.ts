import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCarouselComponent } from './movie-carousel.component';
import { environment } from 'src/environment/environment';

describe('MovieCarouselComponent', () => {
  let component: MovieCarouselComponent;
  let fixture: ComponentFixture<MovieCarouselComponent>;

  const mockItems = [
    { id: 1, title: 'Inception' },
    { id: 2, title: 'The Dark Knight' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MovieCarouselComponent]
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

  it('should accept items input', () => {
    expect(component.items.length).toBe(2);
    expect(component.items[0].title).toBe('Inception');
  });

  it('should accept type input', () => {
    component.type = 'actor';
    expect(component.type).toBe('actor');
  });

  it('should emit open event with id when onOpen is called', () => {
    spyOn(component.open, 'emit');
    component.onOpen(42);
    expect(component.open.emit).toHaveBeenCalledWith(42);
  });

  it('should have carousel options configured', () => {
    expect(component.carouselOptions.loop).toBeTrue();
    expect(component.carouselOptions.nav).toBeTrue();
    expect(component.carouselOptions.margin).toBe(10);
    expect(component.carouselOptions.responsive).toBeDefined();
    });
});
