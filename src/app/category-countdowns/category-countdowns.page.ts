import { Component, OnInit } from '@angular/core'
import { DataService } from '../data.service'
import { CountDown } from '../modals/countdown'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { CustomService } from '../custom.service'
import { Router } from '@angular/router'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'

@Component({
  selector: 'app-category-countdowns',
  templateUrl: './category-countdowns.page.html',
  styleUrls: ['./category-countdowns.page.scss'],
})
export class CategoryCountdownsPage implements OnInit {
  title // category
  uid // user id
  user_countdowns  = Array<CountDown>() // user's countdowns
  category_countdowns = Array<CountDown>() // to show in the UI

  constructor(
    public fireauth: AngularFireAuth,
    public firestore: AngularFirestore,
    public localNotification: LocalNotifications,
    public custom: CustomService,
    public router: Router,
    public parse: DataService
  ) { }

  ngOnInit() {
    this.title = this.parse.selectedCategory
    this.uid = this.fireauth.auth.currentUser.uid
    this.user_countdowns = this.parse.user_countdowns
    this.getData()
  }

  getData() {
    for (let countdown of this.user_countdowns) {
      if (countdown.category == this.title) {
        this.category_countdowns.push(countdown)
      }
    }
  }

  delete(countDownId) {
    this.firestore.collection("countdowns").doc(countDownId).delete().then(() => {
      console.log("Deleted")
      this.custom.toast("Countdown Deleted", "top")
      this.localNotification.cancel(countDownId)
    })
  }

  async details(countDownId) {
    this.parse.countDownId = countDownId
    for (let countdown of this.user_countdowns) {
      if (countdown.id == countDownId) {
        console.log("Count down found")
        this.parse.details_countdown = countdown
      }
    }
    await this.router.navigate(['/details'])
  }

}
