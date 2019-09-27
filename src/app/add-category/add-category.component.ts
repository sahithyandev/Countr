import { Component, OnInit, ElementRef } from '@angular/core'
import { DataService } from './../data.service'
import { PopoverController } from '@ionic/angular'

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss'],
})
export class AddCategoryComponent implements OnInit {
  uid // id of user
  category : String = null // new category
  // ref : DocumentReference // ref of the user
  oldCategories : Array<String> // already existing categories

  constructor(
    public parse: DataService,
    public popCtrl: PopoverController,
    public element: ElementRef
  ) { }

  ngOnInit() {
    // this.uid = this.fireauth.auth.currentUser.uid
    // this.ref = this.firestore.collection("users").doc(this.uid).ref
    this.oldCategories = this.parse.user.categories
  }

  add() {
    // create a new array of new categories
    let newCategories = this.oldCategories
    newCategories.push(this.category)
    // update firestore
    // this.ref.update({
    //   categories: newCategories
    // })
    // dismiss the popover
    this.popCtrl.dismiss()
  }

}
