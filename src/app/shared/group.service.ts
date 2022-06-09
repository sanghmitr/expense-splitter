import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore/';
import { Group } from '../models/group';

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
  

  
  

}
