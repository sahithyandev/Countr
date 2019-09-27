import { Component } from '@angular/core'

import { Platform, LoadingController } from '@ionic/angular'
import { SplashScreen } from '@ionic-native/splash-screen/ngx'
import { StatusBar } from '@ionic-native/status-bar/ngx'
import { DataService } from './data.service'
import { Router } from '@angular/router'
import { Storage } from "@ionic/storage"
import { CustomService } from './custom.service'
import { LoadingService } from './loading.service'
import { ConnectionService } from 'ng-connection-service'
import { timer } from "rxjs/observable/timer"

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html'
})
export class AppComponent {
  showSplash: Boolean = false

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusbar: StatusBar,
    public router: Router,
    public storage: Storage,
    public loading: LoadingService,
    public connection: ConnectionService,
    public DataService: DataService,
    public loadCtrl: LoadingController,
    public custom: CustomService
  ) {
    this.initializeApp()
  }

  initializeApp() {
    this.splashScreen.hide()
    this.platform.ready().then(() => {
      console.log(this.storage.get('firstRun'))
      // this.loading.present()
      console.log(this.showSplash)

      this.router.navigateByUrl('/intro')
      
      // timer(3000).subscribe(() => {
      //   console.log("3 sec")
      //   this.showSplash = false
      //   // this.router.navigateByUrl('/')
      // })
    })
  }
}
