import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { DataService } from '../data.service'
import { CountDown } from '../modals/countdown'
import { Router } from '@angular/router'
import { CustomService } from '../custom.service'
import { AngularFirestore, Query } from '@angular/fire/firestore'
import * as moment from "moment"
import { CountdownOutput } from '../modals/countdownOutput'

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

	timer
  stop_time
  countdown = {} as CountDown
  output = {} as CountdownOutput
	// reminder = {}

	uid
  // output // to output time and show it on the page
  isInternetAvailable: boolean = true // to determine how to tweak UI depended on Internet

	temp: Array<object> = []
  user_temp: Array<object> = []
  countdownRef : Query

  constructor(
    public firestore: AngularFirestore,
    public fireauth: AngularFireAuth,
    public router: Router,
    public custom: CustomService,
    public parse: DataService
  ) { }

  ngOnInit() {
    this.countdown = this.parse.details_countdown
    this.uid = this.fireauth.auth.currentUser.uid
    this.startCountdown()
  }

  startCountdown() {
    this.stop_time = new Date(this.countdown.datetime)
    this.counting(this.countdown, this)
  }

  counting(countdown: CountDown, page) {
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
        window.clearInterval(x)
        // output = "Finished"
        console.log("Stopped")
      } else {
        var hours = Math.floor(distance / (1000 * 60 * 60))
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        var mseconds =  Math.floor(distance % 1000)
        // var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3)

        output.days = ''
        output.hours = hours.toString().padStart(2, '0')
        output.minutes = minutes.toString().padStart(2, '0')
        output.seconds = seconds.toString().padStart(2, '0')
        output.mseconds = mseconds.toString().padStart(3, '0')

        // output = `${hours__}h : ${minutes__}m : ${seconds__}s` // Normal Syntax without milliseconds
        // output = `${hours__}h : ${minutes__}m : ${seconds__}.${mseconds__}s` // Normal Syntax

        if (hours >= 24) {
          var days = Math.floor(hours / 24)

          output.days = days.toString()                
          output.hours = (hours - (days * 24)).toString().padStart(2, '0')

          // output = `${days}D : ${hours__}h : ${minutes__}m : ${seconds__}s` // with Days Syntax without milliseconds
          // output = `${days__}D:${hours__}h : ${minutes__}m : ${seconds__}.${mseconds__}s` // with Days Syntax

        } else {
          if (hours <= 0) {
            output.hours = ''
            // output = `${minutes__}m : ${seconds__}s` // without Hours Syntax without milliseconds
            // output = `${minutes__}m : ${seconds__}.${mseconds__}s` // without Hours Syntax

            if (minutes <= 0) {
              output.hours = output.minutes = ''
              // output = `${seconds__}s` // without Hours and Minutes Syntax without milliseconds
              // output = `${seconds__}.${mseconds__}s` // without Hours and Minutes Syntax  
            }
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

  // finished() {
  //   this.firebase.database.ref(`/users/${this.uid}/info/`).on('value', (data) => {
  //     var result: object = data.toJSON();
  //     console.log(result);
  //     this.user_temp.push(result);
  //   });
  // }

  delete() {
    this.firestore.collection("countdowns").doc(this.countdown.id).delete().then(after => { 
      this.router.navigateByUrl('/home') 
    }).catch(e => {
      console.log(e)
    })
    this.custom.toast('Deleted', 'top')
  }

  edit() {
    // this.parse.edit_id = this.reminder.id;
    this.parse.edit_countdown = this.countdown
    this.router.navigateByUrl('/edit')
  }

  categoryPage() {
    this.parse.selectedCategory = this.countdown.category
    this.router.navigateByUrl('/category-countdowns')
  }

}
