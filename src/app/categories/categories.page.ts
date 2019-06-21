import { Component, OnInit } from '@angular/core'
import { AngularFirestore } from '@angular/fire/firestore'
import { AngularFireAuth } from '@angular/fire/auth'
import { AddCategoryComponent } from '../add-category/add-category.component'
import { PopoverController, AlertController } from '@ionic/angular'
import { DataService } from '../data.service'
import { Router } from '@angular/router'
import { CustomService } from '../custom.service'
import { CountDown } from '../modals/countdown';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.page.html',
  styleUrls: ['./categories.page.scss'],
})
export class CategoriesPage implements OnInit {
  uid // id of the user
  categories: Array<String>

  constructor(
    public firestore: AngularFirestore,
    public fireauth: AngularFireAuth,
    public popCtrl: PopoverController,
    public router: Router,
    public parse: DataService,
    public alertCtrl: AlertController,
    public custom: CustomService
  ) { }

  ngOnInit() {
    this.uid = this.fireauth.auth.currentUser.uid
    this.categories = this.parse.categories

    // this.firestore.collection("users").doc(this.uid).ref.onSnapshot(snapshot => {
    //   this.categories = this.parse.categories = snapshot.get("categories")
    //   console.log(this.categories)
    // }, e => { console.log("Error " + e) })
  }

  pop(event) { // to add category
    const popover = this.popCtrl
      .create({
        component: AddCategoryComponent,
        mode: 'ios',
        event: event
      })
      .then(output => {
        this.popPresent(output)
      });
  }

  async popPresent(pop: HTMLIonPopoverElement) {
    return await pop.present()
  }

  goCategoryPage(category) {
    this.parse.selectedCategory = category
    this.router.navigateByUrl('/category-countdowns')
  }

  delete(item) {
    let canDelete = this.checkCategory(item)
    let verified = true

    if (!canDelete) {
      verified = this.getVerified()

      if (verified) {

        let countdownlist: Array<CountDown> = this.parse.user_countdowns

        for (let countdown of countdownlist) {
          if (countdown.category == item) {
            this.firestore.collection("countdowns").doc(countdown.id).update({
              category: "__default__"
            })
          }
        }
      } else {
        this.custom.toast("Category Not Deleted", "top")
        console.log("delete rejected")
        return null
      }
    }

    let newArray

    newArray = this.categories = this.parse.categories = this.custom.removeItem(this.categories, item)
    console.log(newArray)

    this.firestore.collection("users").doc(this.uid).update({
      categories: newArray
    })
  }

  checkCategory(item): boolean {
    let countdownlist: Array<CountDown> = this.parse.user_countdowns

    for (let countdown of countdownlist) {
      if (countdown.category == item) return false
    }
    return true
  }

  async showToast(): Promise<boolean> {
    const al = await this.alertCtrl.create({
      header: "Warning",
      message: "Be sure, All your countdowns with this category will be changed to 'default' category if you agree.",
      buttons: [{
        text: "Ok",
        handler: () => {
          console.log("going over")
          return true
        }
      }, {
        text: "Noo..",
        handler: () => {
          console.log("rejected")
          return false
        }
      }],
    })

    al.present()
    return
  }

  getVerified() : boolean {
    let verified: boolean

    this.showToast().then(v => {
      console.log(v)
      verified = v
    }).catch(e => {
      console.log(e)
      verified = false
    })

    return verified
  }
}
