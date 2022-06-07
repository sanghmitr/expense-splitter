import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/shared/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  fullname: string = '';
  phone: string = '';
  email : string = '';
  password: string = '';
  confirm_password: string = '';

  errorString = '';

  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  register() {

    if(this.email == '') {
      this.errorString = 'Email is required';
      return;
    }

    if(this.fullname == '') {
      this.errorString = 'Name is required';
      return;
    }

    if(this.password == '') {
      //alert('Please enter password');
      this.errorString = 'Password is required';
      return;
    }

    if (this.confirm_password != this.password) {
      //alert('Password and confirm password does not match');
      this.errorString = 'Password and confirm password does not match';
      return;
    }

    this.auth.register(this.email,this.password, this.fullname, this.phone);
    
    this.email = '';
    this.password = '';
    this.confirm_password = '';
  }

}
