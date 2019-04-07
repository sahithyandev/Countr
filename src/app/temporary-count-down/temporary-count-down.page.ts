import { Component, OnInit, ElementRef } from '@angular/core';
import * as moment from 'moment';
import { CustomService } from '../custom.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-temporary-count-down',
  templateUrl: './temporary-count-down.page.html',
  styleUrls: ['./temporary-count-down.page.scss'],
})
export class TemporaryCountDownPage implements OnInit {
  time = moment()
    .minute(0)
    .second(0)
    .millisecond(0)
    .format();

  max_time = moment()
    .minute(10)
    .second(0)
    .millisecond(0)
    .format();

  constructor(
    public custom: CustomService,
    public parse: DataService,
    public router: Router
  ) { }

  ngOnInit() {}

  startTimer() {
    // console.log(moment().add(this.))
    let readableTime = moment(this.time);
    this.parse.temporaryCountDown.datetime = moment().add({minutes: readableTime.minute(), seconds: readableTime.second()}).format();
    console.log(this.parse.temporaryCountDown.datetime);
    
    this.parse.countDownId = -1;
    // this.parse.temporaryCountDown.datetime = this.time;
    this.router.navigateByUrl('/details');
    // this.counting(new Date(this.time), this);
  }

  // counting(next, page) {
  //   // page.ex_time = next;
  //   var output;
  //   var stop = next.getTime();
  //   var x = window.setInterval(function () {
  //     var now = new Date().getTime();
  //     var distance = stop - now;
  //     // console.log(distance);                     

  //     if (distance <= 0) {
  //       output = "Finished";
  //       console.log("Stopped");
  //       window.clearInterval(x);
  //       document.getElementById('timer').innerHTML = output;
  //       // page.finished();
  //     } else {

  //       var hours = Math.floor(distance / (1000 * 60 * 60));
  //       var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
  //       var seconds = Math.floor((distance % (1000 * 60)) / 1000);
  //       var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3);

  //       if (hours >= 24) {
  //         var days = Math.floor(hours / 24);
  //         hours = hours - (days * 24);

  //         output = days + "D: " + hours + "h : " + minutes + "m : " + seconds + "." + mseconds + "s";
  //       } else {
  //         if (hours <= 0) {
  //           if (minutes <= 0) {
  //             output = seconds + "." + mseconds + "s";
  //           } else {
  //             output = minutes + "m : " + seconds + "." + mseconds + "s";
  //           }
  //         } else if (minutes <= 0) {
  //           output = seconds + "." + mseconds + "s";
  //         } else {
  //           output = hours + "h : " + minutes + "m : " + seconds + "." + mseconds + "s";
  //         }
  //       }
  //     }

  //     try {
  //       document.getElementById('timer').innerHTML = output;
  //     } catch (error) {
  //       window.clearInterval(x);
  //       console.log("Stopped");
  //     }
  //   }, 1);
  // }
}
