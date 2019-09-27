import { Component, OnInit, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import * as moment from "moment"

import { CustomService } from '../custom.service'
import { Countdown } from '../modals/countdown'
import { DataService } from '../data.service'

@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"]
})
export class AddPage implements OnInit {
  countDownId
  false_time: boolean = false
  username: string

  newCountdown = {
    title: "",
    isStarred: false,
    isRepeat: false,
    isFinished: false,
    description: "",
    category: "__default__",
    datetime: moment()
      .minute(moment().minute() + 1)
      .seconds(0)
      .milliseconds(0)
      .format()
  } as Countdown

  max_time: string = moment()
    .year(moment().year() + 2)
    .millisecond(0)
    .seconds(0)
    .format()

  // min_time: string = moment()
  //   .minute(moment().minute() + 1)
  //   .seconds(0)
  //   .milliseconds(0)
  //   .format()

  notify_time: string

  public count_downs

  constructor(
    public router: Router,
    public custom: CustomService,
    public parse: DataService,
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
    let min_time = moment()
      .minute(moment().minute() + 1)
      .seconds(0)
      .milliseconds(0)
      .format()
      
    if (this.newCountdown.datetime < min_time) {
      this.false_time = true
      this.custom.alert_dismiss(
        'Date & Time are not valid!',
        "You have selected <br /><b>" + moment(min_time).format('DD MMM, YYYY. HH:mm') + "</b><br />This time is not valid.<br /> Please select a valid date.")
    } else {
      this.false_time = false
    }
  }

  ngOnInit() {
    // this.categories = this.parse.categories
    // this.newCountdown.owner = this.fireauth.auth.currentUser.uid
    // this.countdownRef = this.firestore.collection("countdowns").ref.where("owner", "==", this.newCountdown.owner)
    // this.firestore.collection("users").doc(this.newCountdown.owner).ref.get().then(user => {
    //   this.username = user.get("name")
    // })
  }

  saveItem() {
    console.log(this.newCountdown)
    this.parse.addCountdown(this.newCountdown)
    this.router.navigateByUrl('/home')
  }
}
