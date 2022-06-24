import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserService } from '../../shared/user.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  currentUser: any;

  constructor(private userService : UserService, private route: ActivatedRoute) { }

  ngOnInit(): void {

    this.route.data.subscribe(routeData => {
      let data = routeData['data'];
      if (data) {
        this.currentUser = data;
        //console.log(this.currentUser);
      }
    });
  }

}
