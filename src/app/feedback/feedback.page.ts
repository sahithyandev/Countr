import { Component, OnInit, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

import * as moment from "moment";

import { Feedback } from "./../modals/feedback";
import { CustomService } from '../custom.service';
import { HttpHeaders, HttpClient } from "@angular/common/http";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedback = {} as Feedback;

  constructor(
    public fireauth: AngularFireAuth,
    public custom: CustomService,
    public http: HttpClient,
    public router: Router,
    public element: ElementRef,
    public firebase: AngularFireDatabase
  ) { }

  resize() {
    const textArea = this.element.nativeElement.getElementsByTagName(
      "textarea"
    )[0];
    textArea.style.overflow = "hidden";
    textArea.style.height = "auto";
    textArea.style.height = textArea.scrollHeight + 2 + "px";
  }

  ngOnInit() {
    this.feedback.uid = this.fireauth.auth.currentUser.uid;
    this.send_http_request();
  }

  send_http_request() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AAAAHL4t95c:APA91bE8nvtsRUqwD0J7fhO8x-o2f4wyh2zwPcuBI1-hTqHTAcgy8p-pG7Pt0nnWYuCmWcN9OA8TrTMWiz0Oy-RiAI4hQRoyyrtUqN_3zzloDAj4-GXnXjgM73B2ktQkn7LrFMTihOm2'
      })
    };

    this.http.post('https://us-central-countit-19021.cloudfunctions.net/sendMail', this.feedback, httpOptions)
      .subscribe(
        res => {
          console.log(res);
        },
        error => {
          console.log("Error occured");
          console.error(error);
        }
      )
  }

  send_feedback() {
    this.feedback.datetime = moment().format();

    this.firebase.database.ref(`/feedback/${this.feedback.category}/`).child(this.feedback.datetime).set({
      title: this.feedback.title,
      user: this.feedback.uid,
      datetime: this.feedback.datetime,
      description: this.feedback.description
    }).then(() => {
      this.custom.alert_dismiss('Feedback Sent', 'Thank you for your feedback!.<br>Your feedback will be helpful to improve our app.');
      this.router.navigateByUrl('/home');
    });
  }

}
