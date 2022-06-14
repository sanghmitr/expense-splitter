import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { Router, Resolve, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import {
  Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, FieldValue,
} from '@angular/fire/firestore';
import * as firebase from 'firebase/app';

@Injectable({
  providedIn: 'root'
})
export class UserService implements Resolve<any>{

  users: User[] = [];
  currentuser: User = {} as User;
  user: User = {
    uid: '',
    email: '',
    phone: '',
    fullName: '',
    photoURL: '',
    balance: 0,
    groups : []
  }


  constructor(private router: Router, public db: AngularFirestore, private firestore: Firestore) {

  }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    return this.getCurrentUser();
  }

  //Get all users from firestore
  getAllUsers() {
    const usersRef = collection(this.firestore, 'users');
    return collectionData(usersRef, { idField: 'uid' }) as Observable<User[]>;
  }

  //Get user by id from firestore
  getUserById(id: string) { 
    const userRef = doc(this.firestore, `users/${id}`);
    return docData(userRef, {idField : 'uid'}) as Observable<User>;
  }

  //Get user by email from firestore
  getUserByEmail(email: string) { 
    return this.db.collection('users').ref.where('email', '==', email.toLowerCase()).get();
    
    // After that consume this response at component
    /* .then((doc) => { 
      if(doc.empty) {
        return null;
      } else {
        return doc.docs[0].data();
      }
    });
    */
  }

  //Add user to firestore when we don't have a user id
  addUserWithoutKnownUid(user : User) {
    const usersRef = collection(this.firestore, 'users');
    return addDoc(usersRef, user);
  }

  //Add user to firestore
  addUserWithKnownUid(user: User) { 
    this.db.collection('users').doc(user.uid).set(user).then(res => {
      console.log(res);
    })
  }

  //Update user in firestore
  updateUser(user: User) { 
    const userRef = doc(this.firestore, `users/${user.uid}`);
    return setDoc(userRef, user);
  }

  //Update photoURL in firestore
  updatePhotoURL(photoURL: string, uid: string) { 
    const userRef = doc(this.firestore, `users/${uid}`);
    return updateDoc(userRef, {photoURL : photoURL});
  }

  //Add Group in user's groups array
  addGroupToUserDoc(gid: string, userId: string) {
    let tUser : User = {} as User;
    const tempUser = this.getUserById(userId).subscribe(user => {
      tUser = user;
      tUser.groups.push(gid);
    });
    const userRef = doc(this.firestore, `users/${userId}`);
    updateDoc(userRef, {groups : tUser.groups});
  }
   
    // this.getUserById(userId).subscribe(user => {
    //   const userRef = doc(this.firestore, `users/${userId}`);
    //   return updateDoc(userRef, {groups : [...user.groups, gid]});
    // });
  // }
  
  //Get loggedIn user Id from local storage
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

  //Get current user data from firestore
  async getCurrentUser()  {
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid = localStorageuser.uid;
      console.log("Local storage uid is : ", uid);
      return await (await this.db.collection('users').doc(uid).ref.get()).data();
    }
    // return this.getUserById(uid);
  }

  getCurrentUserIdOnly(): string {
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid = localStorageuser.uid;
      console.log("Local storage uid is : ", uid);
      return uid;
    }
    else
      return '';
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

