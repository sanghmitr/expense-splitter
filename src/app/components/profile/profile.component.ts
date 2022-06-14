import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/user.service';
import { User } from '../../models/user';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private userService : UserService, private route: ActivatedRoute) { }

  currentUser: User = {
    uid: '',
    email: '',
    phone: '',
    fullName: '',
    photoURL: '',
    balance: 0,
    groups: []
  };
  
  ngOnInit(): void {
    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.currentUser = data;
      }
    });
  }

}
