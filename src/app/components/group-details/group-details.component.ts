import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-group-details',
  templateUrl: './group-details.component.html',
  styleUrls: ['./group-details.component.scss']
})
export class GroupDetailsComponent implements OnInit {

  constructor() { }

  @Input() group: any;

  ngOnInit(): void {
  }

}
