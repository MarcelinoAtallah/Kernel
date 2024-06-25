import { Injectable } from '@angular/core';
import { UrlTree, Router } from '@angular/router';
import { map, Observable, tap } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(
    private authenticationService: AuthenticationService,
    private router: Router
  ) {}

  canActivate():| boolean | UrlTree | Promise<boolean | UrlTree> | Observable<boolean | UrlTree> {
    const userId = localStorage.getItem("logeduserId");
    if (userId != null) {
      return true;
    } else {
      return this.router.createUrlTree(['login']);
    }
  }
}
