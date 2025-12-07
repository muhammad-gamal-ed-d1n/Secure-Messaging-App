import { Routes } from '@angular/router';
import { Login } from './auth/login/login';
import {ChatInterface} from "./chat-interface/chat-interface"
import { AuthGuard } from './auth/auth service/AuthGuard';

export const routes: Routes = [
    {path: "login", component: Login},
    {path: "app", component: ChatInterface, canActivate: [AuthGuard]},
    {path: "", redirectTo: "login", pathMatch: 'full'},
  {path:"**",redirectTo:"login"}
];
