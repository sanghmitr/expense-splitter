import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-api-testing',
  templateUrl: './api-testing.component.html',
  styleUrls: ['./api-testing.component.scss']
})
export class ApiTestingComponent implements OnInit {

  user: User = {
    uid: this.getloggedUserId(),
    email: 'demouser@gmail.com',
    balance: 0,
    fullName: 'Demo User',
    phone: '1234567890',
    photoURL: '',
    groups: []
  };

  tempUser!: User
  
  constructor(private userService : UserService) { }

  getloggedUserId() { 
    let token = localStorage.getItem('Token');
    if (token) { 
      let localStorageuser = JSON.parse(token);
      let uid: string = localStorageuser.uid;
      return uid;
    }
    else {
      console.log("No Token available");
      return '';
    }
  }

  ngOnInit(): void {

  }

  async getUser() { 
    let uid = this.getloggedUserId();
    if (uid) { 
      this.userService.getUserById(uid).subscribe(res => {
        this.tempUser = res;
        console.log("user fetch by Id : ", res);
      });
    }
  }

  async getUserByEmail() { 
    let email = 'sanghmitr.tamrakar@gmail.com'
    this.userService.getUserByEmail(email).then(res => { 
      this.tempUser = res.docs[0].data() as User;
      console.log("user fetch by email : ", res.docs[0].data());
    }, err => { 
      console.log("Unable to fetch user by email : ", err);
    })
  }

  addUser() {
    this.user.uid = '1234'
    this.userService.addUserWithKnownUid(this.user);
  }

  updateUser() { 
    this.user.balance = 100;
    this.userService.updateUser(this.user);
  }

  addGroupToUserDoc() { 
    this.userService.addGroupToUserDoc('123', this.user.uid);
  }

}
