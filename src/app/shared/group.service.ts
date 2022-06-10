import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreDocument } from '@angular/fire/compat/firestore/';

import { Group } from '../models/group';
import { User } from '../models/user';

@Injectable({
  providedIn: 'root'
})
export class GroupService {

  groups: Group[] = [];
  
  constructor(private db: AngularFirestore) { 
    
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

  //Create group in firestore
  async createGroup(grp: any) { 
    return await this.db.collection('groups').doc(grp.gid).set(grp).then(res => { 
      console.log(res);
    }, err => { 
      console.log(err);
    });
  }


  async addGroupIdToUser(userId: string) { 
    const res = await this.db.collection('users').doc(userId).ref.get().then(doc => {
      console.log(doc.data);
    });
    console.log("user details", res);
    // const unionRes = await userRef.update({
    //   groups: firebase.firestore.FieldValue.arrayUnion(groupId) as unknown as string[]
    // });
  }



  // //Add userId to group members
  // async addUserToGroup(groupId: string, userId: string) { 

  // }

  //Find all groups in which user is a member
  async getUserGroups(userId: string) { 
    return await this.db.collection('groups')
      .ref.where('members', 'array-contains', userId).get();
  }

  
  
}
