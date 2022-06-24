import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider, GithubAuthProvider, FacebookAuthProvider } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import Swal from 'sweetalert2';
import { User } from '../models/user';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { UserService } from './user.service';

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
    balance: 0,
    groups : []
  };

  errorResult: string = '';
  constructor(private fireauth: AngularFireAuth, private router: Router, private firestore : AngularFirestore, private userService : UserService) { 
    
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
        if (err.code == 'auth/invalid-email' || err.code == 'auth/wrong-password') {
          Swal.fire({ text: 'Invalid Email or Password', })
        }
        else if (err.code == 'auth/user-not-found') { 
          Swal.fire({ text: 'User not found', })
        }
        this.router.navigate(['/login']);
      });
    return this.errorResult;
  }

  //Register Method
  register(email: string, password: string, fullname : string, phone : string) {
    this.fireauth.createUserWithEmailAndPassword(email, password)
      .then(res => {
        this.sendEmailVerification(res.user);
        //console.log(res.user);
        if (res.user) {
          this.userobj.uid = res.user.uid;
          this.userobj.email = res.user.email == null ? '' : res.user.email.toLowerCase();
          this.userobj.fullName = fullname;
          this.userobj.phone = phone;
          this.userobj.photoURL = res.user.photoURL == null ? '' : res.user.photoURL;
          this.userobj.balance = 0;
          this.userobj.groups = []

          this.userService.addUserWithKnownUid(this.userobj);
        }
        this.router.navigate(['/verify-email']);
      },
        err => {
          // alert(err.message);
          if (err.code == 'auth/email-already-in-use') {
            Swal.fire({
              text: 'Email already in use Or Already Signed with Google',
            })
            this.errorResult = err.message;
            this.router.navigate(['/register']);
          }
          else if (err.code == 'auth/invalid-email') {
            Swal.fire({ text: 'Invalid Email', })
          }
          else if (err.code == 'auth/weak-password') {
            Swal.fire({ text: 'Weak Password - Password must be 6 character or more', })
          }
          else if (err.code == 'auth/operation-not-allowed') {
            Swal.fire({ text: 'Email not verified', })
          }
        });
  }
  
  //create user in firestore, If already exists merge data
  createUser(user: User) { 
    this.firestore.collection('users').doc(user.uid).set(user).then(res => {
      //console.log(res);
    })

    // Add Email Mapping in firestore
    this.firestore.collection('email-mappings').doc(user.email).set({ uid : user.uid }).then(res => {
      //console.log("Email mapping added",res);
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

  // tempUser!: User;
  //Sign-In with google
  googleSignIn() {
    this.fireauth.signInWithPopup(new GoogleAuthProvider()).then(res => {
      this.router.navigate(['dashboard']);
      localStorage.setItem('Token', JSON.stringify(res.user));
      //console.log("login using google-sign in ", res.user);
      //console.log(res);

      if (res.additionalUserInfo?.isNewUser == true)
      {
          if (res.user != null) {

          this.userobj.uid = res.user.uid;
          this.userobj.email = res.user.email == null ? '' : res.user.email.toLowerCase();
          this.userobj.fullName = res.user.displayName == null ? '' : res.user.displayName;
          this.userobj.phone = '';
          this.userobj.photoURL = res.user.photoURL == null ? '' : res.user.photoURL;
          this.userobj.balance = 0;
          this.userobj.groups = []
      
          this.userService.addUserWithKnownUid(this.userobj);
        }
      }
      else {
        let photoURL = res?.user?.photoURL == null ? '' : res.user.photoURL;
        let userId = res?.user?.uid == null ? '' : res.user.uid;
        this.userService.updatePhotoURL(photoURL, userId);
      }
      
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
      });
  }


}
