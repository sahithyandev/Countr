import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { CustomService } from '../custom.service';
import { Keyboard } from "@ionic-native/keyboard";
import { Alert } from 'selenium-webdriver';
import { AlertController, LoadingController } from '@ionic/angular';
import { LoadingService } from '../loading.service';


@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email;
  password;
  email_wrong = false;

  constructor(
    public storage: Storage,
    public fireauth: AngularFireAuth,
    public alertCtrl: AlertController,
    public loadCtrl: LoadingController,
    public firebase: AngularFireDatabase,
    public router: Router,
    public loading: LoadingService,
    public custom: CustomService
  ) { }

  ngOnInit() {
    Keyboard.onKeyboardShow().subscribe((data) => {
      console.log(data);
    });
  }

  async alert_password_reset(title, message) {
    const al = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: [{
        text: 'Try again',
        role: 'cancel'
      },
        {
          text: 'Change',
          handler: () => {
            this.forgot()
          }
        }]
    });
    al.present();
  }

  login() {
    this.loading.present();
    let load = 
    this.fireauth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(data => {

        this.storage.set('loggedInfo', {
          email: this.email,
          password: this.password,
          isLogged: true
        });

        this.router.navigateByUrl('/home');
        this.loading.dismiss();
        this.custom.toast('Successfully Logged In!', 'top');

      }).catch(e => {
        console.log(e);
        this.loading.dismiss();
        if (e.code == 'auth/invalid-email') {
          this.email_wrong = true;
          this.custom.alert_dismiss('Invalid Email', 'Type your email fully..<br>(example: john@gmail.com)');
        }
        if (e.code == 'auth/wrong-password') {
          this.alert_password_reset('Password Wrong',
          "Check your password before trying again. <br> You can change your password");
        }
        if (e.code == 'auth/user-not-found') {
          this.custom.alert_dismiss('Wrong Email Address', 'It seems like as you are not signed up yet<br> <b>Sign In before Log In again</b>');
        }
      });

    }

  signup() {
    this.router.navigateByUrl('/signup');
  }

  forgot() {
    if (!this.email_wrong) {
    this.fireauth.auth.sendPasswordResetEmail(this.email);
    } else {
      this.custom.alert_dismiss('Email Not Found', 'Enter your Email and Try again');
    }
  }

}
