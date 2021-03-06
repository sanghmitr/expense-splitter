import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';


import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';


// Import the functions you need from the SDKs you need

import { AngularFirestoreModule } from '@angular/fire/compat/firestore/'; 

import { environment } from '../environments/environment';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from './common/header/header.component';
import { SidebarComponent } from './common/sidebar/sidebar.component';
import { FooterComponent } from './common/footer/footer.component';

import {FlexLayoutModule} from '@angular/flex-layout';
import { MatDividerModule } from '@angular/material/divider';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatListModule } from '@angular/material/list';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatDialogModule } from '@angular/material/dialog';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import {MatRadioModule} from '@angular/material/radio';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';


import { ForgotPasswordComponent } from './components/forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './components/verify-email/verify-email.component';
import { ProfileComponent } from './components/profile/profile.component';
import { GroupComponent } from './components/group/group.component';
import { GroupDetailsComponent } from './components/group-details/group-details.component';

import { ApiTestingComponent } from './components/api-testing/api-testing.component';
import { GrouplistComponent } from './components/grouplist/grouplist.component';
import { GroupDetailsResolve } from './components/group-details/group-details.resolve';
import { GroupService } from './shared/group.service';
import { PathNotFoundComponent } from './components/path-not-found/path-not-found.component';


import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { provideAuth,getAuth } from '@angular/fire/auth';
import { provideFirestore,getFirestore } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { DatePipe } from '@angular/common';
import { MemberslistComponent } from './components/memberslist/memberslist.component';
import { firstValueFrom, isObservable, Observable } from 'rxjs';
import { ExpenseslistComponent } from './components/expenseslist/expenseslist.component';
import { AddexpenseComponent } from './components/addexpense/addexpense.component';
import { ImageFallbackDirective } from './common/image-fallback.directive';
import { ExpenseDetailsComponent } from './components/expense-details/expense-details.component';



@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,

    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    ForgotPasswordComponent,
    VerifyEmailComponent,
    ProfileComponent,
    GroupComponent,
    GroupDetailsComponent,
    ApiTestingComponent,
    GrouplistComponent,
    PathNotFoundComponent,
    MemberslistComponent,
    ExpenseslistComponent,
    AddexpenseComponent,
    ImageFallbackDirective,
    ExpenseDetailsComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,

    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // firestore
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),

    MatDividerModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    FlexLayoutModule,
    MatMenuModule,
    MatListModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatCardModule,
    MatButtonModule,
    MatSidenavModule,
    MatDialogModule,
    ScrollingModule,
    MatTabsModule,
    MatSelectModule,
    MatRadioModule,
    MatInputModule,
    MatCheckboxModule,
  ],
  providers: [GroupService, GroupDetailsResolve, DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {
  async waitFor<T>(prom: Promise<T> | Observable<T>): Promise<T> {
    if (isObservable(prom)) {
      prom = firstValueFrom(prom);
    }
    const macroTask = Zone.current.scheduleMacroTask(
      `WAITFOR-${Math.random()}`,
      () => {},
      {},
      () => {}
    );
    return prom.then((p: T) => {
      macroTask.invoke();
      return p;
    });
  }
}
