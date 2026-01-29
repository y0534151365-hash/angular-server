import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatBadgeModule } from '@angular/material/badge';
import { Team } from '../../../../shared/models';
import { Router } from '@angular/router';

@Component({
  selector: 'app-team-card',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, MatBadgeModule],
  templateUrl: './team-card.html',
  styleUrls: ['./team-card.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCard {
  @Input() team!: Team;
  @Input() colorClass: string = '';
  @Output() addMember = new EventEmitter<number>();

  constructor(private readonly router: Router) {}

  navigateToProjectsPage() {
    this.router.navigate(['/teams', this.team.id, 'projects']);
  }

  requestAddMember() {
    this.addMember.emit(this.team.id);
  }
}