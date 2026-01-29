import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { BehaviorSubject, combineLatest, of } from 'rxjs';
import { switchMap, map, catchError, startWith } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DragDropModule, CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { TasksService } from '../../services/tasks';
import { Task, TaskStatus, CreateTaskRequest, UpdateTaskRequest } from '../../../../shared/models';
import { TaskCreate } from '../../components/task-create/task-create';
import { TaskEditorDialog } from '../../components/task-editor-dialog/task-editor-dialog';

@Component({
  selector: 'app-task-board-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    DragDropModule,
    TaskCreate,
    TaskEditorDialog,
  ],
  templateUrl: './task-board-page.html',
  styleUrl: './task-board-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TaskBoardPage {
  private readonly tasksService = inject(TasksService);
  private readonly route = inject(ActivatedRoute);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  // Expose enum to template
  readonly TaskStatus = TaskStatus;

  readonly projectId = toSignal(
    this.route.queryParams.pipe(
      map(params => {
        const id = params['projectId'];
        return id ? Number(id) : null;
      })
    ),
    { initialValue: null }
  );

  readonly state = toSignal(
    combineLatest([
      this.route.queryParams.pipe(map(p => Number(p['projectId']) || null)), 
      this.refreshTrigger$
    ]).pipe(
      switchMap(([projectId]) => {
        // If projectId is present, fetch tasks for that project
        // If not, fetch ALL tasks (assuming service supports empty projectId for "all")
        return this.tasksService.getTasks(projectId || undefined).pipe(
          map(tasks => ({ tasks, isLoading: false, error: null })),
          startWith({ tasks: [], isLoading: true, error: null }),
          catchError(() => of({ tasks: [], isLoading: false, error: 'Failed to load tasks' }))
        );
      })
    ),
    { initialValue: { tasks: [], isLoading: false, error: null } }
  );

  readonly todoTasks = computed(() => 
    this.state().tasks.filter(t => t.status === TaskStatus.TODO)
  );
  readonly inProgressTasks = computed(() => 
    this.state().tasks.filter(t => t.status === TaskStatus.IN_PROGRESS)
  );
  readonly doneTasks = computed(() => 
    this.state().tasks.filter(t => t.status === TaskStatus.DONE)
  );

  readonly isCreateTaskOpen = signal(false);
  readonly selectedTask = signal<Task | null>(null);

  openCreateTask() {
    this.isCreateTaskOpen.set(true);
  }

  closeCreateTask() {
    this.isCreateTaskOpen.set(false);
  }

  handleCreateTask(payload: any) {
    const pid = this.projectId();
    if (!pid) return;

    const request: CreateTaskRequest = {
      projectId: pid,
      title: payload.title,
      description: payload.description,
      status: TaskStatus.TODO,
      priority: payload.priority,
      dueDate: payload.dueDate
    };

    this.tasksService.createTask(request).subscribe({
      next: () => {
        this.closeCreateTask();
        this.refreshTrigger$.next();
      },
      error: () => alert('Failed to create task')
    });
  }

  openEditTask(task: Task) {
    this.selectedTask.set(task);
  }

  closeEditTask() {
    this.selectedTask.set(null);
  }

  handleUpdateTask(event: { id: number; data: Partial<Task> }) {
    const updatePayload: UpdateTaskRequest = {
        title: event.data.title,
        description: event.data.description,
        status: event.data.status,
        priority: event.data.priority,
        dueDate: event.data.dueDate
    };

    this.tasksService.updateTask(event.id, updatePayload).subscribe({
        next: () => {
            this.closeEditTask();
            this.refreshTrigger$.next();
        },
        error: () => alert('Failed to update task')
    });
  }

  handleDeleteTask(taskId: number) {
      this.tasksService.deleteTask(taskId).subscribe({
          next: () => {
              this.closeEditTask();
              this.refreshTrigger$.next();
          },
          error: () => alert('Failed to delete task')
      });
  }

  drop(event: CdkDragDrop<Task[]>, newStatus: TaskStatus) {
    const task = event.item.data as Task;
    
    if (task.status === newStatus) {
      // Same column - no status change needed
      return;
    }

    // Update task status
    const updatePayload: UpdateTaskRequest = {
      title: task.title,
      description: task.description,
      status: newStatus,
      priority: task.priority,
      dueDate: task.dueDate
    };

    this.tasksService.updateTask(task.id, updatePayload).subscribe({
      next: () => {
        this.refreshTrigger$.next();
      },
      error: () => alert('Failed to move task')
    });
  }
}
