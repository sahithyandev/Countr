import { Injectable } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { Router } from '@angular/router'
import { Storage } from "@ionic/storage"

@Injectable({
  providedIn: "root"
})
export class DataService {

  public countDownId // for parsing from home and offline count down
  public details_countdown // passing a count down form home page to details page
  // public edit_id // for parsing from details page to editting page
  public email // email to login
  public password // to authenticate with email
  public edit_countdown
  public categories // categories of the user
  public selectedCategory // category selected by the user
  public user_countdowns // user's countdowns

  public temporaryCountDown = {
    datetime: '' // for parsing time from offline timer to details page
  }

  constructor(
    public fireauth: AngularFireAuth,
    public storage: Storage,
    public router: Router
  ) {}

  
}
