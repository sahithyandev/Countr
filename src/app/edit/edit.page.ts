import { Component, OnInit, ElementRef } from '@angular/core';
import { CountDown } from '../modals/countdown';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { ActivatedRoute, Router } from '@angular/router';
import { DataService } from '../data.service';
import { CustomService } from '../custom.service';
import * as moment from 'moment';

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
    date: "",
    time: ""
  } as CountDown;

  now = new Date();

  temp: Array<object> = [];

  constructor(
    public firebase: AngularFireDatabase,
    public fireauth: AngularFireAuth,
    public parse: DataService,
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
          title: this.temp[0]["title"],
          description: this.temp[0]["description"],
          date: this.temp[0]["date"],
          time: this.temp[0]["time"]
        };
      });
  }

  saveEdits() {
    // this.zone.run(() => {
    this.firebase.database.ref(`/reminders/${this.uid}/${this.id}`).update({
      title: this.reminder.title,
      description: this.reminder.description,
      date: this.reminder.date,
      time: this.reminder.time
    });

    this.firebase.database
      .ref(`/reminders/${this.uid}/${this.id}`)
      .on("value", sn => {
        console.log(sn.toJSON());
      });
    this.custom.toast("Saved", "top");
    this.router.navigateByUrl("/home");
    // });
  }
}
