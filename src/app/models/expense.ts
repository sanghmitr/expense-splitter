import { category } from "./category.enum";
import { Group } from "./group";
import { User } from "./user";

class ShareDescriptor {

    user: string = '';
    share_amount: number = 0;

}


export interface Expense { 
    eid: string,
    title: string,
    category: string,
    paidBy: User["uid"],
    group: Group["gid"],
    expense_amount: number,
    expense_date: Date,
    isSettled : boolean,
    shares: ShareDescriptor[],
}