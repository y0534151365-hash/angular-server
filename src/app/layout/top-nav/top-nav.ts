import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDividerModule } from '@angular/material/divider';
import { AuthService } from '../../features/auth/services/auth';

@Component({
  selector: 'app-top-nav',
  imports: [MatButtonModule, MatIconModule, MatMenuModule, MatTooltipModule, MatDividerModule],
  templateUrl: './top-nav.html',
  styleUrl: './top-nav.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TopNav {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  onClickLogout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}