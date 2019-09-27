import { Component, OnInit } from '@angular/core'
import { Router } from '@angular/router'
import { ToastController, PopoverController, Platform, AlertController } from '@ionic/angular'
import { Storage } from '@ionic/storage'

// import * as firebase from 'firebase'
// import { AngularFireAuth } from '@angular/fire/auth'
// import { AngularFirestore, Query } from '@angular/fire/firestore'

import * as moment from 'moment'

// import { User } from '../modals/user'
import { Countdown } from '../modals/countdown'
import { Note } from '../modals/note'
import { CustomService } from '../custom.service'
import { DataService } from '../data.service'
import { LoadingService } from '../loading.service'
import { PopComponent } from '../pop/pop.component'

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  // profile = {
  //   id: this.fireauth.auth.currentUser.uid
  // } as User
  // countdowns  = Array<Countdown>()
  // notes = Array<Note>()

  // countdownRef : Query
  // notesRef : Query
  // showWatermark = false // tells when to show watermark
  newNote = {
    text: "",
    isStarred: false
  } as Note

  constructor(
    public storage: Storage,
    private platform: Platform,
    private router: Router,
    public custom: CustomService,
    // public data: DataService,
    public parse: DataService,
    private loading: LoadingService,
    public toastCtrl: ToastController,
    public popCtrl: PopoverController,
    public alertCtrl: AlertController,
  ) { }

  // ionViewWillEnter() {
  //   this.getCountdowns()
  //   this.getNotes()
  // this.getUserData()
  // }

  // async getUserData() {
    // await this.firestore.collection("users").doc(this.profile.id).ref.get().then(snap => {
    //   this.profile.name = snap.get('name')
    //   this.profile.email = this.fireauth.auth.currentUser.email
    //   this.profile.categories = snap.get('categories')
    // })
    // this.parse.user = this.profile
  // }

  ngOnInit() {
    console.log(this.parse.countdowns)
    console.log(this.platform.platforms())
    // this.newNote.owner = this.profile.id
    // this.countdownRef = this.firestore.collection("countdowns").ref.where("owner", "==", this.profile.id).orderBy("datetime")
    // this.notesRef = this.firestore.collection("notes").ref.where("owner", "==", this.profile.id).orderBy("addedTime")

    this.loading.dismiss()
  }

  // getCountdowns() {
  //   this.storage.get('countdowns').then(value => {
  //     console.log(value)
  //     this.parse.countdowns = []
  //   }).catch(console.error)
  //   // this.countdownRef.onSnapshot(snapshot => {
  //   //   this.countdowns = this.parse.user_countdowns = this.custom.snapToArray(snapshot)
  //   //   this.sortCountdowns()
  //   // })
  // }

  // getNotes() {
  //   this.storage.get('notes').then(value => {
  //     console.log(value)
  //     this.parse.notes = []
  //   }).catch(console.error)
  //   // this.parse.notes = JSON.parse(this.storage.getItem('notes'))
  //   // this.notesRef.onSnapshot(snapshot => { // using get() slow downs for about ~300ms
  //   //   this.notes = this.parse.user_notes = this.custom.snapToArray(snapshot)
  //   //   this.sortNotes()
  //   // })
  // }

  logout() {
    // this.fireauth.auth.signOut()
    this.popCtrl.dismiss()
    this.router.navigateByUrl('/login')
    this.custom.toast("Successfully Logged Out!", "top")
  }

  async pop2(poper) {
    return await poper.present();
  }
  
  pop(pop_event) {
    const popover = this.popCtrl
      .create({
        component: PopComponent,
        event: pop_event
      })
      .then(output => {
        this.pop2(output);
      });
  }

}
