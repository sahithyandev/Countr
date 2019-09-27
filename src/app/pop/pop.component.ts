import { Component, OnInit } from '@angular/core'
import { Storage } from "@ionic/storage"
import { Router } from '@angular/router'
import { PopoverController } from '@ionic/angular'

@Component({
  selector: 'app-pop',
  templateUrl: './pop.component.html',
  styleUrls: ['./pop.component.scss']
})
export class PopComponent implements OnInit {

  constructor(
    public storage: Storage,
    public router: Router,
    public popCtrl: PopoverController
  ) { }

  ngOnInit() {
  }

  // logout() {
  //   this.fireauth.auth.signOut().then(() => {
  //     this.storage.remove("loggedInfo")
  //     this.popCtrl.dismiss().then(() => {
  //       this.router.navigateByUrl('/login')
  //       console.log('Signing Out')
  //     })
  //   })
  // }

  // settings() {
  //   this.router.navigateByUrl('/settings');
  //   this.popCtrl.dismiss();
  // }

  feedback() {
    this.popCtrl.dismiss().then(() => {
      this.router.navigateByUrl('/feedback');
    })
  }

  categories() {
    this.popCtrl.dismiss().then(() => {
      this.router.navigateByUrl('/categories')
    })
  }

}
