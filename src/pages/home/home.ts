import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { Storage } from "@ionic/storage";

import { AddPage } from '../add/add';
import { DetailsPage } from "../details/details";

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
	public countdowns;

  constructor(public navCtrl: NavController, public storage: Storage) {
  }

	ionViewDidLoad() {
		let getdata = this.storage.get('counting').then((value) => {
	  	if (value == null) {
	  		value = [];
	  	}
	  	console.log(getdata);
			this.countdowns = value;
		});
	}

	addPage() {
		this.navCtrl.push(AddPage);
	}

	viewItem(item) {
		this.navCtrl.push(DetailsPage, {
			item: item
		});
	}
}
