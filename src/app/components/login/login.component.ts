import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../shared/auth.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  email: string = '';
  password: string = '';
  errorResult: string = '';
  isAuthenticationError: boolean = false;
  
  constructor(private auth : AuthService) { }

  ngOnInit(): void {
  }

  login() { 
    if (this.email == '') {
      Swal.fire('Please enter your email');
      return;
    }

    if (this.password == '') { 
      Swal.fire('Please enter your password');
      return;
    }

    this.errorResult = this.auth.login(this.email, this.password);
    if (this.errorResult != '') {
      this.isAuthenticationError = true;
    }
    
    this.email = '';
    this.password = '';
  }
  
  forgotPassword() { 
    this.auth.forgotPassword(this.email);
  }
  

  googleSignIn() {
    //this.auth.googleLogin();
    this.auth.googleSignIn();
    
  }
}
