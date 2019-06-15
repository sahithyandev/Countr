import { Component, OnInit, ElementRef } from '@angular/core'
import { CountDown } from '../modals/countdown'
import { AngularFirestore, DocumentReference, Query } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { ActivatedRoute, Router } from '@angular/router'
import { DataService } from '../data.service'
import { CustomService } from '../custom.service'
import * as moment from 'moment'
import { LocalNotifications } from "@ionic-native/local-notifications/ngx"

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit {
  id
  uid
  countdown = {} as CountDown

  min_time = moment()
    .minute(moment().minute() + 1)
    .second(0)
    .millisecond(0)
    .format()

  max_time = moment()
    .year(moment().year() + 10)
    .second(0)
    .millisecond(0)
    .format()

  temp: Array<object> = []
  countdownRef : Query

  constructor(
    public firestore: AngularFirestore,
    public fireauth: AngularFireAuth,
    public parse: DataService,
    public localNotification: LocalNotifications,
    public custom: CustomService,
    public element: ElementRef,
    public router: Router
  ) {}

  resize() {
    console.log("Increase Height");
    const textArea = this.element.nativeElement.getElementsByTagName(
      "textarea"
    )[0];
    textArea.style.overflow = "hidden"
    textArea.style.height = "auto"
    textArea.style.height = textArea.scrollHeight + 2 + "px"
  }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid
    this.countdown = this.parse.edit_countdown

    this.countdownRef = this.firestore.collection("countdowns").ref
      .where("owner", "==", this.uid)
  }

  updateNotification() {
    this.localNotification.update({
      id: this.countdown.id,
      title: this.countdown.title,
      text: 'Your count down, ' + this.countdown.title + " has finished",
      trigger: {
        at: new Date(this.countdown.datetime)
      }
    })
  }

  saveEdits() {
    if (this.countdown.title) {
      this.firestore.collection("countdowns").doc(this.countdown.id).update({
        title: this.countdown.title,
        description: this.countdown.description,
        datetime: this.countdown.datetime
      })

      this.custom.toast("Saved", "top")
      this.router.navigateByUrl("/home")

      this.updateNotification()
    }
  }
}
