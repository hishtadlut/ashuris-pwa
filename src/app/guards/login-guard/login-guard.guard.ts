import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from 'src/app/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) { }



  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const token = this.authService.getCookieToken();
    return new Promise<boolean | UrlTree>((resolve) => {
      if (token) {
        resolve(true);
        // this.authService.verifyToken(token)
        //   .subscribe(response => {
        //     if (response === true) {
        //       resolve(true);
        //     } else {
        //       resolve(false);
        //     }
        //   });
      } else {
        resolve(this.router.parseUrl('/login-page'));
      }
    });
  }
}
