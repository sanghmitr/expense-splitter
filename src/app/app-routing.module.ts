import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { RegisterComponent } from './components/register/register.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { UserService } from './shared/user.service';
import { GroupComponent } from './components/group/group.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';

const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  {
    path: 'dashboard', component: DashboardComponent,
    resolve: {
      data : UserService
    },
    children: [
      {
        path: 'profile', component: ProfileComponent,
        resolve: {
          data : UserService
        }
      },
      {
        path: 'groups', component: GroupComponent,
        children: [
          {
            path: 'groupDetails', component: GroupDetailsComponent,
          }
        ]
      }
    ]
  },
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
