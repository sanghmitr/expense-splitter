import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore/';

import {
   Firestore, addDoc, collection, collectionData,
  doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, FieldValue, arrayUnion
} from '@angular/fire/firestore';


import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';

import { Observable } from 'rxjs';

import { Group } from '../models/group';
import { User } from '../models/user';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  groups: Group[] = [];
  
  constructor(private db: AngularFirestore, private fst : Firestore, private userService : UserService) { 
    
  }

  //Get all groups data from firestore
  async getAllGroup() {
    return await this.db.collection('groups').snapshotChanges().subscribe(res => { 
      res.forEach(a => {
        let item : any = a.payload.doc.data();
        //console.log(item);
        item.id = a.payload.doc.id;
        this.groups.push(item);
      });
    });
  }

  //Get all groups of currentUser
  async getAllGroupsOfCurrentUser() {
    let groups : Group[] = [];
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid : string = localStorageuser.uid;
      await this.getUserGroups(uid).then(res => {
        res.forEach(doc => {
          //console.log("Group : ", doc.data());
          this.groups.push(doc.data() as Group);
        });
      });
    }
    return this.groups;
  }

  getGroupById(id: string) { 
    const userRef = doc(this.fst, `groups/${id}`);
    return docData(userRef, {idField : 'gid'}) as Observable<Group>;
  }

  //Create group in firestore
  async createGroup(grp: any) { 
    return await this.db.collection('groups').doc(grp.gid).set(grp).then(res => { 
      console.log(res);
    }, err => { 
      console.log(err);
    });
  }


  async addGroupIdToUser(userId: string,  groupId: string)  { 
    const userRef = this.db.collection('users').doc(userId);
    return await userRef.update({ groups: arrayUnion(groupId) });
  }

  //Add user to group
  async addUserToGroup(groupId: string, uid : string) { 
    console.log("group id : ", groupId);
    const groupRef = this.db.collection('groups').doc(groupId);
    return await groupRef.update({ members: arrayUnion(uid) });
 }

  //Find all groups in which user is a member
  async getUserGroups(userId: string) { 
    return await this.db.collection('groups')
      .ref.where('members', 'array-contains', userId).get();
  }


  getCurrentUserGroups() : Group[] {
    let currentUserId = this.userService.getloggedUserId();
    let currentUser!: User;
    this.userService.getUserById(currentUserId).subscribe(res => { 
      currentUser = res;
    })
    
    let groups : Group[] = [];
    for(let groupId of currentUser.groups) {
      //console.log("group : ", groupId);
      this.getGroupById(groupId).subscribe(res => { 
        groups.push(res);
      })
    }
    return groups;
  }

  getloggedUserId() {
    let token = localStorage.getItem('Token');
    if (token) {
      let localStorageuser = JSON.parse(token);
      return localStorageuser.uid;
    }
  }
  
  
}
