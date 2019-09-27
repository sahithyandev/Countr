import { Component, OnInit } from '@angular/core'
import { DataService } from 'src/app/data.service'
import { Note } from 'src/app/modals/note'

import * as moment from 'moment'
import { CustomService } from 'src/app/custom.service'

@Component({
  selector: 'app-notes',
  templateUrl: './notes.page.html',
  styleUrls: ['./notes.page.scss'],
})
export class NotesPage implements OnInit {
  newNote = {
    text: '',
    isStarred: false
  } as Note

  constructor(
    public parse: DataService,
    public custom: CustomService
  ) { }

  ngOnInit() {
  }

  deleteNote(note: Note) {
    console.log(note)
    this.parse.removeNote(note)
    // this.firestore.collection("notes").doc(note.id).delete().then(() => {
    //   this.custom.toast("Note Deleted", "top")
    //   this.notes = this.parse.user_notes = Array<Note>()
    //   this.getNotes()
    // })
  }

  starNote(note: Note) {
    let newValue = !note.isStarred
    note.isStarred = newValue
    // this.firestore.collection("notes").doc(note.id).update({
    //   isStarred: note.isStarred
    // })
    // this.sortNotes()
  }

  saveNote() {
    console.log(this.newNote)
    this.newNote.addedTime = moment().format()

    if (this.newNote.text) {
      this.parse.notes.push(this.newNote)
      // this.firestore.collection("notes").add({
      //   text: this.newNote.text,
      //   owner: this.newNote.owner,
      //   isStarred: this.newNote.isStarred,
      //   addedTime: this.newNote.addedTime
      // }).then(() => {
      //   this.newNote.text = ""
      //   console.log(this.parse.user_notes)
      // })
    } else {
      this.custom.alert_dismiss("Can't add", "Please give a name to your <b>Note</b>")
    }
  }

}
