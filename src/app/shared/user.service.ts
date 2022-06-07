import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router } from '@angular/router';
import { AngularFirestore} from '@angular/fire/compat/firestore';
import { observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class UserService {


  users: User[] = [];
  currentuser: any;

  constructor(private router: Router, public db: AngularFirestore) {

  }
  
  //Get current user data from firestore
  async getAllUser() {    
    await this.db.collection('users').snapshotChanges().subscribe(res => { 
      res.forEach(a => {
        let item : any = a.payload.doc.data();
        //console.log(item);
        item.id = a.payload.doc.id;
        this.users.push(item);
      });
    });

    this.users.forEach(u => {
      console.log("UserId : ", u.uid);
      console.log("UserEmail : ", u.email);
      console.log("UserPhone : ", u.phone);
      console.log("UserFullName : ", u.fullName);
      console.log("UserPhotoURL : ", u.photoURL);
      console.log("UserBalance : ", u.balance);
      console.log("---------------------------------");
    });
   }
   
  
  //Get current user data from firestore
  async getUser() {
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid = localStorageuser.uid;
      console.log("Local storage uid is : ", uid);
    
      await this.db.collection('users').doc(uid).snapshotChanges().subscribe(res => {
        let item: any = res.payload.data();
        item.id = res.payload.id;
        console.log(item);
        this.currentuser = item;
      });
      return this.currentuser;
    }
  }

  // getCurrentUser() : any {
  //   let item = localStorage.getItem('Token');
  //   if (item) {
  //     let localStorageuser = JSON.parse(item);
  //     let uid = localStorageuser.uid;
  //     console.log("Local storage uid is : ", uid);

  //     return this.db.collection('users').doc(uid).get().docs().map(doc =>
  //       console.log(doc.data())
  //     );
  //   }
  // }


  async getMarker(){
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid = localStorageuser.uid;
      console.log("Local storage uid is : ", uid);

      const snapshot = await this.db.collection('users').doc(uid).ref.get().then((doc) => {
        if (doc.exists) {
          // this.currentuser = doc.data();
          console.log(doc.data());
        }
        else {
          console.log("Data not found");
        }
        
      }, err => {
        console.log(err);
      });
      return snapshot;
    }
  }
  
  getAllTransactions() {
    this.db.collection('transactions').snapshotChanges().subscribe(res => { 
      res.forEach(a => {
        let item: any = a.payload.doc.data();
        console.log(item);
        item.id = a.payload.doc.id;
      });
    });
  }
}
  

