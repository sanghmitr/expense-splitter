import { User } from "./user";
import { Group } from './group';

export interface Transaction {
  tid: string;
  title: string;
  from: { uid: User['uid']; uname: User['fullName'] };
  to: { uid: User['uid']; uname: User['fullName'] };
  amount: number;
  groupId: Group['gid'];
  date: string;
}