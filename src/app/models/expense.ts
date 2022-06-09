import { Group } from "./group";
import { User } from "./user";

export interface Expense { 
    eid: string,
    title: string,
    paidBy: User["uid"],
    group: Group["gid"],
    expense_amount: number,
    expense_date: string,
    shares: [
        {
            user: User["uid"],
            share_amount: number
        }
    ]
}