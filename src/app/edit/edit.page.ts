import { Component, OnInit, ElementRef } from '@angular/core'
import { CountDown } from '../modals/countdown'
import { AngularFirestore, Query } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
import { DataService } from '../data.service'
import { CustomService } from '../custom.service'
import * as moment from 'moment'

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit {
  id
  uid
  countdown = {} as CountDown
  categories = Array<String>()

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
    
  countdownRef : Query

  constructor(
    public firestore: AngularFirestore,
    public fireauth: AngularFireAuth,
    public parse: DataService,
    public custom: CustomService,
    public element: ElementRef,
    public router: Router
  ) {}

  resize() {
    const textArea = this.element.nativeElement.getElementsByTagName(
      "textarea"
    )[0];
    textArea.style.overflow = "hidden"
    textArea.style.height = "auto"
    textArea.style.height = textArea.scrollHeight + 2 + "px"
  }

  ngOnInit() {
    this.categories = this.parse.user.categories
    this.uid = this.fireauth.auth.currentUser.uid
    this.countdown = this.parse.edit_countdown

    this.countdownRef = this.firestore.collection("countdowns").ref
      .where("owner", "==", this.uid)
  }

  saveEdits() {
    if (this.countdown.title) {
      this.firestore.collection("countdowns").doc(this.countdown.id).update({
        title: this.countdown.title,
        description: this.countdown.description,
        datetime: this.countdown.datetime,
        category : this.countdown.category,
        isRepeat: this.countdown.isRepeat
      })

      this.custom.toast("Saved", "top")
      this.router.navigateByUrl("/home")
    }
  }
}
