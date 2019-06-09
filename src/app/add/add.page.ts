import { Component, OnInit, ElementRef, NgZone } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFireDatabase } from '@angular/fire/database'
import { Router } from '@angular/router'
import * as moment from "moment"
import { CustomService } from '../custom.service'
import { LocalNotifications } from "@ionic-native/local-notifications/ngx"

@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"]
})
export class AddPage implements OnInit {
  uid: string
  countDownId = 1
  title: string
  description: string = ''
  false_time: boolean = false
  username: string

  datetime: string = moment()
    .minute(moment().minute() + 1)
    .seconds(0)
    .milliseconds(0)
    .format()

  max_time: string = moment()
    .year(moment().year() + 2)
    .millisecond(0)
    .seconds(0)
    .format()

  min_time: string = moment()
    .minute(moment().minute() + 1)
    .seconds(0)
    .milliseconds(0)
    .format()

  notify_time: string

  public count_downs

  constructor(
    public fireauth: AngularFireAuth,
    public localNotification: LocalNotifications,
    public router: Router,
    public zone: NgZone,
    public firebase: AngularFireDatabase,
    public custom: CustomService,
    public element: ElementRef
  ) { }

  resize() {
    const textArea = this.element.nativeElement.getElementsByTagName(
      "textarea"
    )[0]
    textArea.style.overflow = "hidden"
    textArea.style.height = "auto"
    textArea.style.height = textArea.scrollHeight + 2 + "px"
  }

  check() {
    if (this.datetime < this.min_time) {
      this.false_time = true
      this.custom.alert_dismiss(
        'Date & Time are not valid!',
        "You have selected <br /><b>" + moment(this.min_time).format('DD MMM, YYYY. HH:mm') + "</b><br />This time is not valid.<br /> Please select a valid date.")
    } else {
      this.false_time = false
    }
  }

  findCountDownId() {
    this.firebase.database.ref(`reminders/${this.uid}`).on('value', (countDownList) => {
      countDownList.forEach((countDown) => {
        if (this.countDownId <= parseInt(countDown.key)) {
          this.countDownId = parseInt(countDown.key) + 1
        }
      })
    })
  }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid
    this.firebase.database.ref(`/users/${this.uid}`).on('value', (user) => {
      let userInfo = user.toJSON()
      this.username = userInfo['name']
    })
    this.findCountDownId()
  }

  schedule() {
    var remaining_time = 30
    this.notify_time = moment(this.datetime).subtract(moment.duration(remaining_time).asMinutes()).format()
    if (this.notify_time > moment.now.toString()) { // if count down is lower than 30 minutes
      this.localNotification.schedule({
        id: this.countDownId - 1,
        launch: true,
        title: 'Count Down is Running',
        text: this.username + ', Your count down, ' + this.title + " will be finished in " + remaining_time + " minutes",
        trigger: {
          at: new Date(this.notify_time) // notify time
        },
        data: { cid: this.countDownId - 1 },
        actions: [
          { id: 'enter', title: 'Open Count Down' }
        ]
      })
    }
  }

  notify_finished() {
    this.localNotification.schedule({
      id: this.countDownId - 1,
      launch: true,
      title: 'Count Down Finished',
      text: this.username + ', Your count down, ' + this.title + " has finished",
      trigger: {
        at: new Date(this.datetime) // finished time
      },
      data: { cid: this.countDownId - 1 },
      actions: [
        { id: 'enter', title: 'Open Count Down' }
      ]
    })
  }

  saveItem() {
    console.log(this.title)
    this.firebase.database.ref(`/reminders/${this.uid}/${this.countDownId}`).set({
      title: this.title,
      datetime: this.datetime,
      description: this.description
    }).then(data => {
      this.schedule()
      this.notify_finished()
    })

    this.router.navigateByUrl('/home')
  }
}
