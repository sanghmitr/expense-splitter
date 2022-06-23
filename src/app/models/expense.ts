import { category } from "./category.enum";
import { Group } from "./group";
import { User } from "./user";

export class ShareDescriptor {

    uid: string = '';
    uname : string = '';
    share_amount: number = 0;

}


export interface Expense { 
    eid: string,
    title: string,
    category: string,
    paidBy: { uid : User["uid"], uname : User["fullName"] },
    group: Group["gid"],
    expense_amount: number,
    expense_date: string,
    isSettled : boolean,
    shares: ShareDescriptor[],
}