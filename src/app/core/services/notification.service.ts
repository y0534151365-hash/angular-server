import { Injectable, inject } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private snackBar = inject(MatSnackBar);

  private config: MatSnackBarConfig = {
    horizontalPosition: 'end',
    verticalPosition: 'top',
    duration: 5000,
    panelClass: ['notification-snackbar']
  };

  showSuccess(message: string): void {
    this.snackBar.open(message, 'Close', {
      ...this.config,
      panelClass: ['notification-snackbar', 'notification-success']
    });
  }

  showError(message: string): void {
    this.snackBar.open(message, 'Close', {
      ...this.config,
      panelClass: ['notification-snackbar', 'notification-error']
    });
  }
}
