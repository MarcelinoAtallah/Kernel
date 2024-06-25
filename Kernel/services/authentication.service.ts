import { Injectable } from '@angular/core';
import { SignInData } from '../model/signInData';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { GlobalConstants } from '../common/GlobalConstants';
import { InformationService } from './information.service';

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  static getToken()
  {
    throw new Error('Method not implemented.');
  }
  user = new BehaviorSubject<SignInData | null>(null);

  constructor(private router: Router,public informationservice: InformationService) {}

  logout() {
    this.user.next(null);
    localStorage.clear();
    this.router.navigate(['login']);
  }

  handleAuthentication(user: SignInData) {
    this.user.next(user);
    localStorage.setItem('logeduserId', user.getUserId());
    localStorage.setItem('userRoleId', user.getRoleId());
    localStorage.setItem('userRoleName', user.getRoleName());
    localStorage.setItem("LogeduserId",user.getUserId());
    this.informationservice.setLogeduserId(user.getUserId());   
    this.informationservice.setUserRoleId(user.getRoleId());
    this.informationservice.setUserRoleName(user.getRoleName());
    this.autoLogout(GlobalConstants.sessionTimeOutCounter);
  }

  autoLogout(expirationDuration: number) {
    setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  autoLogin() {
    this.informationservice.setLogeduserId(localStorage.getItem("LogeduserId"));
    const userData = this.informationservice.getLogeduserId() || localStorage.getItem("logeduserId") || '{}';
 
    if (userData == '{}') {
      return;
    } else {
      let user = JSON.parse(userData);
      const loadedUser = new SignInData(user.username, user.password, user.jwtToken, user.refreshToken,user.userId,user.roleName,user.roleId);
      this.user.next(loadedUser);
      this.autoLogout(GlobalConstants.sessionTimeOutCounter);
    }
  }

  public getToken(): any {
    localStorage.getItem('jwtAccessToken');
  }
}