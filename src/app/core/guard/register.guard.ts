import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class RegisterGuard implements CanActivate {

  constructor(private authService: AuthService, 
              private router: Router){

                

              }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      return new Observable(obs => {
        this.authService.getCurrentUser()
          .subscribe({
            next: data => {
              if(!data){
                obs.next(true)
                return this.router.navigate(['/', 'register'])
              }
              obs.next(false)
              return this.router.navigate(['/', 'dashboard'])
            },
            
            error: err => {
              this.router.navigate(['/', 'register'])
              obs.next(false)
            }
          })
      }) 
  }
  
}
