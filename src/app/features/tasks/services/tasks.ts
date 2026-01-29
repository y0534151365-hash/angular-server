import { inject, Injectable } from '@angular/core';
import { ApiClient } from '../../../core/services/api-client';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Task, CreateTaskRequest, UpdateTaskRequest } from '../../../shared/models';

@Injectable({
  providedIn: 'root',
})
export class TasksService {
  private readonly api = inject(ApiClient);

  getTasks(projectId?: number): Observable<Task[]> {
    const queryParams = projectId ? { projectId: projectId.toString() } : undefined;
    
    return this.api.get<any[]>('tasks', { params: queryParams }).pipe(
      map(tasks => tasks.map(task => this.mapApiToTask(task)))
    );
  }

  createTask(payload: CreateTaskRequest): Observable<Task> {
    const apiPayload = {
      projectId: payload.projectId,
      title: payload.title,
      description: payload.description,
      status: payload.status,
      priority: payload.priority,
      assigneeId: payload.assigneeId, 
      dueDate: payload.dueDate,
      orderIndex: payload.orderIndex
    };
    return this.api.post<any>('tasks', apiPayload).pipe(
      map(task => this.mapApiToTask(task))
    );
  }

  updateTask(taskId: number, payload: UpdateTaskRequest): Observable<Task> {
    const apiPayload = {
      ...payload,
      assignee_id: payload.assigneeId, 
      due_date: payload.dueDate
    };
   
    Object.keys(apiPayload).forEach(key => (apiPayload as any)[key] === undefined && delete (apiPayload as any)[key]);

    return this.api.patch<any>(`tasks/${taskId}`, apiPayload).pipe(
      map(task => this.mapApiToTask(task))
    );
  }

  deleteTask(taskId: number): Observable<void> {
    return this.api.delete<void>(`tasks/${taskId}`);
  }

  private mapApiToTask(data: any): Task {
    return {
      id: data.id,
      projectId: data.project_id,
      title: data.title,
      description: data.description,
      status: data.status,
      priority: data.priority,
      assigneeId: data.assignee_id,
      dueDate: data.due_date,
      createdAt: data.created_at,
      orderIndex: data.order_index || 0
    };
  }
}
