import { User } from './user';
export interface Group { 
    gid: string,
    title: string,
    groupOwner: User["uid"],
    description: string,
    members: string[],
    joinLink: string,
    createdAt : string,
}