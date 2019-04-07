import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { CustomService } from '../custom.service';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { Storage } from "@ionic/storage";
import { ToastController, PopoverController, Platform } from '@ionic/angular';
import { PopComponent } from '../pop/pop.component';
import { LoadingService } from '../loading.service';
import { LocalNotifications } from '@ionic-native/local-notifications/ngx';
import { toTypeScript } from '@angular/compiler';

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
    public plt: Platform,
    public fireauth: AngularFireAuth,
    public custom: CustomService,
    public data: DataService,
    public localNotification: LocalNotifications,
    public router: Router,
    public parse: DataService,
    public toastCtrl: ToastController,
    public loading: LoadingService,
    public popCtrl: PopoverController,
    public storage: Storage
  ) {
    this.plt.ready().then(() => {
      // handle the notification to delete and open the app
      // Check it
      this.localNotification.on('enter').toPromise().then((notification) => {

        this.data.countDownId = notification.data;
        this.router.navigateByUrl('/details');

      }).catch((error) => {
        console.log(error);
      });

      this.localNotification.on('delete').toPromise().then((notification) => {
        
        this.delete(notification.data);

      }).catch((error) => {
        console.log(error);
      });
    })
  }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid;

    try {
      this.firebase.database
        .ref(`/reminders/${this.uid}`)
        .on("value", snapshot => {
          this.loading.dismiss();
          this.count_downs = this.custom.snapToArray(snapshot);
        });
    } catch (e) {
      this.loading.dismiss();
      console.log("No Internet");
      // swal
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
    this.popCtrl.dismiss();
    this.storage.remove('loggedInfo');
    this.router.navigateByUrl('/login');
    this.custom.toast("Successfully Logged Out!", "top");
  }

	delete(countDownId) {
    this.localNotification.cancel(countDownId);
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
