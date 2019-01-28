import { Component, OnInit, Optional } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireAuth } from '@angular/fire/auth';
import { DataService } from '../data.service';
import { CountDown } from '../modals/countdown';
import { Router } from '@angular/router';
import { CustomService } from '../custom.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {

  item;
	title;
	description;
	date;
	time;

	timer;
	ex_time;
	reminder = {} as CountDown;
	// reminder = {};

	uid;
	key;

	temp: Array<object> = [];

  constructor(
    public firebase: AngularFireDatabase,
    public fireauth: AngularFireAuth,
    public router: Router,
    public custom: CustomService,
    public parse: DataService
  ) { }

  ngOnInit() {
    this.key = this.parse.count_down_id;

    this.uid = this.fireauth.auth.currentUser.uid;

    this.firebase.database
      .ref(`/reminders/${this.uid}/${this.key}`)
      .on("value", snapshot => {
        var result: object = snapshot.toJSON();
        this.temp.push(result);
        this.reminder = {
          title: this.temp[0]["title"],
          description: this.temp[0]["description"],
          date: this.temp[0]["date"],
          time: this.temp[0]["time"]
        };
        let next = new Date(this.reminder.date + " " + this.reminder.time);
        this.ex_time = next;
        this.counting(next, this);
      });
  }

  counting(next, page) {
    // page.ex_time = next;
    var output;
    console.log(next);
    var stop = next.getTime();
    var x = window.setInterval(function () {
      var now = new Date().getTime();
      var distance = stop - now;
      // console.log(distance);                     

      if (distance <= 0) {
        output = "Count Down Finished";
        console.log("Stopped");
        page.editColor = 'light';
        page.deleteColor = 'dark';

        window.clearInterval(x);
      } else {

        var hours = Math.floor(distance / (1000 * 60 * 60));
        var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3);

        if (hours >= 24) {
          var days = Math.floor(hours / 24);                      
          hours = hours - (days * 24);

          output = days + "D: " + hours + "h : " + minutes + "m : " + seconds + "." + mseconds + "s";
        }
        if (hours <= 0) {
          output = minutes + "m : " + seconds + "." + mseconds + "s";
        } else if (minutes <= 0) {
          output = seconds + "." + mseconds + "s";
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

  // ionViewWillEnter() {
  //   console.log('hi');
  //   // this.key = this.navParams.get('id');
  //   this.uid = this.fireauth.auth.currentUser.uid;

  //   this.firebase.database
  //     .ref(`/reminders/${this.uid}/${this.key}`)
  //     .on("value", snapshot => {
  //       var result: object = snapshot.toJSON();
  //       this.temp.push(result);
  //       this.reminder = {
  //         title: this.temp[0]["title"],
  //         description: this.temp[0]["description"],
  //         date: this.temp[0]["date"],
  //         time: this.temp[0]["time"]
  //       };
  //       console.log(this.temp[0]);

  //       console.log(this.reminder);
  //       console.log("HIHIHI");
  //       // document.getElementById('timer').innerHTML = '';
  //       let next = new Date(this.reminder.date + " " + this.reminder.time);
  //       this.counting(next, this, false);
  //     });
  // }

  delete() {
    this.firebase.database.ref(`/reminders/${this.uid}/${this.key}`)
      .remove((e) => {
        console.log(e);
      }).then((after) => {
        this.router.navigateByUrl('/home');
      });

    this.custom.toast('Deleted', 'top');
  }

  edit() {
    this.parse.edit_id = this.key;
    this.router.navigateByUrl('/edit');
  }

}
