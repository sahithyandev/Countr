import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { Storage } from "@ionic/storage";
import { DataService } from './data.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    public storage: Storage,
    public parse: DataService
  ) {
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();

      // try {
      //   this.storage.get('loggedInfo')
      //     .then((data) => {
      //       this.parse.email = data.email;
      //       this.parse.password = data.password;
      //       this.parse.login();
      //     });
      // } catch (e) {
      //   console.log('error Found');
      //   console.log(e);
      // }
    });
  }
}
