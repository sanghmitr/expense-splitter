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
    joinLink: ''
  }
  constructor(private db: AngularFirestore, private formBuilder: FormBuilder,
    private userService: UserService, private readonly changeDetectorRef: ChangeDetectorRef,
  private groupService : GroupService, private router : Router) { }
  
  tempUser!: Observable<User>; 
  
  ngOnInit(): void {
    console.log("Groups On Init called");
    this.getCurrentUserGroups();

    // let item = localStorage.getItem('Token');
    // if (item) {
    //   let localStorageuser = JSON.parse(item);
    //   let uid: string = localStorageuser.uid;
    //   this.group.groupOwner = uid;
    //   this.group.members.push(uid);
      
    //   this.userService.getCurrentUser().then(doc => {
    //     this.tempUser = doc;
    //     console.log(doc);
    //   });
    // }
  }

  ngOnChanges() { 
    console.log("Groups On changes called");
    this.getCurrentUserGroups();
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

  submit(value: any): void {
  
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

    this.createButtonClicked = false;
    Swal.fire({
      title: 'Success',
      text: 'Group created successfully'
    })

    
    this.form.reset();
    this.groups.splice(0);
    this.getCurrentUserGroups();
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
    this.group.joinLink = this.group.gid;
    console.log("Group details are : ", this.group);
    this.groupService.createGroup(this.group);
    this.group.members.splice(0);
  }


  reset(): void {
    this.form.reset();
    this.members.clear();
    this.addgroupDetailsField();
  }


  groups : any[] = [];
  async getCurrentUserGroups() { 
    let item = localStorage.getItem('Token');
    if (item) {
      let localStorageuser = JSON.parse(item);
      let uid : string = localStorageuser.uid;
      await this.groupService.getUserGroups(uid).then(res => {
        res.forEach(doc => {
          //console.log("Group : ", doc.data());
          this.groups.push(doc.data());
        });
      });
    }
  }

  //open group details
  openGroupDeails(group: any) { 
    this.router.navigate(['groupDetails']);
  }

}
