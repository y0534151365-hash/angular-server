import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs';
import { TopNav } from '../top-nav/top-nav';    
import { SideNav } from '../side-nav/side-nav';

@Component({
  selector: 'app-app-shell',
  imports: [
    CommonModule,
    RouterOutlet,
    MatToolbarModule,
    MatSidenavModule,
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TopNav,
    SideNav
  ],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppShell {
  private breakpointObserver = inject(BreakpointObserver);
  
  // Observe mobile breakpoint
  private isMobile = toSignal(
    this.breakpointObserver.observe([Breakpoints.Handset, Breakpoints.Tablet])
      .pipe(map(result => result.matches)),
    { initialValue: false }
  );
  
  sidenavOpen = signal(true);
  
  // Sidenav mode: 'over' on mobile, 'side' on desktop
  sidenavMode = computed(() => this.isMobile() ? 'over' : 'side');

  toggleSidenav() {
    this.sidenavOpen.update(open => !open);
  }
}

