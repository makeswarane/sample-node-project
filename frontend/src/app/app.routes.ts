import { Routes } from '@angular/router';
import { authGuard } from './common/guards/auth.guard';
import { loginGuard } from './common/guards/login.guard';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', canActivate: [loginGuard],loadComponent: () => import('./components/login/login.component').then(comp => comp.LoginComponent), data: { preload: true } },
    { path: 'signup', canActivate: [loginGuard], loadComponent: () => import('./components/signup/signup.component').then(comp => comp.SignupComponent), data: { preload: true } },
    { path: 'forgetpassword', redirectTo: 'forgetpassword/verify-email', pathMatch: 'full' },
    {
        path: 'forgetpassword', loadComponent: () => import('./components/forgetpassword/forgetpassword.component').then(comp => comp.ForgetpasswordComponent), data: { preload: true }, children: [
            { path: 'verify-email', loadComponent: () => import('./components/forgetpassword/components/verifyemail/verifyemail.component').then(comp => comp.VerifyemailComponent), data: { preload: true } },
            { path: 'update', loadComponent: () => import('./components/forgetpassword/components/updatepassword/updatepassword.component').then(comp => comp.UpdatepasswordComponent), data: { preload: true } }
        ]
    },
    {
        path: 'app', canActivate: [authGuard], loadComponent: () => import('./components/navbar/navbar.component').then(comp => comp.NavbarComponent), data: { preload: true } , children: [
        { path: 'home', loadComponent: () => import('./components/home/home.component').then(comp => comp.HomeComponent), data: { preload: true } }
    ]},
    { path: '**', loadComponent: () => import('./components/pagenotfound/pagenotfound.component').then(comp => comp.PagenotfoundComponent), data: { preload: true } }
];
