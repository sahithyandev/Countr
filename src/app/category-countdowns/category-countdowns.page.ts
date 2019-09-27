import { Component, OnInit } from '@angular/core'
import { DataService } from '../data.service'
import { Countdown } from '../modals/countdown'
import { CustomService } from '../custom.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-category-countdowns',
  templateUrl: './category-countdowns.page.html',
  styleUrls: ['./category-countdowns.page.scss'],
})
export class CategoryCountdownsPage implements OnInit {
  title // category
  uid // user id
  user_countdowns  = Array<Countdown>() // user's countdowns
  category_countdowns = Array<Countdown>() // to show in the UI

  constructor(
    public custom: CustomService,
    public router: Router,
    public parse: DataService
  ) { }

  sortCountdowns() {
    this.parse.countdowns.sort((a, b) => (a.isStarred && !(b.isStarred) ? -1 : 1))
  }

  ngOnInit() {
    this.title = this.parse.selectedCategory
    // this.uid = this.fireauth.auth.currentUser.uid
    this.user_countdowns = this.parse.countdowns
    this.getData()
  }

  getData() {
    for (let countdown of this.user_countdowns) {
      if (countdown.category == this.title) {
        this.category_countdowns.push(countdown)
      }
    }
  }

  async starCountdown(countdown: Countdown) {
    let newValue = !countdown.isStarred
    countdown.isStarred = newValue
    // this.firestore.collection("countdowns").doc(countdown.id).update({
    //   isStarred: countdown.isStarred
    // })
    this.sortCountdowns()
  }

  delete(countdown: Countdown) {
    this.parse.removeCountdown(countdown)
  }

  details(countdown: Countdown) {
    this.parse.details_countdown = countdown
    this.router.navigate(['/details'])
  }

}
