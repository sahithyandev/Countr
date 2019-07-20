import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, Query } from '@angular/fire/firestore'
import { CustomService } from '../custom.service'
import { Router } from '@angular/router'
import { DataService } from '../data.service'
import { Storage } from "@ionic/storage"
import { ToastController, PopoverController, Platform, AlertController, NavController } from '@ionic/angular'
import { LoadingService } from '../loading.service'
import { CountDown } from '../modals/countdown'
import { Note } from '../modals/note'
import * as moment from 'moment'

import * as firebase from 'firebase'
import { User } from '../modals/user'
// import {  } from "@ionic-native/local-notifications"

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  profile = {
    id: this.fireauth.auth.currentUser.uid
  } as User
  countdowns  = Array<CountDown>()
  notes = Array<Note>()

  countdownRef : Query
  notesRef : Query
  // showWatermark = false // tells when to show watermark
  newNote = {
    isStarred: false
  } as Note

  constructor(
    private platform: Platform,
    private router: Router,
    private firestore: AngularFirestore,
    private fireauth: AngularFireAuth,
    public custom: CustomService,
    public data: DataService,
    public parse: DataService,
    public loading: LoadingService,
    public toastCtrl: ToastController,
    public popCtrl: PopoverController,
    public alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    this.getCountdowns()
    this.getNotes()
    this.getUserData()
  }

  async getUserData() {
    await this.firestore.collection("users").doc(this.profile.id).ref.get().then(snap => {
      this.profile.name = snap.get('name')
      this.profile.email = this.fireauth.auth.currentUser.email
      this.profile.accept_sharing = snap.get('accept_shares')
      this.profile.photoURL = snap.get('photoURL')
      this.profile.categories = snap.get('categories')
    })
    this.parse.user = this.profile
  }

  ngOnInit() {
    console.log(this.platform.platforms())
    this.newNote.owner = this.profile.id
    this.countdownRef = this.firestore.collection("countdowns").ref.where("owner", "==", this.profile.id).orderBy("datetime")
    this.notesRef = this.firestore.collection("notes").ref.where("owner", "==", this.profile.id).orderBy("addedTime")

    this.loading.dismiss()
  }

  async getCountdowns() {
    this.countdownRef.onSnapshot(snapshot => {
      this.countdowns = this.parse.user_countdowns = this.custom.snapToArray(snapshot)
      this.sortCountdowns()
    })

    this.firestore.collection("countdowns").ref.where("sharedWith", "array-contains", this.profile.id).onSnapshot(snapshot => {
      let countdowns = this.custom.snapToArray(snapshot)
      countdowns.forEach(c => {
        this.countdowns.push(c)
      })

      this.sortCountdowns()
    })
  }

  async getNotes() {
    this.notesRef.onSnapshot(snapshot => { // using get() slow downs for about ~300ms
      this.notes = this.parse.user_notes = this.custom.snapToArray(snapshot)
      this.sortNotes()
    })
  }

  saveNote() {
    console.log(this.newNote)
    this.newNote.addedTime = moment().format()

    if (this.newNote.text) {
      this.firestore.collection("notes").add({
        text: this.newNote.text,
        owner: this.newNote.owner,
        isStarred: this.newNote.isStarred,
        addedTime: this.newNote.addedTime
      }).then(() => {
        this.newNote.text = ""
        console.log(this.parse.user_notes)
      })
    } else {
      this.custom.alert_dismiss("Can't add", "Please give a name to your <b>Note</b>")
    }
  }

  add() {
    this.router.navigateByUrl('/add')
  }

  async detailsPage(countdown: CountDown) {
    this.parse.details_countdown = countdown

    await this.router.navigate(['/details'])
  }

  async starCountdown(countdown: CountDown) {
    let newValue = !countdown.isStarred
    countdown.isStarred = newValue
    this.firestore.collection("countdowns").doc(countdown.id).update({
      isStarred: countdown.isStarred
    })
    this.sortCountdowns()
  }

  async starNote(note: Note) {
    let newValue = !note.isStarred
    note.isStarred = newValue
    this.firestore.collection("notes").doc(note.id).update({
      isStarred: note.isStarred
    })
    this.sortNotes()
  }

  sortCountdowns() {
    if (this.parse.user_countdowns.length > 0) this.parse.user_countdowns.sort((a, b) => (a.isStarred && !(b.isStarred) ? -1 : 1))

    this.countdowns.forEach(countdown => {
      if (countdown.datetime < moment().format()) {
        countdown.isFinished = true
      }
    })
  }

  sortNotes() {
    this.parse.user_notes.sort((a, b) => (a.isStarred && !(b.isStarred) ? -1 : 1))
  }

  logout() {
    this.fireauth.auth.signOut()
    this.popCtrl.dismiss()
    this.router.navigateByUrl('/login')
    this.custom.toast("Successfully Logged Out!", "top")
  }

  deleteCountdown(countdown: CountDown) {
    if (countdown.owner == this.profile.id) {
      this.firestore.collection("countdowns").doc(countdown.id).delete().then(() => {
        this.custom.toast("Countdown Deleted", "top")
      })
    } else {
      this.firestore.collection("countdowns").doc(countdown.id).update({
        sharedWith: firebase.firestore.FieldValue.arrayRemove(this.profile.id)
      }).then(() => {
        this.custom.toast("Shared Countdown Removed", "top")
      }).catch(e => {
        console.log(e)
      })
    }
  }

  deleteNote(note: Note) {
    this.firestore.collection("notes").doc(note.id).delete().then(() => {
      this.custom.toast("Note Deleted", "top")
      this.notes = this.parse.user_notes = Array<Note>()
      this.getNotes()
    })
  }

  // async pop2(poper) {
  //   return await poper.present()
  // }

  // pop(pop_event) {
  //   const popover = this.popCtrl
  //     .create({
  //       component: PopComponent,
  //       mode: 'ios',
  //       event: pop_event
  //     })
  //     .then(output => {
  //       this.pop2(output)
  //     });
  // }

  profilePage() {
    this.router.navigateByUrl('/profile')
  }

  swipeEventHandler(e) {
    console.log(e)
  }

}
