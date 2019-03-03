import { Component } from '@angular/core';

import { Platform, LoadingController } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { DataService } from './data.service';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { CustomService } from './custom.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { LoadingService } from './loading.service';
import { ConnectionService } from 'ng-connection-service';

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
    public loading: LoadingService,
    public connection: ConnectionService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.loading.present();
      this.statusBar.hide();
      this.splashScreen.hide();

      this.router.navigateByUrl('/login');

      this.connection.monitor().subscribe(isOnline => {
        if (isOnline) {
          this.router.navigateByUrl('/login');
        } else {
          this.router.navigateByUrl('/noInternet');
        }
      });
    });
  }
}
