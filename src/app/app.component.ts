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
import { AngularFireDatabase } from '@angular/fire/database';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { Push, PushOptions, PushObject } from "@ionic-native/push";

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
    private firebase: AngularFireDatabase,
    public fireauth: AngularFireAuth,
    public storage: Storage,
    public loading: LoadingService,
    public connection: ConnectionService,
    public localNotifications: LocalNotifications,
    public DataService: DataService,
    public loadCtrl: LoadingController,
    public custom: CustomService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.loading.present();
      this.statusBar.hide();
      this.splashScreen.hide();

      this.firebase.database.ref('notify?').on('value', (value) => {
        const notify = value.val();

        if (notify) {
          
          this.firebase.database.ref('/notification').on('value', (value) => {
            var json = value.toJSON();
    
            this.localNotifications.schedule({
              title: json['title'],
              id: json['id'],
              text: json['description'],
              icon: 'resources/icon.png',
              trigger: {
                in: 5000 // milli seconds
              }
            });
          });
        }
      });

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
