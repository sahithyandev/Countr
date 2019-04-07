import { Component, OnInit, NgZone } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from '../data.service';
import { CountDown } from '../modals/countdown';
import { Router } from '@angular/router';
import { CustomService } from '../custom.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

	timer;
	ex_time;
	reminder = {} as CountDown;
	// reminder = {};

	uid;
  countDownId;
  output; // to output time and show it on the page
  isInternetAvailable: boolean = true; // to determine how to tweak UI depended on Internet

	temp: Array<object> = [];
	user_temp: Array<object> = [];

  constructor(
    public firebase: AngularFireDatabase,
    public fireauth: AngularFireAuth,
    public router: Router,
    public custom: CustomService,
    public localNotification: LocalNotifications,
    public parse: DataService,
    public zone: NgZone
  ) { }

  ngOnInit() {
    this.countDownId = this.parse.countDownId;

    if (this.countDownId != -1) {

      this.uid = this.fireauth.auth.currentUser.uid;

      this.firebase.database
        .ref(`/reminders/${this.uid}/${this.countDownId}`)
        .on("value", snapshot => {
          var result: object = snapshot.toJSON();
          this.temp.push(result);
          this.reminder = {
            id: snapshot.key,
            title: this.temp[0]["title"],
            description: this.temp[0]["description"],
            datetime: this.temp[0]["datetime"]
          };
          
          this.ex_time = new Date(this.reminder.datetime);
          this.counting(this.ex_time, this);
        }
      );
    } else {
      this.isInternetAvailable = false;
      this.reminder = {
        id: -1,
        title: "",
        description: "",
        datetime: this.parse.temporaryCountDown.datetime
      };

      let next = new Date(this.reminder.datetime);
      this.counting(next, this);
      
    }
  }

  counting(next, page) {
    // page.ex_time = next;
    var output;
    var stop = next.getTime();
    var x = window.setInterval(function () {
      var now = new Date().getTime();
      var distance = stop - now;
      // console.log(distance);                     

      if (distance <= 0) {
        output = "Finished";
        console.log("Stopped");
        window.clearInterval(x);
        page.finished();
      } else {

        var hours = Math.floor(distance / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3);

        output = `${hours}h : ${minutes}m : ${seconds}.${mseconds}s`; // Normal Syntax

        if (hours >= 24) {
          var days = Math.floor(hours / 24);                      
          hours = hours - (days * 24);

          output = `${days}D: ${hours}h : ${minutes}m : ${seconds}.${mseconds}s`; // with Days Syntax
        } else {
          if (hours <= 0) {
            output = `${minutes}m : ${seconds}.${mseconds}s`; // without Hours Syntax

            if (minutes <= 0) {
              output = `${seconds}.${mseconds}s`; // without Hours and Minutes Syntax
            }
          }
        }
      }

      try {
        page.output = output;
      } catch (error) {
        window.clearInterval(x);
        console.log(error);
        console.log("Stopped");
      }
    }, 1);
  }

  finished() {
    this.firebase.database.ref(`/users/${this.uid}/info/`).on('value', (data) => {
      var result: object = data.toJSON();
      console.log(result);
      this.user_temp.push(result);
    });
  }

  removeNotification() {
    this.localNotification.cancel(this.countDownId);
  }

  delete() {
    if (this.countDownId != -1) {
      this.removeNotification();
      this.firebase.database.ref(`/reminders/${this.uid}/${this.countDownId}`)
        .remove((error) => {
          console.log(error);
        }).then((after) => {
          this.router.navigateByUrl('/home');
        });

      this.custom.toast('Deleted', 'top');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  edit() {
    this.parse.edit_id = this.countDownId;
    this.router.navigateByUrl('/edit');
  }

}
