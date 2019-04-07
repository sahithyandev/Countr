import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
})
export class NoInternetPage implements OnInit {

  constructor(
    public loading: LoadingService,
    public router: Router
  ) { }

  ngOnInit() {
    this.loading.dismiss();
  }

  temporaryCountDown() {
    this.router.navigateByUrl('/temporaryCountDown');
  }

}
