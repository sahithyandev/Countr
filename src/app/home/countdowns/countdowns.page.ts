import { Component, OnInit } from '@angular/core'
import { DataService } from 'src/app/data.service'
import { Countdown } from 'src/app/modals/countdown'
import * as moment from 'moment'
import { CustomService } from 'src/app/custom.service'
import { Router } from '@angular/router'

@Component({
  selector: 'app-countdowns',
  templateUrl: './countdowns.page.html',
  styleUrls: ['./countdowns.page.scss'],
})
export class CountdownsPage implements OnInit {

  constructor(
    public router: Router,
    public parse: DataService,
    public custom: CustomService
  ) { }

  ngOnInit() {
    console.log(location)
  }

  deleteCountdown(countdown: Countdown) {
    console.log(countdown)
    this.parse.removeCountdown(countdown)
  }

  starCountdown(countdown: Countdown) {
    let newValue = !countdown.isStarred
    countdown.isStarred = newValue
    this.parse.updateStorage('countdowns')
  }

  swipeEventHandler(e) {
    console.log("called")
    if (e.direction == 4) { // left to right
      console.log("right")
      console.log(e)
    }
  }

  addPage() {
    console.log('add page routing...')
    this.router.navigateByUrl('/add')
  }

  detailsPage(countdown: Countdown) {
    this.parse.details_countdown = countdown

    this.router.navigate(['/details'])
  }

}
