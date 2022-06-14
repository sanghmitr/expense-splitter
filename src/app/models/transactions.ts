import { User } from "./user";
import { Group } from './group';

export interface Transaction { 
    tid: string,
    title: string,
    from: User["uid"],
    to: User["uid"],
    amount: number,
    groupId : Group["gid"],
    date: string
}