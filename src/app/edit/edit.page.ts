import { Component, OnInit } from '@angular/core';
import { CountDown } from '../modals/countdown';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  id;
  uid;
  reminder = {
    title: '',
    description: '',
    date: '',
    time: ''
  } as CountDown;

  results: Array<object> = [];

  constructor(
    public firebase: AngularFireDatabase,
    public fireauth: AngularFireAuth
  ) { }

  ngOnInit() {
  }

  saveEdits() {
    // this.zone.run(() => {
      this.firebase.database
        .ref(`/reminders/${this.uid}/${this.id}`)
        .update({
          title: this.reminder.title,
          description: this.reminder.description,
          date: this.reminder.date,
          time: this.reminder.time
        });

      this.firebase.database.ref(`/reminders/${this.uid}/${this.id}`)
        .on('value', (sn) => {
          console.log(sn.toJSON());
        });
      // this.navCtrl.popTo(HomePage);
    // });
  }

}
