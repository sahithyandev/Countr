import { Component, OnInit, ElementRef } from '@angular/core'
import { Router } from '@angular/router'
import { AngularFireAuth } from '@angular/fire/auth'

import * as moment from "moment"

import { Feedback } from "./../modals/feedback"
import { CustomService } from '../custom.service'
import { HttpHeaders, HttpClient } from "@angular/common/http"
import { AngularFirestore } from '@angular/fire/firestore'

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  feedback = {} as Feedback

  constructor(
    public fireauth: AngularFireAuth,
    public custom: CustomService,
    public http: HttpClient,
    public router: Router,
    public element: ElementRef,
    public firestore: AngularFirestore
  ) { }

  resize() {
    const textArea = this.element.nativeElement.getElementsByTagName(
      "textarea"
    )[0];
    textArea.style.overflow = "hidden"
    textArea.style.height = "auto"
    textArea.style.height = textArea.scrollHeight + 2 + "px"
  }

  ngOnInit() {
    this.feedback.category = 'error_bug'
    this.feedback.uid = this.fireauth.auth.currentUser.uid
    this.firestore.collection('users').doc(this.feedback.uid).ref.get().then(snapshot => {
      this.feedback.username = snapshot.get("name")
    })
  }

  send_http_request() {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'AIzaSyDmcWmLEdKEzGhuQ6d-peH81uHR4iGcT8M'
      })
    };

    this.http.post('https://us-central1-countit-19021.cloudfunctions.net/sendMailToOwner', this.feedback, httpOptions)
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
    this.feedback.postTime = moment().format();

    this.firestore.collection("feedbacks").add(this.feedback).then(() => {
      this.send_http_request();
      this.custom.alert_dismiss('Feedback Sent', 'Thank you for your feedback!.<br>Your feedback will be helpful to improve our app.');
      this.router.navigateByUrl('/home');
    })
  }

}
