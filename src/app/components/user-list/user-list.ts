import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import {UserCard} from '../user-card/user-card';
import {GithubService} from '../../services/github.service';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-user-list',
  imports: [UserCard],
  standalone: true,
  templateUrl: './user-list.html',
  styleUrl: './user-list.css',
})
export class UserList implements OnInit, AfterViewInit, OnDestroy {

  private githubService = inject(GithubService);
  private gitSub!: Subscription;
  isLoading = signal<boolean>(false);

  @ViewChild('sentinel') sentinel!: ElementRef;
  private observer: IntersectionObserver | null = null;

  ngOnInit(): void {
    if (!this.githubService.hasData()) {
      this.loadUsers();
    }
  }

  ngAfterViewInit() {
    this.setupIntersectionObserver();
  }

  get users() {
    return this.githubService.usersSignal;
  }

  setupIntersectionObserver() {
    const options = {
      root: null,
      threshold: 0.1
    };

    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoading()) {
          this.loadMoreUsers();
        }
      });
    }, options);

    if (this.sentinel) {
      this.observer.observe(this.sentinel.nativeElement);
    }
  }

  loadUsers(sinceId: number = 0): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    this.gitSub = this.githubService.getUsers(sinceId).subscribe({
      next: (newUsers) => {
        this.users.update(current => [...current, ...newUsers]);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Error fetching users', err);
        this.isLoading.set(false);
      }
    });
  }

  loadMoreUsers(): void {
    const currentUsers = this.users();
    const lastId = currentUsers.length > 0 ? currentUsers[currentUsers.length - 1].id : 0;
    if (lastId === 0 && currentUsers.length === 0) {
      this.loadUsers(0);
    } else {
      this.loadUsers(lastId);
    }
  }

  ngOnDestroy() {
    if (this.gitSub) this.gitSub.unsubscribe();
    if (this.observer) {
      this.observer?.disconnect();
    }
  }
}
