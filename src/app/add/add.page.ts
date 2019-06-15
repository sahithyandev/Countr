import { Component, OnInit, ElementRef, NgZone } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
import * as moment from "moment"
import { CustomService } from '../custom.service'
import { LocalNotifications } from "@ionic-native/local-notifications/ngx"
import { AngularFirestore, Query } from '@angular/fire/firestore'
import { CountDown } from '../modals/countdown';
import { DataService } from '../data.service';

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
    title: "",
    owner: "",
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

  min_time: string = moment()
    .minute(moment().minute() + 1)
    .seconds(0)
    .milliseconds(0)
    .format()

  notify_time: string
  countdownRef : Query

  public count_downs

  constructor(
    public fireauth: AngularFireAuth,
    public localNotification: LocalNotifications,
    public router: Router,
    public zone: NgZone,
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
    if (this.newCountdown.datetime < this.min_time) {
      this.false_time = true
      this.custom.alert_dismiss(
        'Date & Time are not valid!',
        "You have selected <br /><b>" + moment(this.min_time).format('DD MMM, YYYY. HH:mm') + "</b><br />This time is not valid.<br /> Please select a valid date.")
    } else {
      this.false_time = false
    }
  }

  async findCountDownId() {
    await this.firestore.collection("countdowns").ref.get().then(countDownList => {
      let id = parseInt(countDownList.docs[countDownList.docs.length - 1].id) + 1
      this.countDownId = id
      console.log(this.countDownId)
      // countDownList.forEach(countdown => {
      //   console.log(countdown)
      //   if (this.countDownId <= parseInt(countdown.id)) {
      //     this.countDownId = parseInt(countdown.id) + 1
      //   }
      // })
    })
  }

  ngOnInit() {
    this.categories = this.parse.categories
    this.newCountdown.owner = this.fireauth.auth.currentUser.uid
    this.countdownRef = this.firestore.collection("countdowns").ref.where("owner", "==", this.newCountdown.owner)
    this.firestore.collection("users").doc(this.newCountdown.owner).ref.get().then(user => {
      this.username = user.get("name")
    })

    this.findCountDownId()
    console.log(this.countDownId)
  }

  schedule() {
    var remaining_time = 30
    this.notify_time = moment(this.newCountdown.datetime).subtract(moment.duration(remaining_time).asMinutes()).format()
    if (this.notify_time > moment.now.toString()) { // if count down is lower than 30 minutes
      this.localNotification.schedule({
        id: this.countDownId - 1,
        launch: true,
        title: 'Count Down is Running',
        text: this.username + ', Your count down, ' + this.newCountdown.title + " will be finished in " + remaining_time + " minutes",
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
      text: this.username + ', Your count down, ' + this.newCountdown.title + " has finished",
      trigger: {
        at: new Date(this.newCountdown.datetime) // finished time
      },
      data: { cid: this.countDownId - 1 },
      actions: [
        { id: 'enter', title: 'Open Count Down' }
      ]
    })
  }

  saveItem() {
    console.log(this.newCountdown)

    this.firestore.collection("countdowns").doc(this.countDownId + "").set({
      title: this.newCountdown.title,
      datetime: this.newCountdown.datetime,
      description: this.newCountdown.description,
      owner: this.newCountdown.owner,
      category: this.newCountdown.category
    }).then(date => {
      this.schedule()
      this.notify_finished()
      console.log("added successfully")
    })

    this.router.navigateByUrl('/home')
  }
}
