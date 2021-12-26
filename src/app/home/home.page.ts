import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  user = null;
  constructor(private auth: AuthService) {}

  ionViewWillEnter(){

    this.user = this.auth.getUser();
    console.log("nome do user------------------------------",this.user);
  }


  logout(){
    this.auth.logOut();
  }
}
