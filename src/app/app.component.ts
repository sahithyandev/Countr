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
<<<<<<< HEAD
import { ConnectionService } from 'ng-connection-service';
=======
import { AngularFireDatabase } from '@angular/fire/database';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
// import { Push, PushOptions, PushObject } from "@ionic-native/push";
>>>>>>> 7088d0f234180fee17c86fa6dc5c17e99a551d72

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
<<<<<<< HEAD
    public loading: LoadingService,
    public connection: ConnectionService
=======
    public localNotifications: LocalNotifications,
    public DataService: DataService,
    public loadCtrl: LoadingController,
    public loading: LoadingService,
    public custom: CustomService
>>>>>>> 7088d0f234180fee17c86fa6dc5c17e99a551d72
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.loading.present();
      this.statusBar.hide();
      this.splashScreen.hide();
<<<<<<< HEAD
=======
      // this.pushSetup();

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

            // this.firebase.database.ref('/notify?').set(false);
          });
        }
      });
>>>>>>> 7088d0f234180fee17c86fa6dc5c17e99a551d72

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
<<<<<<< HEAD
=======

  // pushSetup() {
  //   const options: PushOptions = {
  //     android: {
  //       senderID: '123449767831',
  //       sound: 'true',
  //     },
  //     ios: {
  //       alert: 'true',
  //       badge: true,
  //       sound: 'true'
  //     },
  //     browser: {
  //       pushServiceURL: 'http://push.api.phonegap.com/v1/push'
  //     }
  //   }

  //   const pushObject: PushObject = Push.init(options);


  //   pushObject.on('notification').subscribe((notification: any) => console.log('Received a notification', notification));

  //   pushObject.on('registration').subscribe((registration: any) => console.log('Device registered', registration));

  //   pushObject.on('error').subscribe(error => console.error('Error with Push plugin', error));
  // }
>>>>>>> 7088d0f234180fee17c86fa6dc5c17e99a551d72
}
