import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Group } from '../../models/group';


import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import Swal from 'sweetalert2';
import { UserService } from '../../shared/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GroupService } from '../../shared/group.service';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { User } from 'src/app/models/user';

@Component({
  selector: 'app-group',
  templateUrl: './group.component.html',
  styleUrls: ['./group.component.scss']
})
export class GroupComponent implements OnInit {

  createButtonClicked = false;
  // constructor() { }

  group: Group = {
    gid: '',
    title: '',
    groupOwner: '',
    description: '',
    members: [],
    joinLink: '',
    createdAt: new Date(),
  }

  //groups: Group[] = [];
  
  constructor(private db: AngularFirestore, private formBuilder: FormBuilder,
    private userService: UserService, private readonly changeDetectorRef: ChangeDetectorRef,
    private groupService: GroupService, private router: Router) {
      
   }
  
  tempUser!: Observable<User>; 

  groups : Group[] = []
  
  ngOnInit(): void {
    // this.groups = this.groupService.getCurrentUserGroups();
    this.groupService.getAllGroupsOfCurrentUser().then(res => { 
      this.groups = res;
      //console.log("Groups : ", this.groups);
    });
  }

  ngOnDestroy() { 
    this.groups.splice(0);
  }

  ngOnChanges() { 

  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  openForm() {
    this.createButtonClicked = true;
  }

  groupDetails = {
    title: '',
    description: '',
    members: [{ memberEmail: '' }]
  }

  form: FormGroup = this.formBuilder.group({
    title: this.groupDetails.title,
    description: this.groupDetails.description,
    members: this.buildmembers(this.groupDetails.members)
  });

  

  get members(): FormArray {
    return this.form.get('members') as FormArray;
  }

  buildmembers(members: { memberEmail: string}[] = []) {
    return this.formBuilder.array(members.map(member => this.formBuilder.group(member)));
  }

  addgroupDetailsField() {
    this.members.push(this.formBuilder.group({memberEmail: ''}))
  }

  removegroupDetailsField(index: number): void {
    this.userNotExists = false;
    if (this.members.length > 1) this.members.removeAt(index);
    else this.members.patchValue([{memberEmail: ''}]);
  }

  closeForm() {
    this.createButtonClicked = false;
  }

  async submit(value: any) {
  
    if(value.title === '' || value.description === '') { 
      Swal.fire({
        title: 'Oops',
        text: 'Please fill all fields'
      })
      return;
    }

    if (value.members.length <= 1) {
      Swal.fire({
        title: 'Oops',
        text: 'Please add more than one member'
      })
      return;
    }
    else {
      for(let i = 0; i < value.members.length; i++) {
        if(value.members[i].memberEmail == '') {
          Swal.fire({
            title: 'Oops',
            text: 'Member email cannot be empty'
          })
          return;
        }
      }
    }
    this.setGroupDetails(value);
    // console.log("Group Details : ", this.groupDetails);
    // for (let i = 0; i < this.group.members.length; i++) { 
    //   this.userService.addGroupToUserDoc(this.group.gid, this.group.members[i]);
    // }

    this.createButtonClicked = false;
    Swal.fire({
      title: 'Success',
      text: 'Group created successfully'
    })

    
    this.form.reset();
    // this.groups.splice(0);
    // await this.groupService.getAllGroupsOfCurrentUser().then(res => { 
    //   this.groups = res;
    //   console.log("Groups : ", this.groups);
    // });
    //console.log(value);
  }


  // Direct function to check if user exists by given email or not
  userNotExists = false;
  async checkIfUserExists(event: any) { 
    this.db.collection('users').ref.where('email', '==', event.target.value.toLowerCase()).get().then(res => {
      if (res.empty) {
        console.log("User does not exist");
        this.userNotExists = true;
      }
      else {
        console.log("User exists");
        this.userNotExists = false;
      }
    });
  }
  
  //Function to set group details to local object
  async setGroupDetails(value: any) { 
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid : string = localStorageuser.uid;
      this.group.groupOwner = uid;
      this.group.members.push(uid);
      //console.log("Local storage uid is : ", uid);
    }

    //fetch all group members uid only
    for (let i = 0; i < value.members.length; i++) { 
      await this.userService.getUserId(value.members[i].memberEmail).then(res => { 
        this.group.members.push(res.docs[0].id);
        console.log("user id added : ", res.docs[0].id);
      });
    }

    //Remove duplicates
    this.group.members = this.group.members.filter((v, i, a) => a.indexOf(v) === i);

    this.group.title = value.title;
    this.group.description = value.description;
    
    let currentTime = new Date();
    this.group.gid = this.group.title + currentTime.getTime().toString();
    this.group.gid = this.group.gid.replace(/ /g, '');
    this.group.joinLink = this.group.gid;
    this.group.createdAt = new Date();
    console.log("Group details are : ", this.group);
    
    this.groupService.createGroup(this.group);
    this.groups.push(this.group);

    for (let i = 0; i < this.group.members.length; i++) { 
      this.groupService.addGroupIdToUser(this.group.members[i], this.group.gid).then(res => { 
        console.log("Group id added to user : ", res);
      });
    }
    
    this.group.members.splice(0);
  }


  reset(): void {
    this.form.reset();
    this.members.clear();
    this.addgroupDetailsField();
  }
  

  joinGroup() {
    Swal.fire({
      title: "Join Group",
      text: "Enter Invitation code",
      input: 'text',
      showCancelButton: true        
    }).then((result) => {
      let uid : string = this.userService.getCurrentUserIdOnly();
      if (result.value) {
        console.log("Result: " + result.value);
        this.groupService.addUserToGroup(result.value, uid);
      }
  });
  }
}
