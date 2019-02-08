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
  }

  send_http_request() {

    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'secret-key'
      })
    };
    this.http.post('https://us-central1-countit-19021.cloudfunctions.net/sendMail2', this.feedback, httpOptions)
      .subscribe(
        res => {
          console.log(res);
        },
        err => {
          console.log("Error occured");
        }
      )
  }

  send_feedback() {
    this.feedback.datetime = moment().format();

    this.firebase.database.ref(`feedback/${this.feedback.category}/`).child(this.feedback.datetime).set({
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
