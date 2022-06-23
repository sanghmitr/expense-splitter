import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Expense } from '../models/expense';
import {
  Firestore, addDoc, collection, collectionData,
 doc, docData, deleteDoc, updateDoc, DocumentReference, setDoc, FieldValue, arrayUnion
} from '@angular/fire/firestore';
import { Transaction } from '../models/transactions';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TransactionService {

  constructor(private db: AngularFirestore, private firestore: Firestore) { }
  
  //Add new transaction
  addTransactionWithId(transaction: Transaction) { 
    this.db.collection('transactions').doc(transaction.tid).set(transaction).then(res => { 
      console.log("Transaction added ", res);
    })
  }

  //Add Transactions
  addTransactions(transactions: Transaction[]) { 
    transactions.forEach(transaction => { 
      this.db.collection('transactions').doc(transaction.tid).set(transaction).then(res => { 
        console.log("Transaction added ", res);
      })
    }
    )
  }

  //Get all transactions of a group
  getAllTransactionsOfGroup(groupid: string) : any{ 
    return this.db
      .collection('transactions', (ref) => ref.where('groupId', '==', groupid))
      .valueChanges();
  }
}
