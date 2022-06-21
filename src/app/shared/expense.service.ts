import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Expense } from '../models/expense';
import { Observable } from 'rxjs';
import {
  Firestore, addDoc, collection, collectionData,
 doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, FieldValue, arrayUnion
} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {

  constructor(private db : AngularFirestore, private firestore : Firestore) { }

  //Get all expense details of a group
  getExpenseList(groupId: string) : any {
    return this.db.collection('expenses', ref => ref.where('group', '==', groupId)).valueChanges();
  }

  //Add new expense
  addExpenseWithId(expense: Expense) { 
    this.db.collection('expenses').doc(expense.eid).set(expense).then(res => {
      console.log("Expense added ", res);
    })
  }


}
