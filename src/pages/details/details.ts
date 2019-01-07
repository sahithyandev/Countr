import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Storage } from '@ionic/storage';
import { EditPage } from '../edit/edit';

/**
 * Generated class for the DetailsPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-details',
  templateUrl: 'details.html',
})
export class DetailsPage {
	item;
	title;
	description;
	date;
	time;
	timer;
	id;
	ex_time;

	editColor = 'secondary';
	deleteColor = 'danger';

  constructor(public navCtrl: NavController, public navParams: NavParams, public storage: Storage) {
  }

	counting(next, page) {
	var output;
    var stop = next.getTime();
    var x = window.setInterval(function(){
      var now = new Date().getTime();
			var distance = stop - now;

			if (distance <= 0) {
				output = "Count Down Finished";
				console.log("Stopped");
				page.editColor = 'light';
				page.deleteColor = 'dark';

				window.clearInterval(x);
			} else {

				var hours = Math.floor(distance / (1000 * 60 * 60));
				var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
				var seconds = Math.floor((distance % (1000 * 60)) / 1000);
				var mseconds = ('000' + Math.floor(distance % 1000)).substr(-3);

				if (hours >= 24) {
					var days = Math.floor(hours / 24);
					hours = hours - (days * 24);

					output = days + "D: " + hours + "h : " + minutes + "m : " + seconds + "." + mseconds + "s";
				}
				if (hours == 0) {
					output = minutes + "m : " + seconds + "." + mseconds + "s";
				} else if (minutes == 0) {
					output = seconds + "." + mseconds + "s";
				}
			}

			try {
				document.getElementById('timer').innerHTML = output;
			} catch (error) {
				window.clearInterval(x);
				console.log("Stopped because of \n" + error);
			}
		}, 1);
  	}

  	ionViewDidLoad() {
		this.item = this.navParams.get('item');
		this.title = this.item.title;
		this.description = this.item.description;
		this.id = this.item.id;
		this.date = this.item.date;
		this.time = this.item.time;

		this.ex_time = new Date(this.date + " " + this.time);
		this.counting(this.ex_time, this);
	}

	delete(id) {
		let countdowns = this.storage.get('counting').then((value) => {
			for (let i = 0; i < value.length; i++) {
				if (value[i].id == id) {
					value.splice(i, 1);
				}
			}

			console.log(countdowns);

			for (let i = 0; i < value.length; i++) {
				value[i].id = i + 1;
			}

			this.storage.set('counting', value);

			this.navCtrl.pop();
			location.reload();
		});

	}

	edit(id) {
		this.navCtrl.push(EditPage, {
			id: id
		});
	}

}
