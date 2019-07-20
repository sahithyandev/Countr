import { Component, OnInit, ElementRef } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
import * as moment from "moment"
import { CustomService } from '../custom.service'
import { AngularFirestore, Query } from '@angular/fire/firestore'
import { CountDown } from '../modals/countdown'
import { DataService } from '../data.service'

@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"]
})
export class AddPage implements OnInit {
  countDownId
  categories = Array<String>()
  // title: string
  // description: string = ''
  false_time: boolean = false
  username: string

  newCountdown = {
    id: "",
    title: "",
    owner: this.parse.user.id,
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
  } as CountDown

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
  countdownRef : Query

  public count_downs

  constructor(
    public fireauth: AngularFireAuth,
    public router: Router,
    public firestore: AngularFirestore,
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
    this.categories = this.parse.user.categories
    this.newCountdown.owner = this.fireauth.auth.currentUser.uid
    this.countdownRef = this.firestore.collection("countdowns").ref.where("owner", "==", this.newCountdown.owner)
    this.firestore.collection("users").doc(this.newCountdown.owner).ref.get().then(user => {
      this.username = user.get("name")
    })
  }

  saveItem() {
    console.log(this.newCountdown)

    this.firestore.collection("countdowns").add({
      title: this.newCountdown.title,
      datetime: this.newCountdown.datetime,
      description: this.newCountdown.description,
      owner: this.newCountdown.owner,
      category: this.newCountdown.category,
      isStarred: this.newCountdown.isStarred,
      isRepeat: this.newCountdown.isRepeat
    } as CountDown).then(date => {
      console.log("added successfully")
    })

    this.router.navigateByUrl('/home')
  }
}
