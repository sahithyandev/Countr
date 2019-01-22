import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  email;
  password;

  constructor(
    public storage: Storage,
    public fireauth: AngularFireAuth,
    public firebase: AngularFireDatabase,
    public router: Router
  ) { }

  ngOnInit() {
  }

  login() {
    this.fireauth.auth.signInWithEmailAndPassword(this.email, this.password)
      .then(data => {

        this.storage.set('loggedInfo', {
          email: this.email,
          password: this.password,
          isLogged: true
        });

        this.router.navigateByUrl('/home')

      });

    }

  signup() {
    // this.navCtrl.push(SignupPage);
    console.log("Sign Up Page");
  }

}
