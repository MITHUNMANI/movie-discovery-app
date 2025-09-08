import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActorCardComponent } from './actor-card.component';

describe('ActorCardComponent', () => {
  let component: ActorCardComponent;
  let fixture: ComponentFixture<ActorCardComponent>;

  const mockActor = {
    id: 101,
    name: 'Leonardo DiCaprio',
    known_for: [
      { title: 'Inception' },
      { title: 'Titanic' },
      { name: 'The Revenant' }
    ]
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ActorCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(ActorCardComponent);
    component = fixture.componentInstance;
    component.actor = mockActor;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('selectActor', () => {
    it('should emit actor id when called', () => {
      spyOn(component.openActor, 'emit');
      component.selectActor();
      expect(component.openActor.emit).toHaveBeenCalledWith(mockActor.id);
    });
  });

  describe('getKnownFor', () => {
    it('should return comma-separated titles/names (max 3)', () => {
      const result = component.getKnownFor();
      expect(result).toBe('Inception, Titanic, The Revenant');
    });

    it('should return empty string if known_for is empty', () => {
      component.actor = { ...mockActor, known_for: [] };
      expect(component.getKnownFor()).toBe('');
    });

    it('should return empty string if known_for is missing', () => {
      component.actor = { id: 1, name: 'Test' };
      expect(component.getKnownFor()).toBe('');
    });

    it('should only include up to 3 items', () => {
      component.actor = {
        id: 2,
        name: 'Test',
        known_for: [
          { title: 'One' },
          { title: 'Two' },
          { title: 'Three' },
          { title: 'Four' }
        ]
      };
      expect(component.getKnownFor()).toBe('One, Two, Three');
    });
  });

  describe('profileBase', () => {
    it('should have correct TMDB image base path', () => {
      expect(component.profileBase).toBe('https://image.tmdb.org/t/p/w200');
    });
  });
});
