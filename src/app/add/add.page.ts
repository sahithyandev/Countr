import { Component, OnInit, ViewChild, ElementRef, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { Router } from '@angular/router';
import * as moment from "moment";

@Component({
  selector: 'app-add',
  templateUrl: './add.page.html',
  styleUrls: ['./add.page.scss'],
})
export class AddPage implements OnInit {
  title: string;
  date: string;
  time: string;
  description: string;
  uid;
  max_time = (new Date().getFullYear() + 10);
  min_time: string = new Date().toISOString();
  public count_downs;

  constructor(
    public fireauth: AngularFireAuth,
    public router: Router,
    public zone: NgZone,
    public firebase: AngularFireDatabase,
    public element: ElementRef
  ) { }

  resize() {
    console.log('Increase Height');
    const textArea = this.element.nativeElement.getElementsByTagName('textarea')[0];
    textArea.style.overflow = 'hidden';
    textArea.style.height = 'auto';
    textArea.style.height = textArea.scrollHeight + 2 + 'px';
  }

  check() {
    console.log('Checking');
  }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid;
    console.log(this.max_time);
  }

  saveItem() {
    console.log(this.date);
    console.log(this.time);
    this.firebase.database.ref(`/reminders/${this.uid}`).push({
      title: this.title,
      date: this.date,
      description: this.description
    });

    this.router.navigateByUrl('/home');
  }

}
