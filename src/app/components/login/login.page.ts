import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  credentials = {
    username:'saimon@devdactic.com',
    password:"123"
  };
  constructor(private authService:AuthService, private alertCtrl: AlertController, private router: Router) { }

  ngOnInit() {
  }


  login() {
    console.log("login q chego do front"+ this.credentials.username)
    this.authService.login(this.credentials).subscribe(async res => {
      if (res) {
        this.router.navigateByUrl('/home');
      } else {
        const alert = await this.alertCtrl.create({
          header: 'Login Failed',
          message: 'Wrong credentials.',
          buttons: ['OK']
        });
        await alert.present();
      }
    });
  }
}
