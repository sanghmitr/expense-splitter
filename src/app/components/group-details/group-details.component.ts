import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { AppModule } from 'src/app/app.module';
import { User } from 'src/app/models/user';
import { Group } from '../../models/group';
import { GroupService } from '../../shared/group.service';
import { UserService } from '../../shared/user.service';
import { Clipboard } from '@angular/cdk/clipboard';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {
  group: Group = {
    gid: '',
    title: '',
    groupOwner: '',
    description: '',
    members: [],
    joinLink: '',
    createdAt: '',
  };
  
  createdDate: string = '';
  groupMembers: User[] = [];
  groupOwnerName : any;



  constructor(
    private appModule: AppModule,
    private router: ActivatedRoute,
    private groupService: GroupService,
    private userService: UserService,
    private clipboard : Clipboard,
  ) { 
    
  }


  async ngOnInit() {
    // this.group = this.router.snapshot.data['groupdata']; 
    
    let gid = this.router.snapshot.params['id'];
    const p = this.groupService.getGroupById(gid);
    await this.appModule.waitFor(p).then(res => { 
      this.group = res;
      console.log("Group Details : ", this.group);
    });

    // this.createdDate = this.group.createdAt.toDateString();
    // console.log("Created at : ", this.createdDate);

    //Get all group Member details
    let uids = this.group.members;
    for (let i = 0; i < uids.length; i++) { 
      let uid = uids[i];
      const p = this.userService.getUserById(uid);
      await this.appModule.waitFor(p).then(res => { 
        this.groupMembers.push(res);
      });
    }
    
    //Get group owner details
    this.groupOwnerName = this.groupMembers.find(x => x.uid === this.group.groupOwner)?.fullName;
  }

  viewMembers() {
    console.log("View Members", this.groupMembers);
  }

  copyText(textToCopy: string) {
    this.clipboard.copy(textToCopy);
    Notify.success('Invite code copied to clipboard');
  }

}
