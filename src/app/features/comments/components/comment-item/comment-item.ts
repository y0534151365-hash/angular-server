import { Component, Input } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Comment } from '../../../../shared/models/comment.model';

@Component({
  selector: 'app-comment-item',
  standalone: true,
  imports: [CommonModule, DatePipe],
  templateUrl: './comment-item.html',
  styleUrl: './comment-item.scss',
})
export class CommentItem {
  @Input({ required: true }) comment!: Comment;
}
