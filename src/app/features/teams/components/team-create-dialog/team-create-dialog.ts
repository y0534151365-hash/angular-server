import { Component, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CreateTeamRequest } from '../../../../shared/models';

@Component({
  selector: 'app-team-create-dialog',
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
  templateUrl: './team-create-dialog.html',
  styleUrl: './team-create-dialog.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TeamCreateDialog {
  @Output() onClose = new EventEmitter<void>();
  @Output() createTeam = new EventEmitter<CreateTeamRequest>();
  form: FormGroup;
  isSubmitting: boolean = false;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.nonNullable.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: [''],
    });
  }

  onSubmit(): void {
    if (this.form.invalid || this.isSubmitting) return;
    const payload = this.form.value as CreateTeamRequest;
    this.isSubmitting = true;
    this.createTeam.emit(payload);
  }

  closeDialog(): void {
    this.isSubmitting = false;
    this.onClose.emit();
  }
}
