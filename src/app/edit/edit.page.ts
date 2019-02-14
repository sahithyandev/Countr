import { Component, OnInit, ElementRef } from '@angular/core';
import { CountDown } from '../modals/countdown';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { CustomService } from '../custom.service';
import * as moment from 'moment';
import { LocalNotifications, ILocalNotification } from "@ionic-native/local-notifications/ngx";

@Component({
  selector: "app-edit",
  templateUrl: "./edit.page.html",
  styleUrls: ["./edit.page.scss"]
})
export class EditPage implements OnInit {
  id;
  uid;
  reminder = {
    title: "",
    description: "",
    datetime: ""
  } as CountDown;

  min_time = moment()
    .minute(moment().minute() + 1)
    .second(0)
    .millisecond(0)
    .format();

  max_time = moment()
    .years(moment().years() + 10)
    .second(0)
    .millisecond(0)
    .format();

  temp: Array<object> = [];

  constructor(
    public firebase: AngularFireDatabase,
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
    textArea.style.overflow = "hidden";
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + 2 + "px";
  }

  ngOnInit() {
    this.id = this.parse.edit_id;
    this.uid = this.fireauth.auth.currentUser.uid;
    this.firebase.database
      .ref(`/reminders/${this.uid}/${this.id}`)
      .on("value", snapshot => {
        var result: object = snapshot.toJSON();
        this.temp.push(result);
        this.reminder = {
          id: this.temp[0]['id'],
          title: this.temp[0]["title"],
          description: this.temp[0]["description"],
          datetime: this.temp[0]["datetime"],
        };
      });
  }

  updateNotification() {
    this.localNotification.update({
      id: this.reminder.id,
      title: this.reminder.title,
      text: 'Your count down, ' + this.reminder.title + " has finished",
      trigger: {
        at: new Date(this.reminder.datetime)
      }
    });
  }

  saveEdits() {
    this.firebase.database.ref(`/reminders/${this.uid}/${this.id}`).update({
      title: this.reminder.title,
      description: this.reminder.description,
      datetime: this.reminder.datetime,
    });

    this.firebase.database
      .ref(`/reminders/${this.uid}/${this.id}`)
      .on("value", sn => {
        console.log(sn.toJSON());
      });
    this.custom.toast("Saved", "top");
    this.router.navigateByUrl("/home");

    this.updateNotification();
  }
}
