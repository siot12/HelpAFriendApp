import {Component, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {CommonModule, Location} from '@angular/common';
import {GithubService} from '../../services/github.service';
import {Subscription} from 'rxjs';
import {GithubRepo, GithubUser} from '../../models/github.models';

@Component({
  selector: 'app-user-details',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './user-details.html',
  styleUrl: './user-details.css',
})
export class UserDetails implements OnInit, OnDestroy {

  private githubService = inject(GithubService);
  private location = inject(Location);
  private gitSub!: Subscription;

  login = input<string>('');

  userInfo = signal<GithubUser | null>(null);
  repos = signal<GithubRepo[]>([]);

  ngOnInit(): void {
    const username = this.login();
    if (username) {
      this.gitSub = this.githubService.getUserDetails(username).subscribe(u => this.userInfo.set(u));
      this.gitSub = this.githubService.getUserRepos(username).subscribe(r => this.repos.set(r));
    }
  }

  goBack() {
    this.location.back();
  }

  ngOnDestroy(): void {
    if (this.gitSub) this.gitSub.unsubscribe();
  }


}
