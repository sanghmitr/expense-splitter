import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';



@Injectable({
  providedIn: 'root'
})
export class UserService implements Resolve<any>{

  users: User[] = [];
  currentuser: User = {} as User;

  constructor(private router: Router, public db: AngularFirestore) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.getCurrentUser();
  }

  
  //Get all users data from firestore
  async getAllUser() {
    await this.db.collection('users').snapshotChanges().subscribe(res => {
      res.forEach(a => {
        let item: any = a.payload.doc.data();
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
  async getCurrentUser() {
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid = localStorageuser.uid;
      console.log("Local storage uid is : ", uid);
    
      return await (await this.db.collection('users').doc(uid).ref.get()).data();
    }
  }



  // async getMarker(){
  //   let item = localStorage.getItem('Token');
  //   if (item) {
  //     let localStorageuser = JSON.parse(item);
  //     let uid = localStorageuser.uid;
  //     console.log("Local storage uid is : ", uid);

  //     const snapshot = await this.db.collection('users').doc(uid).ref.get().then((doc) => {
  //       if (doc.exists) {
  //         // this.currentuser = doc.data();
  //         console.log(doc.data());
  //       }
  //       else {
  //         console.log("Data not found");
  //       }
        
  //     }, err => {
  //       console.log(err);
  //     });
  //     return snapshot;
  //   }
  // }
  
  getAllTransactions() {
    this.db.collection('transactions').snapshotChanges().subscribe(res => {
      res.forEach(a => {
        let item: any = a.payload.doc.data();
        console.log(item);
        item.id = a.payload.doc.id;
      });
    });
  }

  //Check if user exists in firestore
  async checkIfUserExists(email: string) { 
    const snapshot = await this.db.collection('users').ref.where('email', '==', email).get().then((doc) => {
      if (doc.empty) {
        console.log("User not found");
        return false;
      }
      else {
        console.log("User found");
        return true;
      }
    });
    console.log("Snapshot is : ", snapshot.valueOf.toString());
    console.log("printing after fetching data")
  }


 

  async getUserId(email: string) {
    
    return this.db.collection('users').ref.where('email', '==', email.toLowerCase()).get()
  }
}

