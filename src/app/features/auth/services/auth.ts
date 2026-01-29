import { Injectable } from '@angular/core';
import { Observable, map, tap } from 'rxjs';

import { ApiClient } from '../../../core/services/api-client';
import { TokenStorage } from '../../../core/services/token-storage';

import { AuthResponse, LoginRequest, RegisterRequest } from '../../../shared/models/api-response.model';


@Injectable({ providedIn: 'root' })
export class AuthService {

  private readonly loginPath = 'auth/login';
  private readonly registerPath = 'auth/register';

  constructor(
    private readonly api: ApiClient,
    private readonly tokenStorage: TokenStorage
  ) {}


  login(credentials: LoginRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(this.loginPath, credentials).pipe(
      tap((res) => {
     
        this.tokenStorage.setToken(res.token);
      })
    );
  }


  register(payload: RegisterRequest): Observable<AuthResponse> {
    return this.api.post<AuthResponse>(this.registerPath, payload).pipe(
      tap((res) => {
        this.tokenStorage.setToken(res.token);
      })
    );
  }


  logout(): void {
    this.tokenStorage.logout();
  }


  isAuthenticated(): boolean {
    return !!this.tokenStorage.getToken();
  }

  getToken(): string | null {
    return this.tokenStorage.getToken();
  }
}