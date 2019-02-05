import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import * as moment from "moment";

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.page.html',
  styleUrls: ['./feedback.page.scss'],
})
export class FeedbackPage implements OnInit {
  title: string;
  description: string;
  category: string;
  uid: string;
  datetime: string;

  constructor(
    public fireauth: AngularFireAuth,
    public firebase: AngularFireDatabase
  ) { }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid;
  }

  send_feedback() {
    this.datetime = moment().format();
    this.firebase.database.ref(`errors`).child(`${this.datetime}`).set({
      user: this.uid,
      title: this.title,
      description: this.description,
      category: this.category
    });
  }

}
