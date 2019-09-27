import { Injectable } from '@angular/core'
import { Router } from '@angular/router'
import { Storage } from "@ionic/storage"

import { Note } from './modals/note'
import { Countdown } from './modals/countdown'
import { User } from './modals/user'

import * as moment from 'moment'

@Injectable({
  providedIn: "root"
})
export class DataService {
  public user: User
  public details_countdown: Countdown // passing a count down form home page to details page
  public edit_countdown: Countdown
  public selectedCategory // category selected by the user
  public countdowns: Array<Countdown> = [] // user's countdowns
  public notes: Array<Note> = [] // user's notes
  public countdownToShare: Countdown
  public categories: Array<string> = []

  constructor(
    public storage: Storage,
    public router: Router
  ) {
    // this.clearStorage()
    console.log('getting data')
    this.getNotes()
    this.getCountdowns()
    this.getCategories()
    console.log(this.countdowns, this.notes)
  }

  getNotes() {
    this.storage.get('notes').then(value => {
      console.log(value)
      if (value) this.notes = value
      this.sortNotes()
    }).catch(console.error)
  }

  getCountdowns() {
    this.storage.get('countdowns').then(value => {
      console.log(value)
      if (value) this.countdowns = value
      this.sortCountdowns()
    }).catch(console.error)
  }
  
  getCategories() {
    this.storage.get('categories').then(value => {
      console.log(value)
      if (value) this.categories = value
    }).catch(console.error)
  }

  sortCountdowns() {    
    if (this.countdowns.length > 0) this.countdowns.sort((a, b) => (a.isStarred && !(b.isStarred) ? -1 : 1))

    this.countdowns.forEach(countdown => {
      if (countdown.datetime < moment().format()) {
        countdown.isFinished = true
      }
    })
  }

  sortNotes() {
    this.notes.sort((a, b) => (a.isStarred && !(b.isStarred) ? -1 : 1))
  }

  public addCountdown(countdown: Countdown) {
    console.log(countdown)
    this.countdowns.push(countdown)
    this.updateStorage('countdowns')
  }

  public addNote(note: Note) {
    console.log(note)
    this.notes.push(note)
    this.updateStorage('notes')
  }

  public removeCountdown(countdown: Countdown) {
    console.log(countdown)
    let filtered = this.countdowns.filter((value, index, err) => {
      this.compare(value, countdown)
    })
    console.log(filtered)
    this.countdowns = filtered
    this.updateStorage('countdowns')
  }

  public removeNote(note: Note) {
    console.log(note)
    let filtered = this.notes.filter((value, index, err) => {
      this.compare(value, note)
    })
    console.log(filtered)
    this.notes = filtered
    this.updateStorage('notes')
  }

  compare(obj1, obj2) {
    // isSame = true
    Object.keys(obj1).forEach(key => {
      if (obj1[key] != obj2[key]) return false
    })
    return true
  }

  public updateStorage(field) {
    if (field == 'countdowns') this.storage.set('countdowns', this.countdowns)
    if (field == 'notes') this.storage.set('countdowns', this.notes)
    if (field == 'categories') this.storage.set('countdowns', this.categories)
  }

  private clearStorage() {
    this.storage.clear()
  }
}
