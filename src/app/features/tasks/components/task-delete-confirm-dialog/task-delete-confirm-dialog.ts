import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Task } from '../../../../shared/models';

@Component({
  selector: 'app-task-delete-confirm-dialog',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  templateUrl: './task-delete-confirm-dialog.html',
  styleUrl: './task-delete-confirm-dialog.scss',
})
export class TaskDeleteConfirmDialog {
  @Input({ required: true }) task!: Task;
  @Output() confirm = new EventEmitter<void>();
  @Output() cancel = new EventEmitter<void>();

  onConfirm() {
    this.confirm.emit();
  }
  
  onCancel() {
    this.cancel.emit();
  }
}
