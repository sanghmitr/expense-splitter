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
import { ApiTestingComponent } from './components/api-testing/api-testing.component';
import { GroupService } from './shared/group.service';
import { GroupDetailsResolve } from './components/group-details/group-details.resolve';
import { GrouplistResolverGuard } from './guards/grouplist-resolver.guard';
import { PathNotFoundComponent } from './components/path-not-found/path-not-found.component';
import { AddexpenseComponent } from './components/addexpense/addexpense.component';

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
        // resolve: {
        //   data : GrouplistResolverGuard
        // }
        children: [
          
        ]
      },
      {
        path: 'groupdetails/:id', component: GroupDetailsComponent,
        // pathMatch : 'full',
        // resolve: {
        //   groupdata : GroupDetailsResolve
        // }
      },
      {
        path: 'api-testing', component : ApiTestingComponent
      }
    ]
  },
  
  { path: 'verify-email', component: VerifyEmailComponent },
  { path: 'forgot-password', component: ForgotPasswordComponent },
  { path : "**", component : PathNotFoundComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
