import { Component, OnInit } from '@angular/core'
import { AngularFireAuth } from '@angular/fire/auth'
import { AngularFirestore } from '@angular/fire/firestore'

import { User } from './../modals/user'
import { CountDown } from '../modals/countdown'
import { CustomService } from '../custom.service'
import { DataService } from '../data.service'
import { NavController } from '@ionic/angular'

@Component({
  selector: 'app-share-countdown',
  templateUrl: './share-countdown.page.html',
  styleUrls: ['./share-countdown.page.scss'],
})
export class ShareCountdownPage implements OnInit {
  countdown: CountDown
  toShareList: Array<User> = []
  usersList: Array<User> = []
  showList: Array<User> = []

  constructor(
    public parse: DataService,
    public firestore: AngularFirestore,
    public fireauth: AngularFireAuth,
    public navCtrl: NavController,
    private custom: CustomService
  ) { }

  async getUsers() {
    await this.firestore.collection("users").ref.where("accept_sharing", "==", true).orderBy("name").get().then(snap => {
      this.usersList = this.custom.snapToArray(snap)
    })

    for (let user of this.usersList) {
      if (user.id != this.fireauth.auth.currentUser.uid) this.showList.push(user)
      if (!this.countdown.sharedWith) this.countdown.sharedWith = []
      if (this.countdown.sharedWith.includes(user.id)) this.toShareList.push(user.id)
    }
  }

  ngOnInit() {
    this.countdown = this.parse.countdownToShare
    this.getUsers()
  }

  share() {
    // get things ready
    let userids: Array<String>= []
    this.toShareList.forEach(user => {
      userids.push(user.id)
    })

    if (this.toShareList.length == 0) this.custom.alert_dismiss("No Users Selected", "Select anyone to share with.")
    this.firestore.collection("countdowns").doc(this.countdown.id).update({
      sharedWith: userids
    }).then(snap => {
      console.log("shared successfully")
      this.navCtrl.navigateBack('/details')
    }).catch(e => {
      console.error(e)
    })
  } 

  onSearchChange(event) {
    this.showList = []
    const query = event.target.value.toLowerCase()
    requestAnimationFrame(() => {
      this.usersList.forEach((user) => {
        const shouldShow = user.name.toLowerCase().indexOf(query) > -1;
        if (shouldShow) this.showList.push(user)
      })
    })
  }

  selectUser(user: User, event) {
    let isChecked = event.srcElement.checked

    if (!isChecked) this.toShareList = this.custom.removeItem(this.toShareList, user)
    else this.toShareList.push(user)
  }

}
