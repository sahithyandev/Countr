import { Component, OnInit } from '@angular/core';
import { Storage } from "@ionic/storage";
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.page.html',
  styleUrls: ['./settings.page.scss'],
})
export class SettingsPage implements OnInit {
  available_offline: boolean = false;
  new_password: string;

  constructor(
    public storage: Storage,
    public router: Router
  ) { }

  ngOnInit() {
  }

  check() {
    this.storage.set('AvailableOffline', this.available_offline);
  }

  feedback() {
    this.router.navigateByUrl('/feedback');
  }
}
