import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLinkActive, RouterLink } from '@angular/router';
import { MatListModule } from '@angular/material/list';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-side-nav',
  imports: [CommonModule, RouterLink, RouterLinkActive, MatListModule, MatIconModule, MatDividerModule],
  templateUrl: './side-nav.html',
  styleUrl: './side-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SideNav {
  private readonly router = inject(Router);

  navigationItems = [
    { label: 'Teams', icon: 'group', path: '/teams' },
    { label: 'Projects', icon: 'folder', path: '/projects' },
    { label: 'Tasks', icon: 'task', path: '/tasks' },
  ];
}
