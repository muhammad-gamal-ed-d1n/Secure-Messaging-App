import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import { App } from './app';
import { AuthGuard } from './auth/auth service/AuthGuard';

export const routes: Routes = [
    {path: "login", component: Login},
    {path: "app", component: App, canActivate: [AuthGuard]},
    {path: "", component: App, pathMatch: 'full'},
];
