import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { CustomService } from './custom.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { async } from 'q';
import { LoadingService } from './loading.service';
import { createEmptyStateSnapshot } from '@angular/router/src/router_state';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public router: Router,
    public DataService: DataService,
    public loadCtrl: LoadingController,
    public fireauth: AngularFireAuth,
    public custom: CustomService,
    public storage: Storage,
    public loading: LoadingService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.loading.present();
      this.statusBar.hide();
      this.splashScreen.hide();
      this.router.navigateByUrl('/login');

      this.storage.get('loggedInfo')
        .then((data) => {
          if (data.isLogged) {
            this.custom.email = data.email;
            this.custom.password = data.password;
            this.custom.login();
          }
          this.loading.dismiss();
        }).catch(e => {
          console.log('Error : ' + e);
          this.loading.dismiss();
        });
    });
  }
}
