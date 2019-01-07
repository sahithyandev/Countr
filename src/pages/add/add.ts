import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { Storage } from '@ionic/storage';

/**
 * Generated class for the AddPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-add',
  templateUrl: 'add.html',
})
export class AddPage {
	title: string;
	date: string;
	time: string;
	description: string;
	public count_downs;

  constructor(public navCtrl: NavController, public navParams: NavParams, public view: ViewController, public storage: Storage) {
  }

  getdata = this.storage.get('counting').then((value) => {
  	if (value == null) {
  		value = [];
  	}
  	this.count_downs = value;
  });

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddPage');
  }

	saveItem() {
		let newCD = {
			"id" : (this.count_downs.length + 1),
			"title" : this.title,
			"date" : this.date,
			"time" : this.time,
			"description" : this.description
		};
		this.count_downs.push(newCD);

		this.storage.set('counting', this.count_downs);

		this.navCtrl.pop();
		location.reload();
	}

}
