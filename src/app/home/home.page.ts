import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase } from '@angular/fire/database'
import { CustomService } from '../custom.service'
import { Router } from '@angular/router'
import { DataService } from '../data.service'
import { Storage } from "@ionic/storage"
import { ToastController, PopoverController, Platform, AlertController } from '@ionic/angular'
import { PopComponent } from '../pop/pop.component'
import { LoadingService } from '../loading.service'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  uid
  count_downs  : Array<object>

  constructor(
    public firebase: AngularFireDatabase,
    public platform: Platform,
    public fireauth: AngularFireAuth,
    public custom: CustomService,
    public data: DataService,
    public localNotification: LocalNotifications,
    public router: Router,
    public parse: DataService,
    public toastCtrl: ToastController,
    public loading: LoadingService,
    public popCtrl: PopoverController,
    public storage: Storage,
    public alertCtrl: AlertController
  ) {
    this.platform.ready().then(() => {
      // handle the notification to delete and open the app
      // Check it
      this.localNotification.on('enter').subscribe(notification => {
        this.data.countDownId = notification.data.cid
        this.router.navigateByUrl('/details')
        console.log(notification.data)
      });
    })
  }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid

    try {
      this.firebase.database
        .ref(`/reminders/${this.uid}`)
        .on("value", snapshot => {
          this.count_downs = this.custom.snapToArray(snapshot)
          console.log(this.count_downs.length)
        })
    } catch (e) {
      this.firebase.database.goOffline()
      console.log("No Internet")
    }

    this.loading.dismiss()
  }

  add() {
    this.router.navigateByUrl('/add')
  }

  async details(countDownId) {
    this.parse.countDownId = countDownId
    await this.router.navigate(['/details'])
  }

  logout() {
    this.fireauth.auth.signOut()
    this.popCtrl.dismiss()
    this.storage.remove('loggedInfo')
    this.router.navigateByUrl('/login')
    this.custom.toast("Successfully Logged Out!", "top")
  }

  delete(countDownId) {
    this.localNotification.cancel(countDownId)
    this.firebase.database.ref(`/reminders/${this.uid}/${countDownId}`).remove()
  }

  async pop2(poper) {
    return await poper.present()
  }

  pop(pop_event) {
    const popover = this.popCtrl
      .create({
        component: PopComponent,
        mode: 'ios',
        event: pop_event
      })
      .then(output => {
        this.pop2(output)
      });
  }

  scheduleNotifications() {
    this.localNotification.schedule({
      title: "Good Morning",
      text: "You have " + this.count_downs + ""
    })
  }
}
