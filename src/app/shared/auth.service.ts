import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/compat/firestore/';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  userobj: User = {
    uid: '',
    email: '',
    phone: '',
    fullName: '',
    photoURL: '',
    balance: 0
  };

  errorResult: string = '';
  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore : AngularFirestore) { 
    
  }


  //login Method
  login(email: string, password: string) {
    this.fireauth.signInWithEmailAndPassword(email, password).then(res => {
      //this.router.navigate(['dashboard']);

      if(res.user?.emailVerified == true) {
        this.router.navigate(['dashboard']);
        localStorage.setItem('Token', JSON.stringify(res.user));
      } else {
        this.router.navigate(['verify-email']);
      }
    })
      .catch(err => {
        //alert(err.message);
        Swal.fire(
          {
            title: 'Error',
            text: 'Invalid Credentials or User does not exist', 
          }
        )
        this.errorResult = err.message;
        this.router.navigate(['/login']);
      });
    return this.errorResult;
  }

  //Register Method
  register(email: string, password: string, fullname : string, phone : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.sendEmailVerification(res.user);
        console.log(res.user);
        if(res.user)
        {
          this.userobj.uid = res.user.uid;
          this.userobj.email = res.user.email == null ? '' : res.user.email.toLowerCase();
          this.userobj.fullName = fullname;
          this.userobj.phone = phone;
          this.userobj.photoURL = res.user.photoURL == null ? '' : res.user.photoURL;
          this.userobj.balance = 0;
          this.createUser(this.userobj);

          
        }
        
        this.router.navigate(['/verify-email']);
      },
        err => {
          // alert(err.message);
        
          Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: err.message,
          })
          this.errorResult = err.message;
          this.router.navigate(['/register']);
        }
      )
    return this.errorResult;
  }
  
  //create user in firestore, If already exists merge data
  createUser(user: User) { 
    this.firestore.collection('users').doc(user.uid).set(user).then(res => {
      console.log(res);
    })

    // Add Email Mapping in firestore
    this.firestore.collection('email-mappings').doc(user.email).set({ uid : user.uid }).then(res => {
      console.log("Email mapping added",res);
    })
  }

  //Logout Method
  logout() {
    this.fireauth.signOut().then(() => {
      localStorage.removeItem('Token');
      this.router.navigate(['/login']);
    },
      err => {
        alert(err.message);
      })
  }


  forgotPassword(email: string) {
    this.fireauth.sendPasswordResetEmail(email).then(() => {
      this.router.navigate(['/verify-email']);
    }, err => {
      Swal.fire(
        'Oops...',
        err.message,
      )
    })
  }

  //email verification
  sendEmailVerification(user: any) {
    user.sendEmailVerification().then(() => {
      Swal.fire(
        'Email sent!',
        'Please check your email to verify your account.',
        'success'
      )
    }, (err: any) => {
      Swal.fire(
        'Oops...',
        err.message,
      )
    })
  }


  //Sign-In with google
  googleSignIn() {
    this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(res => {
      this.router.navigate(['dashboard']);
      localStorage.setItem('Token', JSON.stringify(res.user));
      if(res.user)
        {
          this.userobj.uid = res.user.uid;
          this.userobj.email = res.user.email == null ? '' : res.user.email.toLowerCase();
          this.userobj.fullName = res.user.displayName == null ? '' : res.user.displayName;
          this.userobj.phone = '';
          this.userobj.photoURL = res.user.photoURL == null ? '' : res.user.photoURL;
          this.userobj.balance = 0;
          this.createUser(this.userobj);
        }
      console.log(res.user);
    }, err => {
      if (err.code == 'auth/popup-closed-by-user') {
        return;
      }
      else {
        Swal.fire(
          'Oops...',
          err.message,
        )
      }
    })
  }


}
