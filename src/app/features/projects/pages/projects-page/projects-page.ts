import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { ProjectsService } from '../../services/projects';
import { ProjectCreateDialog } from '../../components/project-create-dialog/project-create-dialog';

@Component({
  selector: 'app-projects-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    MatCardModule,
    ProjectCreateDialog,
  ],
  templateUrl: './projects-page.html',
  styleUrl: './projects-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProjectsPageComponent {
  private readonly projectsService = inject(ProjectsService);
  private readonly route = inject(ActivatedRoute);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);


  private readonly paramMap = toSignal(this.route.paramMap);
  

  readonly currentTeamId = computed(() => {
    const params = this.paramMap();
    const id = params?.get('teamId');
    return id ? Number(id) : null;
  });


  readonly state = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => 
        this.projectsService.getProjects().pipe(
          map(projects => ({
            allProjects: projects,
            isLoading: false,
            error: null
          })),
          startWith({ allProjects: [], isLoading: true, error: null }),
          catchError(() => of({ 
            allProjects: [], 
            isLoading: false, 
            error: 'Failed to load projects' 
          }))
        )
      )
    ),
    { initialValue: { allProjects: [], isLoading: true, error: null } }
  );

  // 4. Senior Architect Level: Computed Filter
  // This derives the view purely from the current state and current team ID
  readonly filteredProjects = computed(() => {
    const { allProjects } = this.state();
    const teamId = this.currentTeamId();

    if (!teamId) {
      // If no teamId (e.g. /projects route), showing all projects mixed
      return allProjects;
    }
    
    return allProjects.filter(p => p.team_id === teamId);
  });

  readonly createProjectModalOpen = signal(false);

  openCreateProjectModal(): void {
    this.createProjectModalOpen.set(true);
  }

  closeCreateProjectModal(): void {
    this.createProjectModalOpen.set(false);
  }

  onCreateProjectSubmit(payload: { name: string; description?: string }): void {
    const teamId = this.currentTeamId();
    if (!teamId) return;

    const createPayload = {
      teamId: teamId.toString(),
      ...payload
    };

    this.projectsService.createProject(createPayload).subscribe({
      next: (newProject) => {
        this.closeCreateProjectModal();
        this.refreshTrigger$.next();
      },
      error: (err) => {
        alert('Failed to create project'); 
      }
    });
  }

  trackByProjectId(_index: number, project: any): number {
    return project.id;
  }

  getColorClass(index: number): string {
    const colors = ['color-green', 'color-blue', 'color-pink'];
    return colors[index % 3];
  }
}