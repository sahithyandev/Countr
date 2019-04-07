import { Component, OnInit, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import * as moment from "moment";
import { CustomService } from '../custom.service';
import { LocalNotifications } from "@ionic-native/local-notifications/ngx";

@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"]
})
export class AddPage implements OnInit {
  uid: string;
  countDownId = 1;
  title: string;
  description: string = '';
  false_time: boolean = false;
  username: string ;

  datetime: string = moment()
    .minute(moment().minute() + 1)
    .seconds(0)
    .milliseconds(0)
    .format();

  max_time: string = moment()
    .year(moment().year() + 10)
    .millisecond(0)
    .seconds(0)
    .format();

  min_time: string = moment()
    .minute(moment().minute() + 1)
    .seconds(0)
    .milliseconds(0)
    .format();

  public count_downs;

  constructor(
    public fireauth: AngularFireAuth,
    public localNotification: LocalNotifications,
    public router: Router,
    public zone: NgZone,
    public firebase: AngularFireDatabase,
    public custom: CustomService,
    public element: ElementRef
  ) {}

  resize() {
    const textArea = this.element.nativeElement.getElementsByTagName(
      "textarea"
    )[0];
    textArea.style.overflow = "hidden";
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + 2 + "px";
  }

  check() {
    if (this.datetime < this.min_time) {
      this.false_time = true;
      this.custom.alert_dismiss('Date & Time are not valid!', "You can't select date and time before <b>" + moment(this.min_time).format('DD MMM, YYYY. HH:mm') + "</b><br />Please Re-Select it");
    } else {
      this.false_time = false;
    }
  }

  findCountDownId() {
    this.firebase.database.ref(`reminders/${this.uid}`).on('value', (countDownList) => {
      countDownList.forEach((countDown) => {
        if (this.countDownId <= parseInt(countDown.key)) {
          this.countDownId = parseInt(countDown.key) + 1;
        }
      })
    });
  }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid;
    this.firebase.database.ref(`/users/${this.uid}`).on('value', (user) => {
      let userInfo = user.toJSON();
      this.username = userInfo['name'];
    });
    this.findCountDownId();
  }

  schedule() {
    this.localNotification.schedule({
      id: this.countDownId,
      title: 'Count Down Finished',
      text: this.username + ', Your count down, ' + this.title + " has finished",
      trigger: {
        at: new Date(this.datetime)
      },
      data: [this.countDownId],
      actions: [
        { id: 'delete', title: 'Delete' },
        { id: 'enter', title: 'Open the app' }
      ]
    });
  }

  saveItem() {
    console.log(this.title);
    this.firebase.database.ref(`/reminders/${this.uid}/${this.countDownId}`).set({
      title: this.title,
      datetime: this.datetime,
      description: this.description
    }).then(data => {
      this.schedule();
    });

    this.router.navigateByUrl('/home');
  }
}
