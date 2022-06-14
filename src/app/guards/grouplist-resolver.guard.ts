import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Resolve, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { Group } from '../models/group';
import { GroupService } from '../shared/group.service';

@Injectable({
  providedIn: 'root'
})
export class GrouplistResolverGuard implements Resolve<Group[]> {

  constructor(private groupService: GroupService) {

   }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Group[] | Observable<Group[]> | Promise<Group[]> {
    return this.groupService.getAllGroupsOfCurrentUser()
  }
  
}
