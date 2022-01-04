import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import {  Router} from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { Platform } from '@ionic/angular';
import { BehaviorSubject, from, Observable, of } from 'rxjs';
import { take, map, switchMap, switchMapTo } from 'rxjs/operators';
import { Storage } from '@ionic/storage';


const AUTH_SERVER_ADDRESS =  'http://localhost:8080';
const helper = new JwtHelperService();
const TOKEN_KEY = 'jwt-token';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public user: Observable<any>;
  private userData = new BehaviorSubject(null);

  constructor(
    private storage: Storage,
    private http: HttpClient,
    private plt: Platform,
    private router: Router
  ) {
    //  this.userData.getValue();
    this.loadStoredToken();
  }

  loadStoredToken() {
    let platformObs = from(this.plt.ready());

    this.user = platformObs.pipe(
      switchMap(() => {
        return from(this.storage.get(TOKEN_KEY));
      }),
      map(token => {
        if (token) {
          let decoded = helper.decodeToken(token);
          this.userData.next(decoded);
          return true;
        } else {
          return null;
        }
      })
    );
  }



  login(credentials: {username: string, password: string }) {
    console.log("login que chego", credentials.username)
    // Normally make a POST request to your APi with your login credentials
    // if (credentials.email != 'saimon@devdactic.com' || credentials.pw != '123') {
    //   return of(null);
    // }
    http://localhost:8080/api/auth/login
    return this.http.post('http://localhost:8080/api/auth/login', credentials).pipe(
      take(1),
      map(res => {
        console.log("o res", res)
        // Extract the JWT, here we just fake it
        return `eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJPbmxpbmUgSldUIEJ1aWxkZXIiLCJpYXQiOjE1Njc2NjU3MDYsImV4cCI6MTU5OTIwMTcwNiwiYXVkIjoid3d3LmV4YW1wbGUuY29tIiwic3ViIjoiMTIzNDUiLCJmaXJzdF9uYW1lIjoiU2ltb24iLCJsYXN0X25hbWUiOiJHcmltbSIsImVtYWlsIjoic2FpbW9uQGRldmRhY3RpYy5jb20ifQ.4LZTaUxsX2oXpWN6nrSScFXeBNZVEyuPxcOkbbDVZ5U`;

      }),
      switchMap(token => {
        let decoded = helper.decodeToken(token);
        this.userData.next(decoded);

        let storageObs = from(this.storage.set(TOKEN_KEY,token));
        return storageObs;
      })
    );
  }

//    login(credentials: {email: string, pw: string }) {
//      return this.http.post<any>('http://localhost:8080/api/auth/login', credentials)
//      .subscribe((res: any) => {
//       let decoded = helper.decodeToken(res.token);
//       this.userData.next(decoded);
//       let storageObs = from(this.storage.set(TOKEN_KEY,res.token));
//    //   return storageObs;
//       //  localStorage.setItem('access_token', res.token)
//       //  this.getUserProfile(res._id).subscribe((res) => {
//       //    this.currentUser = res;
//       //    this.router.navigate(['user-profile/' + res.msg._id]);
//       //  })
//      })
//  }


  getUser(){
    return this.userData.getValue();
  }

  logOut(){
    this.storage.remove(TOKEN_KEY).then(()=>
    {
      this.router.navigateByUrl('/');
      this.userData.next(null);
    })
  }
}
