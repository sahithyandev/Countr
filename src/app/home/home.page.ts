import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, Query } from '@angular/fire/firestore'
import { CustomService } from '../custom.service'
import { Router } from '@angular/router'
import { DataService } from '../data.service'
import { Storage } from "@ionic/storage"
import { ToastController, PopoverController, Platform, AlertController } from '@ionic/angular'
import { PopComponent } from '../pop/pop.component'
import { LoadingService } from '../loading.service'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { CountDown } from '../modals/countdown';

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  uid
  count_downs  = Array<CountDown>()
  countdownRef : Query
  showWatermark = false // tells when to show watermark

  constructor(
    public firestore: AngularFirestore,
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

  reschedule() {
    for (let i in this.count_downs) {
      let countdown = this.count_downs[i]
      this.localNotification.schedule({
        title: "Count down Finished",
        text: "Your count down titled " + countdown.title + " has finished",
        trigger: {
          at: new Date(countdown.datetime) // finished time
        },
        data: { cid : countdown.id },
        actions: [
          { id: 'enter', title: 'Open Count Down' }
        ]
      })
    }
  }

  ionViewWillEnter() {
    this.getCountdowns(),
    this.getCategories() }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid
    this.countdownRef = this.firestore.collection("countdowns").ref.where("owner", "==", this.uid)
    .orderBy("datetime")

    this.getCountdowns()
    this.getCategories()

    this.localNotification.cancelAll()
    this.loading.dismiss()
    this.reschedule()
  }

  async getCategories() {
    this.firestore.collection("users").doc(this.uid).ref.get().then(snapshot => {
      this.parse.categories = snapshot.get("categories")
      console.log(this.parse.categories)
    }).catch(e => {
      console.log("Error " + e) 
    })
  }

  async getCountdowns() {
    this.countdownRef.onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        // this.count_downs = []
        // this.count_downs.push(doc.data())
        this.showWatermark = false
        this.count_downs = this.custom.snapToArray(snapshot)
        this.parse.user_countdowns = this.count_downs
      })
      // this.count_downs = this.custom.snapToArray(snapshot)
      // console.log(this.count_downs.length)
    })
    if (this.count_downs.length == 0) { this.showWatermark = true }
  }

  add() {
    this.router.navigateByUrl('/add')
  }

  async details(countDownId) {
    this.parse.countDownId = countDownId
    for (let i in this.count_downs) {
      if (this.count_downs[i].id == countDownId) {
        console.log("Count down found")
        this.parse.details_countdown = this.count_downs[i]
      }
    }
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
    this.firestore.collection("countdowns").doc(countDownId).delete().then(() => {
      console.log("Deleted")
      this.custom.toast("Countdown Deleted", "top")
      this.localNotification.cancel(countDownId)
    })
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
}
