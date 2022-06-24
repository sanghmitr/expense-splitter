import { Component, Input, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { category } from 'src/app/models/category.enum';
import { Expense } from 'src/app/models/expense';
import { Group } from '../../models/group';
import { GroupService } from '../../shared/group.service';
import { AppModule } from '../../app.module';
import { UserService } from '../../shared/user.service';
import { User } from 'src/app/models/user';
import { share } from 'src/app/models/share';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Transaction } from '../../models/transactions';
import { ExpenseService } from '../../shared/expense.service';
import { TransactionService } from '../../shared/transaction.service';
import { splitwise } from '../../utils/split';


@Component({
  selector: 'app-expenseslist',
  templateUrl: './expenseslist.component.html',
  styleUrls: ['./expenseslist.component.scss'],
})
export class ExpenseslistComponent implements OnInit {
  curuser = '';
  curusername = '';
  addbuttonClicked: boolean = false;
  groupid: string = '';
  groupDetails!: Group;
  groupMembers: User[] = [];
  group: any;
  newExpense!: Expense;

  title: string = '';
  paidby = '';
  categories: Array<string> = Object.keys(category).filter((key) =>
    isNaN(+key)
  );
  selectedCategory: string = '';
  total_amount: number = 0;
  enteredTotal: number = 0;
  enteredPercentage: number = 0;

  sharesType = ['Equal', 'Exact'];
  selectedShareType = 'Equal';

  shares: share[] = [];
  selectedShares: share[] = [];

  expensesList: Expense[] = [];

  allTransactions: Transaction[] = [];
  newTransactionsList: any[] = [];
  simplifiedTransactions: any[] = [];
  totalGroupExpenditure: number = 0;
  currentUserExpenditure: number = 0;
  currentUserSimplifiedExpenditure: number = 0;

  constructor(
    private router: ActivatedRoute,
    private router2: Router,
    private groupService: GroupService,
    private appModule: AppModule,
    private userService: UserService,
    private expenseService: ExpenseService,
    private transactionService: TransactionService
  ) {}

  ////////////////////////////////////////////////////////////////////////////////
  async ngOnInit() {
    this.groupid = this.router.snapshot.params['id'];
    let p = this.groupService.getGroupById(this.groupid);
    await this.appModule.waitFor(p).then((res) => {
      this.group = res;
      //console.log('Group Details inside expenselist : ', this.group);
    });

    //Get all group Member details
    let uids = this.group.members;
    for (let i = 0; i < uids.length; i++) {
      let uid = uids[i];
      const p = this.userService.getUserById(uid);
      await this.appModule.waitFor(p).then((res) => {
        this.groupMembers.push(res);
      });
    }

    for (let i = 0; i < this.groupMembers.length; i++) {
      this.shares.push({
        user: this.groupMembers[i],
        isSelected: false,
        share: 0,
      });
    }

    //Fetch all expenses of this group
    this.expenseService
      .getExpenseList(this.groupid)
      .subscribe((res: Expense[]) => {
        this.expensesList = res.sort((a, b) => {
          return (
            new Date(b.expense_date).getTime() -
            new Date(a.expense_date).getTime()
          );
        });
        //console.log('Expenses List : ', this.expensesList);
      });

    //Fetch All Transactions of this group
    this.transactionService
      .getAllTransactionsOfGroup(this.groupid)
      .subscribe((res: any) => {
        this.allTransactions = res;
        this.prepareTransactionsList();
        //console.log('All Transactions : ', this.allTransactions);
      });

    this.curuser = this.userService.getCurrentUserIdOnly();
    this.curusername = this.userService.getCurrentUserNameOnly();
  }
  ///////////////////////////////////////////////////////////////////////////////

  addExpense() {
    this.addbuttonClicked = true;
  }

  onListSelectionChange($event: any) {
    //console.log($event);
    //console.log('Selected users array : ', this.selectedShares);

    for (let i = 0; i < this.shares.length; i++) {
      if (
        this.selectedShares.find((x) => x.user.uid === this.shares[i].user.uid)
      ) {
        this.shares[i].isSelected = true;
      } else {
        this.shares[i].isSelected = false;
      }
    }

    this.distributeAmount(this.selectedShareType);
  }

  distributeEqual() {
    let len = this.selectedShares.length;
    if (len == 0) {
      this.resetAmount();
      return;
    } else {
      let share_amount = this.total_amount / len;
      for (let i = 0; i < this.shares.length; i++) {
        if (this.shares[i].isSelected) {
          this.shares[i].share = share_amount;
        } else {
          this.shares[i].share = 0;
        }
      }
    }
  }

  distributeExact() {
    this.enteredTotal = 0;
    for (let i = 0; i < this.shares.length; i++) {
      if (this.shares[i].isSelected) {
        let sh1 = this.selectedShares.find(
          (x) => x.user.uid === this.shares[i].user.uid
        );
        if (sh1) {
          this.shares[i].share = sh1.share;
          this.enteredTotal = this.enteredTotal + sh1.share;
        } else {
          this.shares[i].share = 0;
        }
      } else {
        this.shares[i].share = 0;
      }
    }
  }

  distributePercentage() {
    let len = this.selectedShares.length;
    if (len == 0) {
      this.resetAmount();
      return;
    }
  }

  distributeAmount(shareType: string) {
    this.selectedShareType = shareType;
    // console.log("selected Type : ", this.selectedShareType);
    if (this.selectedShareType === 'Equal') {
      this.distributeEqual();
    } else if (this.selectedShareType === 'Exact') {
      this.distributeExact();
    } else if (this.selectedShareType === 'Percentage') {
      this.distributePercentage();
    }
  }

  updateShareAmount($event: any, share: share) {
    this.enteredTotal = this.enteredTotal - share.share;
    if ($event.target.value) share.share = parseInt($event.target.value);
    else share.share = 0;

    this.enteredTotal = this.enteredTotal + share.share;
    //console.log('keyup event : ', this.enteredTotal);
  }

  updateSharePercentage($event: any, share: share) {}

  resetAmount() {
    for (let i = 0; i < this.shares.length; i++) {
      this.shares[i].share = 0;
    }
  }

  closeform() {
    this.addbuttonClicked = false;
    this.title = '';
    this.paidby = '';
    this.selectedCategory = '';
    this.total_amount = 0;
    this.selectedCategory = '';
    this.selectedShares = [];
    this.resetAmount();
  }

  submitForm() {
    if (this.title === '' || this.title === undefined) {
      Notify.warning('Please enter title');
      return;
    }
    if (this.total_amount === 0 || this.total_amount === undefined) {
      Notify.warning('Please enter total amount');
      return;
    }
    if (this.paidby === '' || this.paidby === undefined) {
      Notify.warning('Please select paid by');
      return;
    }
    if (this.selectedCategory === '' || this.selectedCategory === undefined) {
      Notify.warning('Please select a category');
      return;
    }
    if (this.selectedShareType === '' || this.selectedShareType === undefined) {
      Notify.warning('Please select Split type');
      return;
    }

    let sharesList = [];
    this.enteredTotal = 0;
    for (let i = 0; i < this.shares.length; i++) {
      if (this.shares[i].isSelected) {
        this.enteredTotal = this.enteredTotal + this.shares[i].share;
        let obj = {
          uid: this.shares[i].user.uid,
          uname: this.shares[i].user.fullName,
          share_amount: this.shares[i].share,
        };
        sharesList.push(obj);
      }
    }

    if (this.enteredTotal !== this.total_amount) {
      Notify.warning('Total amount and split amounts does not match');
      return;
    }

    this.newExpense = {
      eid: this.groupid + '_' + Date.now().toString(),
      title: this.title,
      paidBy: {
        uid: this.paidby,
        uname: this.groupMembers.find((x) => x.uid === this.paidby)!.fullName,
      },
      category: this.selectedCategory,
      group: this.groupid,
      expense_amount: this.total_amount,
      expense_date: new Date().toISOString(),
      isSettled: false,
      shares: sharesList,
    };

    //console.log('New Expense : ', this.newExpense);
    let transactions = this.generateTransactions();
    //console.log('Transactions : ', transactions);

    this.expenseService.addExpenseWithId(this.newExpense);
    this.transactionService.addTransactions(transactions);
    Notify.success('Expense added successfully');
    this.closeform();
  }

  generateTransactions(): Transaction[] {
    let transactions: Transaction[] = [];
    for (let i = 0; i < this.shares.length; i++) {
      if (this.shares[i].isSelected) {
        let obj = {
          tid: this.newExpense.eid + '_' + i,
          title: this.newExpense.title,
          from: this.newExpense.paidBy,
          to: {
            uid: this.shares[i].user.uid,
            uname: this.shares[i].user.fullName,
          },
          amount: this.shares[i].share,
          groupId: this.groupid,
          date: this.newExpense.expense_date,
        };
        transactions.push(obj);
      }
    }
    return transactions;
  }

  currentUserExpenseSettlement(expense: Expense): number {
    let curUid = this.userService.getCurrentUserIdOnly();
    let paidByCurrentUser: boolean = expense.paidBy.uid === curUid;
    if (paidByCurrentUser) {
      return (
        1 *
        (expense.expense_amount -
          expense.shares.find((x) => x.uid === curUid)!.share_amount)
      );
    } else {
      return -1 * expense.shares.find((x) => x.uid === curUid)!.share_amount;
    }
  }

  isCurrentUserInvolved(expense: Expense): boolean {
    return expense.shares.find((x) => x.uid === this.curuser) !== undefined;
  }

  openExpenseDetails(expense: Expense) {
    this.router2
      .navigate(['dashboard/expense-details', expense.eid])
      .then((e) => {
        if (e) {
          //console.log(e);
          console.log('routing successfull');
        } else {
          console.log('routing failed');
        }
      });
  }

  prepareTransactionsList() {
    this.newTransactionsList.splice(0);
    for (let i = 0; i < this.allTransactions.length; i++) {
      let fromUser = this.allTransactions[i].from.uid;
      let toUser = this.allTransactions[i].to.uid;
      let amount = this.allTransactions[i].amount;

      let obj = {
        person1: fromUser,
        person2: toUser,
        amount: amount,
      };
      this.newTransactionsList.push(obj);
    }
  }

  showSettlements = false;
  simplifySettlements() {
    //console.log('new transactions : ', this.newTransactionsList);
    let res = splitwise(this.newTransactionsList);
    this.simplifiedTransactions.splice(0);
    for (let i = 0; i < res.length; i++) { 
      let from = this.groupMembers.find((x) => x.uid === res[i].person1)!.fullName;
      let to = this.groupMembers.find((x) => x.uid === res[i].person2)!.fullName;
      let amount = res[i].amount;

      let obj = {
        from_name: from,
        from_uid: res[i].person1,
        to_name: to,
        to_uid: res[i].person2,
        amount: amount,
      }
      this.simplifiedTransactions.push(obj);
    }
    
    this.showSettlements = true;
    //console.log('Simplified Settlements : ', res);
  }

  getGroupExpenditure(): number {
    let amount = 0;
    for (let i = 0; i < this.expensesList.length; i++) {
      amount = amount + this.expensesList[i].expense_amount;
    }
    return amount;
  }

  getPersonalExpenditure(): number {
    let amount = 0;
    for (let i = 0; i < this.expensesList.length; i++) {
      let x = this.expensesList[i].shares.find((x) => x.uid === this.curuser);
      if (x !== undefined) {
        amount = amount + x.share_amount;
      }
    }
    return amount;
  }

  getCurrentUserSettledAmount(): number { 
    let amount = 0;
    for (let i = 0; i < this.simplifiedTransactions.length; i++) {
      if (this.simplifiedTransactions[i].from_uid === this.curuser) {
        amount = amount - this.simplifiedTransactions[i].amount;
      }
      else if(this.simplifiedTransactions[i].to_uid === this.curuser) {
        amount = amount + this.simplifiedTransactions[i].amount;
      }
    }
    return amount;
  }

  tabClick($event: any) {
    // console.log('Tab clicked : ', $event.index);
    if ($event.index === 1) {
      this.simplifySettlements();
      this.totalGroupExpenditure = this.getGroupExpenditure();
      this.currentUserExpenditure = this.getPersonalExpenditure();
      this.currentUserSimplifiedExpenditure = this.getCurrentUserSettledAmount();
      //console.log('Total Group Expenditure : ', this.totalGroupExpenditure);
      //console.log('Current user expenditure : ', this.currentUserExpenditure);
      //console.log('Current user simplified expenditure : ', this.currentUserSimplifiedExpenditure);
    }
  }
}
