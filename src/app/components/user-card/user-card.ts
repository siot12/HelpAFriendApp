import {Component, input} from '@angular/core';
import {RouterModule} from '@angular/router';
import {GithubUser} from '../../models/github.models';

@Component({
  selector: 'app-user-card',
  imports: [RouterModule],
  standalone: true,
  templateUrl: './user-card.html',
  styleUrl: './user-card.css',
})
export class UserCard {
  user = input.required<GithubUser>();
}
