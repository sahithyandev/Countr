import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class CustomService {

  constructor(
    public alertCtrl: AlertController
  ) { }

  alert_dismiss(title, message) {
    this.alertCtrl.create({
      // title: title,
        message: message
    });
    console.log(title + " " + message);
  }

  snapToArray(snapshot) {
    var Arr = [];

    snapshot.forEach(function (child) {
      var item = child.val();
      item.key = child.key;

      Arr.push(item);
    });

    return Arr;
  }
}
