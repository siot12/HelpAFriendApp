import { Routes } from '@angular/router';
import {UserList} from './components/user-list/user-list';
import {UserDetails} from './components/user-details/user-details';

export const routes: Routes = [
  { path: '', component: UserList },
  { path: 'user/:login', component: UserDetails },
  { path: '**', redirectTo: '' }
];
