import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
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
  countDownId;
  title: string;
  description: string = '';
  false_time: boolean = false;

  datetime: string = moment()
    .minute(moment().minute() + 1)
    .seconds(0)
    .milliseconds(0)
    .format();

  max_time: string = moment()
    .years(moment().years() + 10)
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

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid;
    
    // Test this function and implement this function to set the id for the new count down
    this.firebase.database.ref(`/reminders/${this.uid}`).on('value', snap => {
      console.log(snap.numChildren());
    });
  }

  schedule() {
    this.localNotification.schedule({
      id: this.countDownId,
      title: 'Count Down Finished',
      text: 'Your count down, ' + this.title + " has finished",
      trigger: {
        at: new Date(this.datetime)
      }
    });
  }

  saveItem() {
    console.log(this.title);
    this.firebase.database.ref(`/reminders/${this.uid}/${this.countDownId}`).push({
      title: this.title,
      datetime: this.datetime,
      description: this.description
    }).then(data => {
      this.schedule();
    });

    this.router.navigateByUrl('/home');
  }
}
