import { Component } from '@angular/core'

import { Platform, LoadingController } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { DataService } from './data.service'
import { Router } from '@angular/router'
import { Storage } from "@ionic/storage"
import { CustomService } from './custom.service'
import { AngularFireAuth } from '@angular/fire/auth'
import { LoadingService } from './loading.service'
import { ConnectionService } from 'ng-connection-service'

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusbar: StatusBar,
    public router: Router,
    public fireauth: AngularFireAuth,
    public storage: Storage,
    public loading: LoadingService,
    public connection: ConnectionService,
    public DataService: DataService,
    public loadCtrl: LoadingController,
    public custom: CustomService
  ) {
    this.initializeApp()
  }

  determineHomepage() {
    if (navigator.onLine) {
      this.router.navigateByUrl('/login')
    } else {
      this.router.navigateByUrl('/noInternet')
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.loading.present()
      this.splashScreen.hide()
      this.fireauth.auth.setPersistence('local')

      this.router.navigateByUrl('/login')
      this.determineHomepage()

      // for testing
      // this.router.navigateByUrl('/noInternet')

      this.connection.monitor().subscribe(isOnline => {
        console.log(navigator.onLine)
        this.determineHomepage()
      })
    })
  }
}
