import { Injectable } from '@angular/core';
import { ApiClient } from '../../../core/services/api-client';
import { CreateTeamRequest, AddTeamMemberRequest, Team } from '../../../shared/models';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TeamsService {
  constructor(private readonly api: ApiClient) {}

  getTeams(): Observable<Team[]> {
    return this.api.get<any[]>('teams').pipe(
      map(teams => teams.map(team => ({
        id: team.id,
        name: team.name,
        description: team.description,
        ownerId: team.owner_id,
        createdAt: team.created_at,
        memberCount: team.members_count || 0
      } as Team)))
    );
  }

  createTeam(payload: CreateTeamRequest): Observable<Team> {
    return this.api.post<Team>('teams', payload);
  }

  addTeamMember(teamId: number, payload: { userId: number, role?: 'member' | 'admin' }): Observable<void> {
    const requestPayload: AddTeamMemberRequest = {
      userId: payload.userId,
      role: payload.role || 'member'
    };
    return this.api.post<void>(`teams/${teamId}/members`, requestPayload);
  }
}

