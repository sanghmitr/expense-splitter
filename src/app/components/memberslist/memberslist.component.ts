import { Component, Input, OnInit } from '@angular/core';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-memberslist',
  templateUrl: './memberslist.component.html',
  styleUrls: ['./memberslist.component.scss']
})
export class MemberslistComponent implements OnInit {

  @Input() members: User[] = [];
  
  constructor() {
    //console.log("Memberslist component : ", this.members);
   }

  ngOnInit(): void {

  }

  setDefaultPic(member: User) {
    let updatedMember;

    updatedMember = {
      uid: member.uid,
      email: member.email,
      photoURL: "/src/assets/user-logo.png",
      fullName: member.fullName,
      phone: member.phone,
      groups: member.groups,
      balance : member.balance,
    }

    let mem = this.members.find(m => m.uid === member.uid);
    if (mem) { 
      mem = updatedMember;
    }
  }

}
