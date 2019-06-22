import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore, Query } from '@angular/fire/firestore'
import { CustomService } from '../custom.service'
import { Router } from '@angular/router'
import { DataService } from '../data.service'
import { Storage } from "@ionic/storage"
import { ToastController, PopoverController, Platform, AlertController } from '@ionic/angular'
import { PopComponent } from '../pop/pop.component'
import { LoadingService } from '../loading.service'
import { CountDown } from '../modals/countdown'
import { Note } from '../modals/note'
import * as moment from 'moment'
// import {  } from "@ionic-native/local-notifications"

@Component({
  selector: "app-home",
  templateUrl: "./home.page.html",
  styleUrls: ["./home.page.scss"]
})
export class HomePage implements OnInit {
  uid
  countdowns  = Array<CountDown>()
  notes = Array<Note>()

  countdownRef : Query
  notesRef : Query
  // showWatermark = false // tells when to show watermark
  newNote = {
    isStarred: false
  } as Note

  constructor(
    public firestore: AngularFirestore,
    public platform: Platform,
    public fireauth: AngularFireAuth,
    public custom: CustomService,
    public data: DataService,
    public router: Router,
    public parse: DataService,
    public toastCtrl: ToastController,
    public loading: LoadingService,
    public popCtrl: PopoverController,
    public storage: Storage,
    public alertCtrl: AlertController
  ) { }

  ionViewWillEnter() {
    this.getCountdowns()
    this.getNotes()
    this.getCategories() }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid
    this.newNote.owner = this.uid
    this.countdownRef = this.firestore.collection("countdowns").ref.where("owner", "==", this.uid).orderBy("datetime")
    this.notesRef = this.firestore.collection("notes").ref.where("owner", "==", this.uid).orderBy("addedTime")

    this.loading.dismiss()
  }

  async getCategories() {
    this.firestore.collection("users").doc(this.uid).ref.get().then(snapshot => {
      this.parse.categories = snapshot.get("categories")
    }).catch(e => {
      console.log("Error " + e) 
    })
  }

  async getCountdowns() {
    this.countdownRef.onSnapshot(snapshot => {
      snapshot.forEach(doc => {
        this.countdowns = this.parse.user_countdowns = this.custom.snapToArray(snapshot)
      })
      this.sortCountdowns()
      // find if finished
      this.countdowns.forEach(countdown => {
        if (countdown.datetime < moment().format()) {
          countdown.isFinished = true
        }
      })
    })
  }

  async getNotes() {
    this.notesRef.onSnapshot(snapshot => { // using get() slow downs for about ~300ms
      snapshot.forEach(doc => {
        this.notes = this.parse.user_notes = this.custom.snapToArray(snapshot)
      })
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

  async details(countDownId) {
    this.parse.countDownId = countDownId
    for (let countdown of this.parse.user_countdowns) {
      if (countdown.id == countDownId) {
        console.log("Count down found")
        this.parse.details_countdown = countdown
      }
    }
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
  }

  sortNotes() {
    this.parse.user_notes.sort((a, b) => (a.isStarred && !(b.isStarred) ? -1 : 1))
  }

  logout() {
    this.fireauth.auth.signOut()
    this.popCtrl.dismiss()
    this.storage.remove('loggedInfo')
    this.router.navigateByUrl('/login')
    this.custom.toast("Successfully Logged Out!", "top")
  }

  deleteCountdown(countDownId) {
    this.firestore.collection("countdowns").doc(countDownId).delete().then(() => {
      this.custom.toast("Countdown Deleted", "top")
    })
  }

  deleteNote(note: Note) {
    this.firestore.collection("notes").doc(note.id).delete().then(() => {
      this.custom.toast("Note Deleted", "top")
      this.notes = this.parse.user_notes = Array<Note>()
      this.getNotes()
    })
  }

  async pop2(poper) {
    return await poper.present()
  }

  pop(pop_event) {
    const popover = this.popCtrl
      .create({
        component: PopComponent,
        mode: 'ios',
        event: pop_event
      })
      .then(output => {
        this.pop2(output)
      });
  }
}
