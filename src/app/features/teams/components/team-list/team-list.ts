import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Team } from '../../../../shared/models';
import { TeamCard } from '../team-card/team-card';

@Component({
  selector: 'app-team-list',
  standalone: true,
  imports: [CommonModule, TeamCard],
  templateUrl: './team-list.html',
  styleUrls: ['./team-list.scss'],
})
export class TeamList {
  @Input() teams: Team[] = [];
  @Output() addMember = new EventEmitter<number>();

  forwardAddMember(teamId: number) {
    this.addMember.emit(teamId);
  }

  getColorClass(index: number): string {
    const colors = ['color-green', 'color-blue', 'color-pink'];
    return colors[index % 3];
  }
}

