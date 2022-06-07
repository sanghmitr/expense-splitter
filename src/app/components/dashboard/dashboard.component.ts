import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import { Router } from '@angular/router';
import * as firebase from 'firebase/compat';
import { getAuth } from '@angular/fire/auth';
import { UserService } from '../../shared/user.service';
import { User } from 'src/app/models/user';
import { collectionData } from '@angular/fire/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  sideBarOpen = true;
  
  currentUser$!: Promise<any>;
  
  constructor(private authService: AuthService, private router: Router, private userService: UserService) { 
    //this.userService.getUser();
  }

  ngOnInit(): void {
    this.getUser();
    console.log("Inside ngOnInit : ", this.currentUser$);
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
    // await this.userService.getUser().then(data => {
    //   //console.log(data);
    //   this.currentUser = data;
    //   return this.currentUser;
    // });
    // //console.log("Inside component : ", this.currentUser);
    
    this.currentUser$ = this.userService.getUser();
  }


}
