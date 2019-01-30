import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import * as moment from "moment";
import { CustomService } from '../custom.service';

@Component({
  selector: "app-add",
  templateUrl: "./add.page.html",
  styleUrls: ["./add.page.scss"]
})
export class AddPage implements OnInit {
  title: string;
  datetime: string = moment().milliseconds(0).format();
  description: string;
  uid;
  false_time: boolean = false;
  max_time = moment()
    .years(moment().years() + 10)
    .format();
  min_time = moment().milliseconds(0).format();

  public count_downs;

  constructor(
    public fireauth: AngularFireAuth,
    public router: Router,
    public zone: NgZone,
    public firebase: AngularFireDatabase,
    public custom: CustomService,
    public element: ElementRef
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
    console.log(this.max_time);
  }

  saveItem() {
    console.log(this.datetime);
    this.firebase.database.ref(`/reminders/${this.uid}`).push({
      title: this.title,
      datetime: this.datetime,
      description: this.description
    });

    this.router.navigateByUrl('/home');
  }
}
