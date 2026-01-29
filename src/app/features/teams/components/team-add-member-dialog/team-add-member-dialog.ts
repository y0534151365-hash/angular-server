import { Component, EventEmitter, Input, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  selector: 'app-team-add-member-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './team-add-member-dialog.html',
  styleUrl: './team-add-member-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamAddMemberDialog {
  @Input() teamid: string = '';
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;
  @Output() onClose = new EventEmitter<void>();
  @Output() addMember = new EventEmitter<string>();
  form: FormGroup;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      userId: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isLoading) return;
    this.addMember.emit(this.form.value.userId);
  }

  closeDialog(): void {
    this.onClose.emit();
  }
}

