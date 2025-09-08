import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MovieCardComponent } from './movie-card.component';
import { WatchlistService } from 'src/app/core/services/watchlist.service';
import { environment } from 'src/environment/environment';


describe('MovieCardComponent', () => {
  let component: MovieCardComponent;
  let fixture: ComponentFixture<MovieCardComponent>;
  let watchlistServiceSpy: jasmine.SpyObj<WatchlistService>;

  const mockMovie = { id: 42, title: 'Interstellar' };

  beforeEach(async () => {
    watchlistServiceSpy = jasmine.createSpyObj('WatchlistService', ['isSaved', 'toggle']);

    await TestBed.configureTestingModule({
      declarations: [MovieCardComponent],
      providers: [
        { provide: WatchlistService, useValue: watchlistServiceSpy }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(MovieCardComponent);
    component = fixture.componentInstance;
    component.movie = mockMovie;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set saved to true if movie is already in watchlist', () => {
      watchlistServiceSpy.isSaved.and.returnValue(true);
      component.ngOnInit();
      expect(component.saved).toBeTrue();
    });

    it('should set saved to false if movie is not in watchlist', () => {
      watchlistServiceSpy.isSaved.and.returnValue(false);
      component.ngOnInit();
      expect(component.saved).toBeFalse();
    });
  });

  describe('toggleWatchlist', () => {
    it('should call watchlist.toggle with movie', () => {
      watchlistServiceSpy.toggle.and.stub();
      component.saved = false;
      component.toggleWatchlist();
      expect(watchlistServiceSpy.toggle).toHaveBeenCalledWith(mockMovie);
    });

    it('should flip saved flag', () => {
      component.saved = false;
      component.toggleWatchlist();
      expect(component.saved).toBeTrue();

      component.toggleWatchlist();
      expect(component.saved).toBeFalse();
    });

    it('should stop event propagation if event is passed', () => {
      const stopPropagationSpy = jasmine.createSpy();
      const event = { stopPropagation: stopPropagationSpy } as any;
      component.toggleWatchlist(event);
      expect(stopPropagationSpy).toHaveBeenCalled();
    });
  });

  describe('onOpen', () => {
    it('should emit movie id', () => {
      spyOn(component.open, 'emit');
      component.onOpen();
      expect(component.open.emit).toHaveBeenCalledWith(mockMovie.id);
    });
  });

  describe('posterBase', () => {
    it('should use tmdbImageBaseUrl from environment', () => {
      expect(component.posterBase).toBe(environment.tmdbImageBaseUrl);
    });
  });
});
