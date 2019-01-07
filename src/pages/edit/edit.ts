import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-edit',
  templateUrl: 'edit.html',
})
export class EditPage {
    id;
    title;
    description = '';
    date = '';
    time = '';

    newTitle;
    newDescription;
    newDate;
    newTime;

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }
  	ionViewDidLoad() {
        this.id = this.navParams.get('id');

        let data = this.storage.get('counting').then((value) => {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id == this.id) {
                    this.title = value[i].title;
                    this.description = value[i].description;
                    this.date = value[i].date;
                    this.time = value[i].time;
                }
            }
        });
        console.log(data);
    }

    saveEdits() {
        let dataagain = this.storage.get('counting').then((value) => {
            for (let i = 0; i < value.length; i++) {
                if (value[i].id == this.id) {
                    value[i].title = this.title;
                    value[i].description = this.description;
                    value[i].date = this.date;
                    value[i].time = this.time;

                    this.storage.set('counting', value);
                    location.reload();
                }
            }
        });
        console.log(dataagain);
    }

}
