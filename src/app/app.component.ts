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
      // this.statusBar.backgroundColorByName('red');
      this.statusBar.hide();
      this.splashScreen.hide();

      this.storage.get('AvailableOffline').then(avail_offl => {
        this.DataService.available_offline = avail_offl;
      }).catch(e => {
        console.log(e);
      });

      this.storage.get('loggedInfo')
        .then((data) => {
          console.log(data);
          this.custom.email = data.email;
          this.custom.password = data.password;
          this.custom.login();
          this.loading.dismiss();
        }).catch(e => {
          this.router.navigateByUrl('/login');
          console.log('Error');
          this.loading.dismiss();
        });
    });
  }
}
