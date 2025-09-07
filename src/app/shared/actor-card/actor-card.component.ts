import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-actor-card',
  templateUrl: './actor-card.component.html',
  styleUrls: ['./actor-card.component.scss']
})
export class ActorCardComponent {
  @Input() actor!: any;
  @Output() openActor = new EventEmitter<number>();

  profileBase = 'https://image.tmdb.org/t/p/w200';

  selectActor() {
    this.openActor.emit(this.actor.id);
  }

  getKnownFor(): string {
    if (!this.actor.known_for || !this.actor.known_for.length) return '';
    return this.actor.known_for
      .map((m: any) => m.title || m.name)
      .slice(0, 3) 
      .join(', ');
  }
}
