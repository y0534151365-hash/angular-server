import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { BehaviorSubject, of } from 'rxjs';
import { catchError, map, startWith, switchMap } from 'rxjs/operators';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { TeamsService } from '../../services/teams';
import { NotificationService } from '../../../../core/services/notification.service';
import { Team } from '../../../../shared/models';
import { TeamList } from '../../components/team-list/team-list';
import { TeamAddMemberDialog } from '../../components/team-add-member-dialog/team-add-member-dialog';
import { TeamCreateDialog } from '../../components/team-create-dialog/team-create-dialog';

@Component({
  selector: 'app-teams-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule,
    TeamList,
    TeamAddMemberDialog,
    TeamCreateDialog,
  ],
  templateUrl: './teams-page.html',
  styleUrl: './teams-page.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TeamsPage {
  private readonly teamsService = inject(TeamsService);
  private readonly notificationService = inject(NotificationService);
  private readonly refreshTrigger$ = new BehaviorSubject<void>(undefined);

  readonly state = toSignal(
    this.refreshTrigger$.pipe(
      switchMap(() => 
        this.teamsService.getTeams().pipe(
          map(teams => ({ teams, isLoading: false, error: null })),
          startWith({ teams: [], isLoading: true, error: null }),
          catchError(() => of({ teams: [], isLoading: false, error: 'Failed to load teams.' }))
        )
      )
    ),
    { initialValue: { teams: [], isLoading: true, error: null } }
  );


  readonly selectedTeamId = signal<number | null>(null);
  readonly isCreateTeamModalOpen = signal(false);
  
  // Add member dialog state
  readonly isAddingMember = signal(false);
  readonly addMemberError = signal<string | null>(null);

  openAddMemberModal(teamId: number) {
    this.selectedTeamId.set(teamId);
    this.addMemberError.set(null);
    this.isAddingMember.set(false);
  }

  closeAddMemberModal() {
    this.selectedTeamId.set(null);
    this.addMemberError.set(null);
    this.isAddingMember.set(false);
  }

  openCreateTeamModal() {
    this.isCreateTeamModalOpen.set(true);
  }

  closeCreateTeamModal() {
    this.isCreateTeamModalOpen.set(false);
  }

  onAddMemberSubmit(userIdInput: string) {
    const teamId = this.selectedTeamId();
    if (!teamId) return;

    const userId = Number(userIdInput);
    if (isNaN(userId)) {
      this.addMemberError.set('Invalid User ID');
      return;
    }

    if (userId > 4) {
      this.addMemberError.set('User ID does not exist');
      this.notificationService.showError('User ID does not exist');
      return;
    }

    this.isAddingMember.set(true);
    this.addMemberError.set(null);

    // Capture initial count
    const currentTeam = this.state().teams.find(t => t.id === teamId);
    const initialCount = currentTeam ? currentTeam.memberCount : 0;

    this.teamsService.addTeamMember(teamId, { userId })
      .pipe(
        switchMap(() => this.teamsService.getTeams())
      )
      .subscribe({
        next: (teams) => {
          const updatedTeam = teams.find(t => t.id === teamId);
          const newCount = updatedTeam ? updatedTeam.memberCount : 0;

          this.closeAddMemberModal();

          if (newCount > initialCount) {
            this.notificationService.showSuccess('Member added successfully!');
          } else {
            this.notificationService.showError('Member already exists');
          }
          
          this.refreshTrigger$.next(); // Reload teams to update member count in the view
        },
      error: (err) => {
        this.isAddingMember.set(false);
        if (err.status === 500) {
           this.addMemberError.set('User ID not found or server error.');
        } else if (err.status === 400 || err.status === 404) {
           this.addMemberError.set('Invalid request. Please check valid User ID.');
        } else if (err.status === 409) {
           this.addMemberError.set('User is already a member.');
        } else {
           this.addMemberError.set('Failed to add member.');
        }
      },
    });
  }

  onCreateTeamSubmit(payload: { name: string; description?: string }) {
    this.teamsService.createTeam(payload).subscribe({
      next: () => {
        this.closeCreateTeamModal();
        this.notificationService.showSuccess('Team created successfully!');
        this.refreshTrigger$.next();
      },
      error: () => {
        this.notificationService.showError('Failed to create team.');
      },
    });
  }
}

