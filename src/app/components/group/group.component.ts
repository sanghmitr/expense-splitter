import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { Group } from '../../models/group';
import { User } from '../../models/user';
import { user } from '@angular/fire/auth';
import { ReactiveFormsModule, FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { AfterViewChecked, ChangeDetectorRef } from '@angular/core'
import Swal from 'sweetalert2';
import { UserService } from '../../shared/user.service';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { GroupService } from '../../shared/group.service';

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
  private groupService : GroupService) { }
  
  ngOnInit(): void {
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
  setGroupDetails(value: any) { 
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
      this.userService.getUserId(value.members[i].memberEmail).then(res => { 
        this.group.members.push(res);
      });
    }

    this.group.title = value.title;
    this.group.description = value.description;
    
    let currentTime = new Date();
    this.group.gid = this.group.title + currentTime.getTime().toString();
    this.group.joinLink = this.group.gid;
    console.log("Group details are : ", this.group);
    this.groupService.createGroup(this.group);
  }


  reset(): void {
    this.form.reset();
    this.members.clear();
    this.addgroupDetailsField();
  }

}
