import { Component, OnInit, NgZone } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { DataService } from '../data.service'
import { CountDown } from '../modals/countdown'
import { Router } from '@angular/router'
import { CustomService } from '../custom.service'
import { LocalNotifications } from '@ionic-native/local-notifications/ngx'
import { AngularFirestore, Query } from '@angular/fire/firestore'

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

	timer
	ex_time
	reminder = {} as CountDown
	// reminder = {}

	uid
  output // to output time and show it on the page
  isInternetAvailable: boolean = true // to determine how to tweak UI depended on Internet

	temp: Array<object> = []
  user_temp: Array<object> = []
  countdownRef : Query

  constructor(
    public firestore: AngularFirestore,
    public fireauth: AngularFireAuth,
    public router: Router,
    public custom: CustomService,
    public localNotification: LocalNotifications,
    public parse: DataService,
    public zone: NgZone
  ) { }

  ngOnInit() {
    this.reminder = this.parse.details_countdown
    this.uid = this.fireauth.auth.currentUser.uid

    this.ex_time = new Date(this.reminder.datetime)
    this.counting(this.ex_time, this)
  }

  counting(next, page) {
    // page.ex_time = next;
    var output;
    var stop = next.getTime()
    var x = window.setInterval(function () {
      var now = new Date().getTime()
      var distance = stop - now
      // console.log(distance);                     

      if (distance <= 0) {
        output = "Finished"
        console.log("Stopped")
        window.clearInterval(x)
      } else {

        var hours = Math.floor(distance / (1000 * 60 * 60))
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60))
        var seconds = Math.floor((distance % (1000 * 60)) / 1000)
        var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3)

        output = `${hours}h : ${minutes}m : ${seconds}.${mseconds}s` // Normal Syntax

        if (hours >= 24) {
          var days = Math.floor(hours / 24)                  
          hours = hours - (days * 24)

          output = `${days}D: ${hours}h : ${minutes}m : ${seconds}.${mseconds}s` // with Days Syntax
        } else {
          if (hours <= 0) {
            output = `${minutes}m : ${seconds}.${mseconds}s` // without Hours Syntax

            if (minutes <= 0) {
              output = `${seconds}.${mseconds}s` // without Hours and Minutes Syntax
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

  removeNotification() {
    this.localNotification.cancel(this.reminder.id)
  }

  delete() {
    this.removeNotification();
    this.firestore.collection("countdowns").doc(this.reminder.id).delete().then(after => { 
      this.router.navigateByUrl('/home') 
    }).catch(e => {
      console.log(e)
    })
    this.custom.toast('Deleted', 'top')
  }

  edit() {
    // this.parse.edit_id = this.reminder.id;
    this.parse.edit_countdown = this.reminder
    this.router.navigateByUrl('/edit')
  }

}
