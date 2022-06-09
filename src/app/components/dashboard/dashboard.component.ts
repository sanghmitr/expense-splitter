import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';

import { getAuth } from '@angular/fire/auth';
import { UserService } from '../../shared/user.service';
import { User } from 'src/app/models/user';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  sideBarOpen = true;
  
  currentUser: any;
  
  curUser$!: Observable<User>;
  
  constructor(private authService: AuthService, private router: Router, private userService: UserService) { 
    //this.userService.getUser();
    
    //console.log("Inside Constructor : ", this.currentUser);
  }

  ngOnInit() {
    if (localStorage.getItem('Token') === null) { 
      this.router.navigate(['/login']);
    }
    this.getUser().then(() => {
      console.log("Inside Dashboard Oninit : ", this.currentUser);
    });
  }

  sideBarToggler() {
    this.sideBarOpen = !this.sideBarOpen;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  loggedInUser() {
    const auth = getAuth();
    const user = auth.currentUser;

    console.log(user);
  }

  async getUser() {
    await this.userService.getCurrentUser().then(res => { 
      //console.log(res);
      this.currentUser = res;
    });
    //console.log("Inside Component : ", this.currentUser);
  }


}
