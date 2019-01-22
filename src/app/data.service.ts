import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: "root"
})
export class DataService {

  count_down_id;
  email;
  password;

  constructor(
    public fireauth: AngularFireAuth,
    public storage: Storage,
    public router: Router
  ) {}

  // login() {
  //   this.fireauth.auth
  //     .signInWithEmailAndPassword(this.email, this.password)
  //     .then(data => {
  //       this.storage.set("loggedInfo", {
  //         email: this.email,
  //         password: this.password,
  //         isLogged: true
  //       });

  //       this.router.navigateByUrl("/home");
  //     });
  // }
}
