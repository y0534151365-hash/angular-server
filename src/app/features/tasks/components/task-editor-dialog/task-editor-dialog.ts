import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Task, TaskStatus } from '../../../../shared/models';
import { CommentList } from '../../../comments/components/comment-list/comment-list';
import { TaskDeleteConfirmDialog } from '../task-delete-confirm-dialog/task-delete-confirm-dialog';

@Component({
  selector: 'app-task-editor-dialog',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, CommentList, TaskDeleteConfirmDialog],
  templateUrl: './task-editor-dialog.html',
  styleUrl: './task-editor-dialog.scss',
})
export class TaskEditorDialog implements OnChanges {
  @Input({ required: true }) task!: Task;
  @Output() save = new EventEmitter<{id: number, data: Partial<Task>}>();
  @Output() delete = new EventEmitter<number>();
  @Output() cancel = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  
  form: FormGroup = this.fb.group({
    title: ['', [Validators.required, Validators.minLength(3)]],
    description: [''],
    dueDate: [''],
    priority: ['MEDIUM'],
    status: ['TODO']
  });

  isSubmitting = false;
  isDeleteConfirmOpen = signal(false);

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.task) {
      this.form.patchValue({
        title: this.task.title,
        description: this.task.description,
        dueDate: this.task.dueDate ? new Date(this.task.dueDate).toISOString().split('T')[0] : '',
        priority: this.task.priority,
        status: this.task.status
      });
    }
  }

  onSave() {
    if (this.form.invalid || this.isSubmitting) return;
    
  
    const formValue = this.form.value;
    const payload: Partial<Task> = {
      title: formValue.title,
      description: formValue.description,
  
      dueDate: formValue.dueDate ? new Date(formValue.dueDate).toISOString() : undefined,
      priority: formValue.priority,
      status: formValue.status
    };

    this.save.emit({ id: this.task.id, data: payload });
  }

  onDelete() {
    this.isDeleteConfirmOpen.set(true);
  }

  onDeleteConfirm() {
    this.isDeleteConfirmOpen.set(false);
    this.delete.emit(this.task.id);
  }

  onDeleteCancel() {
    this.isDeleteConfirmOpen.set(false);
  }

  onCancel() {
    this.cancel.emit();
  }
}
  

