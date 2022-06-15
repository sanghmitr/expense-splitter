import { Component, OnInit, OnDestroy, OnChanges,  SimpleChanges, Input } from '@angular/core';
import { Group } from '../../models/group';
import { Router, ActivatedRoute } from '@angular/router';
import { GroupService } from '../../shared/group.service';
import { UserService } from '../../shared/user.service';
import { User } from 'src/app/models/user';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-grouplist',
  templateUrl: './grouplist.component.html',
  styleUrls: ['./grouplist.component.scss']
})
export class GrouplistComponent implements OnInit, OnDestroy, OnChanges {

  @Input() groups: Group[] = [];
  constructor(public datepipe : DatePipe, private router: Router, private groupService: GroupService, private userService : UserService) {
      this.groups = [];
   }

  async ngOnInit() {
    //  await this.groupService.getAllGroupsOfCurrentUser().then(res => { 
    //    this.groups = res;
    //  });
     
    console.log("Grouplist component : ", this.groups);
  }

  ngOnChanges(changes: SimpleChanges) { 
    
    const groupChange = changes['groups'];
    if (groupChange.currentValue !== groupChange.previousValue){ 
      this.groups = groupChange.currentValue;
    }
    // await this.groupService.getAllGroupsOfCurrentUser().then(res => { 
    //   this.groups = res;
    // });
  }

  ngOnDestroy(){
    this.groups.splice(0);
  }

  //open group details
  openGroupDeails(group: Group) {
    this.router.navigate(['dashboard/groupdetails', group.gid]).then((e) => { 
      if (e) {
        console.log(e);
        console.log("routing successfull");
      }
      else {
        console.log("routing failed");
      }
    });
  }

  groupCreatedBy(group : Group): string {
    let uid = group.groupOwner;
    let user!: User;
    this.userService.getUserById(uid).subscribe(res => { 
      user = res;
    });
    return user.fullName;
  }
}
