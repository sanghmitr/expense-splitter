import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from 'src/app/models/group';
import { GroupService } from 'src/app/shared/group.service';

@Injectable()
export class GroupDetailsResolve implements Resolve<Group> {
    constructor(private router : Router, private groupService: GroupService) { }

    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Group | Observable<Group> | Promise<Group> {
        console.log("route Params ", route.params['id']);
        //this.groupService.getGroupById(route.params['id']).subscribe(res => { console.log("Group : ", res); });
        return this.groupService.getGroupById(route.params['id']);
    } 
    
}