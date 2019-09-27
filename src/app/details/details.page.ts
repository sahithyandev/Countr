import { Platform } from '@ionic/angular'
import { Component, OnInit } from '@angular/core'
import { Router, ActivatedRoute } from '@angular/router'
import * as moment from "moment"
import { CustomService } from '../custom.service'
import { DataService } from '../data.service'
import { Countdown } from '../modals/countdown'
import { CountdownOutput } from '../modals/countdownOutput'

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
  slideOptions = {
    initialSlide: 1,
    speed: 400
  }
  minusTimer: Boolean = false

	timer
  stop_time
  countdown = {} as Countdown
  output = {} as CountdownOutput

	uid
  // output // to output time and show it on the page
  isInternetAvailable: boolean = true // to determine how to tweak UI depended on Internet

	temp: Array<object> = []
  user_temp: Array<object> = []
  // countdownRef : Query

  constructor(
    public router: Router,
    public route: ActivatedRoute,
    public platform: Platform,
    public custom: CustomService,
    public parse: DataService
  ) {}

  ngOnInit() {
    this.countdown = this.parse.details_countdown
    // this.uid = this.fireauth.auth.currentUser.uid
    this.startCountdown()
  }

  startCountdown() {
    this.stop_time = moment(this.countdown.datetime).format("ddd, Do MMM YYYY, h:mm A") // fancy time
    this.counting(this.countdown, this)
  }

  counting(countdown: Countdown, page) {
    // page.ex_time = next;
    var output = {} as CountdownOutput;
    var stop = new Date(countdown.datetime).getTime()
    var x = window.setInterval(function () {
      var now = new Date().getTime()
      var distance = stop - now

      if (distance <= 0) {
        if (countdown.isRepeat) {
          let old_time = countdown.datetime
          countdown.datetime = moment(old_time).year(moment(old_time).year() + 1).format()

          page.custom.alert_dismiss("Info", "This countdown is repeated as your Wish")
          page.custom.syncWithFirestore(countdown)
          page.startCountdown()
        }
        page.minusTimer = true
      }
        var hours = Math.floor(distance / (1000 * 60 * 60))
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        // var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3)

        output.days = ''
        output.hours = hours.toString().padStart(2, '0')
        output.minutes = minutes.toString().padStart(2, '0')
        output.seconds = seconds.toString().padStart(2, '0')

        if (hours >= 24 || distance < -24 * 3600000) {
          var days = Math.floor(hours / 24)

          output.days = days.toString()
          output.hours = (hours - (days * 24)).toString().padStart(2, '0')
        } else {
          if (hours <= 0 && !(distance < -60 * 60 * 1000)) {
            output.hours = ''

            if (minutes <= 0 && !(distance < -60 * 1000)) {
              output.minutes = ''
            }
          }
        }

      try {
        page.output = output
      } catch (error) {
        window.clearInterval(x)
        console.log(error)
        console.log("Stopped")
      }
    }, 1)
  }

  tool(action) {
    if (action == "delete") this.delete()
    if (action == "edit") this.editPage()
  }

  delete() {
    // this.firestore.collection("countdowns").doc(this.countdown.id).delete().then(after => { 
    //   this.router.navigateByUrl('/home') 
    // }).catch(e => {
    //   console.log(e)
    // })
    this.custom.toast('Deleted', 'top')
  }

  editPage() {
    this.parse.edit_countdown = this.countdown
    this.router.navigateByUrl('/edit')
  }

  categoryPage() {
    this.parse.selectedCategory = this.countdown.category
    this.router.navigateByUrl('/category-countdowns')
  }
}
