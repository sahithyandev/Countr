import { Component, OnInit } from '@angular/core';
import { LoadingService } from '../loading.service';

@Component({
  selector: 'app-no-internet',
  templateUrl: './no-internet.page.html',
  styleUrls: ['./no-internet.page.scss'],
})
export class NoInternetPage implements OnInit {

  constructor(
    public loading: LoadingService
  ) { }

  ngOnInit() {
    this.loading.dismiss();
  }

}
