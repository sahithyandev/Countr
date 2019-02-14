import { Component, OnInit } from '@angular/core';
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

	temp: Array<object> = [];
	user_temp: Array<object> = [];

  constructor(
    public firebase: AngularFireDatabase,
    public fireauth: AngularFireAuth,
    public router: Router,
    public custom: CustomService,
    public localNotification: LocalNotifications,
    public parse: DataService
  ) { }

  ngOnInit() {
    this.countDownId = this.parse.countDownId;

    this.uid = this.fireauth.auth.currentUser.uid;

    this.firebase.database
      .ref(`/reminders/${this.uid}/${this.countDownId}`)
      .on("value", snapshot => {
        var result: object = snapshot.toJSON();
        this.temp.push(result);
        this.reminder = {
          id: this.temp[0]['id'],
          title: this.temp[0]["title"],
          description: this.temp[0]["description"],
          datetime: this.temp[0]["datetime"]
        };
        let next = new Date(this.reminder.datetime);
        this.ex_time = next;
        this.counting(next, this);
      });
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
        document.getElementById('timer').innerHTML = output;
        page.finished();
      } else {

        var hours = Math.floor(distance / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3);

        if (hours >= 24) {
          var days = Math.floor(hours / 24);                      
          hours = hours - (days * 24);

          output = days + "D: " + hours + "h : " + minutes + "m : " + seconds + "." + mseconds + "s";
        } else {
          if (hours <= 0) {
            if (minutes <= 0) {
              output = seconds + "." + mseconds + "s";
            } else {
              output = minutes + "m : " + seconds + "." + mseconds + "s";
            }
          } else if (minutes <= 0) {
            output = seconds + "." + mseconds + "s";
          } else {
            output = hours + "h : " + minutes + "m : " + seconds + "." + mseconds + "s";
          }
        }
      }

      try {
        document.getElementById('timer').innerHTML = output;
      } catch (error) {
        window.clearInterval(x);
        console.log("Stopped because of \n" + error);
      }
    }, 1);
  }

  finished() {
    let user_info;

    this.firebase.database.ref(`/users/${this.uid}/info/`).on('value', (data) => {
      var result: object = data.toJSON();
      console.log(result);
      this.user_temp.push(result);
      user_info = {
        name: this.user_temp[0]["name"],
      };
      console.log(user_info);
    });
    
  }

  removeNotification() {
    this.localNotification.cancel(this.countDownId);
  }

  delete() {
    this.removeNotification();
    this.firebase.database.ref(`/reminders/${this.uid}/${this.countDownId}`)
      .remove((e) => {
        console.log(e);
      }).then((after) => {
        this.router.navigateByUrl('/home');
      });

    this.custom.toast('Deleted', 'top');
  }

  edit() {
    this.parse.edit_id = this.countDownId;
    this.router.navigateByUrl('/edit');
  }

}
