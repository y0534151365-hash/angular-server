import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { API_BASE_URL } from '../../shared/utils/constants';

@Injectable({
  providedIn: 'root',
})
export class ApiClient {


  constructor(private http: HttpClient) {}

  get<T>(endpoint: string, options?: { headers?: HttpHeaders; params?: any }): Observable<T> {
    return this.http.get<T>(`${API_BASE_URL}/${endpoint}`, options);
  }

  post<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(`${API_BASE_URL}/${endpoint}`, body, {
      headers,
    });
  }

  put<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(`${API_BASE_URL}/${endpoint}`, body, {
      headers,
    });
  }

  patch<T>(endpoint: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.patch<T>(`${API_BASE_URL}/${endpoint}`, body, {
      headers,
    });
  }

  delete<T>(endpoint: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(`${API_BASE_URL}/${endpoint}`, {
      headers,
    });
  }
}
