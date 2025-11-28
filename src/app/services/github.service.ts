import {Injectable, inject, signal} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { GithubUser, GithubRepo } from '../models/github.models';

@Injectable({
  providedIn: 'root'
})
export class GithubService {

  private http = inject(HttpClient);
  private apiUrl = 'https://api.github.com';

  usersSignal = signal<GithubUser[]>([]);
  private hasLoadedInitialData = false;

  getUsers(since: number = 0): Observable<GithubUser[]> {
    return this.http.get<GithubUser[]>(`${this.apiUrl}/users?per_page=10&since=${since}`).pipe(
      tap(newUsers => {
        const existingIds = new Set(newUsers.map(u => u.id));
        const uniqueNewUsers = newUsers.filter(u => !existingIds.has(u.id));
        this.usersSignal.update(current => [...current, ...uniqueNewUsers]);
        this.hasLoadedInitialData = true;
      })
    );
  }

  hasData(): boolean {
    return this.hasLoadedInitialData;
  }

  getUserDetails(username: string): Observable<GithubUser> {
    return this.http.get<GithubUser>(`${this.apiUrl}/users/${username}`);
  }

  getUserRepos(username: string): Observable<GithubRepo[]> {
    return this.http.get<GithubRepo[]>(`${this.apiUrl}/users/${username}/repos`);
  }
}
