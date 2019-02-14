import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { CustomService } from '../custom.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Storage } from "@ionic/storage";
import { ToastController, PopoverController } from '@ionic/angular';
import { PopComponent } from '../pop/pop.component';
import { LoadingService } from '../loading.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  uid;
  count_downs;

  constructor(
    public firebase: AngularFireDatabase,
    public fireauth: AngularFireAuth,
    public custom: CustomService,
    public localNotification: LocalNotifications,
    public router: Router,
    public parse: DataService,
    public toastCtrl: ToastController,
    public loading: LoadingService,
    public popCtrl: PopoverController,
    public storage: Storage
  ) {}

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid;

    try {
      this.firebase.database
        .ref(`/reminders/${this.uid}`)
        .on("value", snapshot => {
          this.loading.dismiss();
          this.count_downs = this.custom.snapToArray(snapshot);
          this.storage.set('countdowns', this.count_downs);
        });
    } catch (e) {
      this.storage.get('countdowns').then((data) => {
        this.loading.dismiss();
        this.count_downs = data;
      });
    }
  }

  add() {
    this.router.navigateByUrl('/add');
  }

  async details(countDownId) {
    this.parse.countDownId = countDownId;
    await this.router.navigate(['/details']);
  }

  logout() {
    this.fireauth.auth.signOut();
    this.storage.remove('loggedInfo');
    this.router.navigateByUrl('/login');
    this.custom.toast("Successfully Logged Out!", "top");
  }

  removeNotification(countDownId) {
    this.localNotification.cancel(countDownId);
  }

	delete(countDownId) {
    this.removeNotification(countDownId);
    this.firebase.database.ref(`/reminders/${this.uid}/${countDownId}`).remove();
  }

  async pop2(poper) {
    return await poper.present();
  }
  
  pop(pop_event) {
    const popover = this.popCtrl
      .create({
        component: PopComponent,
        mode: 'ios',
        event: pop_event
      })
      .then(output => {
        this.pop2(output);
      });
  }
}
