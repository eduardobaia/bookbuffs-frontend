import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { AlertController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { take, map, switchMap, switchMapTo } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(
    private auth: AuthService,
    private router: Router,
    private alertCtrl: AlertController
  ) {}
  canActivate(route: ActivatedRouteSnapshot): Observable<boolean> {
    return this.auth.user.pipe(
      take(1),
      map((user) => {
        console.log('in canActibvete user: ', user);
        if (!user) {
          this.alertCtrl
            .create({
              header: 'Unauthorized',
              message: 'You are not allowed to access that page.',
              buttons: ['OK'],
            })
            .then((alert) => {
              alert.present();
              this.router.navigateByUrl('/');
            });

          return false;
        } else {
          return true;
        }
      })
    );
  }
}
