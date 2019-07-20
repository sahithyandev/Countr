import { Component, OnInit } from '@angular/core'
import { DataService } from '../data.service';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { User } from '../modals/user';
import { QueryDocumentSnapshot } from '@google-cloud/firestore'
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  // OPTIONS = [
  //   { title: "Allow Shared Countdowns" },
  //   { title: "Log Out" }
  // ]

  profile = {
    id: this.fireauth.auth.currentUser.uid
  } as User
  newProfile = {} as User

  constructor(
    public parse: DataService,
    public fireauth: AngularFireAuth,
    public firestore: AngularFirestore,
    private router: Router
  ) { }

  async getUserData() {
    this.profile.photoURL = `https://via.placeholder.com/150?text=X`
    await this.firestore.collection("users").doc(this.profile.id).ref.onSnapshot(snap => {
      this.profile.name = snap.get('name')
      this.profile.email = this.fireauth.auth.currentUser.email
      this.profile.accept_sharing = snap.get('accept_sharing')
      this.profile.photoURL = snap.get('photoURL')
      this.profile.categories = snap.get('categories')
    })
    this.newProfile = this.profile
  }

  ionViewWillEnter() {
    this.getUserData()
  }

  ngOnInit() {
  }

  saveChanges() {
    this.firestore.collection("users").doc(this.profile.id).update(this.newProfile).then(() => {
      console.log("profile updated successfully")
    }).catch(e => {
      console.error(e)
    })
  }

  logout() {
    console.log("pressed logout")
  }

  categoriesPage() {
    this.router.navigateByUrl('/categories')
  }

}
