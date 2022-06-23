import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ExpenseService } from '../../shared/expense.service';
import { AppModule } from '../../app.module';
import { Expense } from 'src/app/models/expense';
import { UserService } from 'src/app/shared/user.service';
import { share } from 'src/app/models/share';
import { ShareDescriptor } from '../../models/expense';

@Component({
  selector: 'app-expense-details',
  templateUrl: './expense-details.component.html',
  styleUrls: ['./expense-details.component.scss'],
})
export class ExpenseDetailsComponent implements OnInit {
  expense!: Expense;
  curUserId = '';
  isPaidByCurrentUser: boolean = false;
  sharesList: ShareDescriptor[] = [];
  currentUserShare: number = 0;
  constructor(
    private router: ActivatedRoute,
    private expenseService: ExpenseService,
    private appModule: AppModule,
    private userService: UserService
  ) {}

  ngOnInit() {
    let eid = this.router.snapshot.params['id'];
    this.expenseService.getExpenseById(eid).subscribe((expense) => {
      this.expense = expense;
      this.sharesList = expense.shares;
      this.curUserId = this.userService.getCurrentUserIdOnly();
      this.isPaidByCurrentUser = expense.paidBy.uid === this.curUserId;
      this.currentUserShare = this.expense.shares.find(
        (x) => x.uid === this.curUserId
      )!.share_amount;
    });
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

  isCurrentUserInvolved(expense : Expense) {
      return expense.shares.find((x) => x.uid === this.curUserId) !== undefined;
  }
}
