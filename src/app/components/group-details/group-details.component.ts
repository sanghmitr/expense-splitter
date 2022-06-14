import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { Group } from '../../models/group';
import { GroupService } from '../../shared/group.service';

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
    createdAt: new Date(),
  };

  gid: string = '';
  
  constructor(private router: ActivatedRoute, private groupService: GroupService) { 
    this.router.data.subscribe(data => { 
      this.group = data['groupdata'];
      console.log("Group : ", data['groupdata']);
    })
    console.log(this.router.snapshot.params['id']);
    console.log(this.router.snapshot.data['groupdata']);
  }

  
  ngOnInit() {
  
    this.group = this.router.snapshot.data['groupdata'];  
    console.log("Group : ", this.group);
  }

}
