import { Routes } from '@angular/router';
import { PublicShell } from './layout/public-shell/public-shell';
import { AppShell } from './layout/app-shell/app-shell';
import { LoginPage } from './features/auth/pages/login-page/login-page';
import { RegisterPage } from './features/auth/pages/register-page/register-page';
import { TeamsPage } from './features/teams/pages/teams-page/teams-page';
import { ProjectsPageComponent } from './features/projects/pages/projects-page/projects-page';
import { TaskBoardPage } from './features/tasks/pages/task-board-page/task-board-page';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    component: AppShell,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: 'teams',
        pathMatch: 'full'
      },
      {
        path: 'teams',
        component: TeamsPage,
      },
      {
        path: 'teams/:teamId/projects',
        component: ProjectsPageComponent,
      },
      {
        path: 'projects',
        component: ProjectsPageComponent,
      },
      {
        path: 'tasks',
        component: TaskBoardPage,
      },
      {
        path: 'teams/:teamId/tasks',
        component: TaskBoardPage,
      },
    ],
  },
  {
    path: 'login',
    component: PublicShell,
    children: [{ path: '', component: LoginPage }],
  },
  {
    path: 'register',
    component: PublicShell,
    children: [{ path: '', component: RegisterPage }],
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];

