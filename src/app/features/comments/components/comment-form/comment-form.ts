import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-comment-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, MatIconModule],
  templateUrl: './comment-form.html',
  styleUrl: './comment-form.scss',
})
export class CommentForm {
  @Input() isSubmitting = false;
  @Output() submitComment = new EventEmitter<string>();

  private fb = inject(FormBuilder);

  form: FormGroup = this.fb.group({
    body: ['', [Validators.required, Validators.minLength(1)]],
  });

  onSubmit() {
    if (this.form.invalid || this.isSubmitting) return;

    const body = this.form.value.body;
    this.submitComment.emit(body);
    this.form.reset();
  }
}
