import { Injectable } from '@angular/core';
import { AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AngularFireAuth } from '@angular/fire/auth';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';
import { FormGroupDirective } from '@angular/forms';
import { LoadingService } from './loading.service';

@Injectable({
  providedIn: "root"
})
export class CustomService {
  email;
  password;
  
  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public fireauth: AngularFireAuth,
    public storage: Storage,
    public loading: LoadingService,
    public loadCtrl: LoadingController,
    public router: Router
    ) {}

  async presentLoading() {
    const loadingController = document.querySelector('ion-loading-controller');
    await loadingController.componentOnReady();

    const loadingElement = await loadingController.create({
      message: 'Please wait...',
      spinner: 'crescent',
      duration: 2000
    });
    return await loadingElement.present();
  }

  async alert_dismiss(title, message) {
    const al = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    });
    al.present();
  }

  snapToArray(snapshot) {
    var Arr = [];

    snapshot.forEach(function(child) {
      var item = child.val();
      item.key = child.key;

      Arr.push(item);
    });

    return Arr;
  }
  async toast(msg, pos) {
    const toast = await this.toastCtrl.create({
      message: msg,
      showCloseButton: false,
      position: pos,
      animated: true,
      mode: 'ios'
    });

    toast.present();

    let t = setTimeout(() => {
      toast.dismiss();
    }, 2000);
  }

  login() {
    this.fireauth.auth
      .signInWithEmailAndPassword(this.email, this.password)
      .then(data => {
        this.storage.set("loggedInfo", {
          email: this.email,
          password: this.password,
          isLogged: true
        });

        this.router.navigateByUrl("/home");
        this.loading.dismiss();
      });
  }

}
