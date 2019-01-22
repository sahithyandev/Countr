import { Component, OnInit } from '@angular/core';
import { User } from "../modals/user";

import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { CustomService } from '../custom.service';

@Component({
  selector: "app-signup",
  templateUrl: "./signup.page.html",
  styleUrls: ["./signup.page.scss"]
})
export class SignupPage implements OnInit {
  public user = {} as User;
  public conf_password;

  constructor(
    public fireauth: AngularFireAuth,
    public firebase: AngularFireDatabase,
    public custom: CustomService
  ) {}

  ngOnInit() {}

  check() {
    if (this.user.password != this.conf_password) {
      this.custom.alert_dismiss("Passwords are not Same", "Re-Check them");
    } else {
      this.user.email.toLowerCase();
      this.create();
    }
  }

  async create(): Promise<any> {
    var setemail = this.user.email;
    var setpassword = this.user.password;

    try {
      const result = await this.fireauth.auth
        .createUserWithEmailAndPassword(setemail, setpassword)
        .then(newUser => {
          this.firebase.database
            .ref("/users")
            .child(newUser.user.uid)
            .set({
              info: this.user
            });
          // this.navCtrl.pop();
        });
    } catch (e) {
      console.log(e.code);
      if (e.code == "auth/weak-password") {
        this.custom.alert_dismiss(
          "Weak Password",
          "Try a different password.<br>This password is <b>Weak</b>"
        );
      }
      if (e.code == "auth/email-already-in-use") {
        this.custom.alert_dismiss(
          "Already Registered",
          "Log In instead of Sign Up"
        );
      }
    }
  }
}
