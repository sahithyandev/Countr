import { Injectable } from '@angular/core'
import { AlertController, ToastController, LoadingController } from '@ionic/angular'
import { AngularFireAuth } from '@angular/fire/auth'
import { Storage } from "@ionic/storage"
import { Router } from '@angular/router'
import { LoadingService } from './loading.service'
import { AngularFirestore } from '@angular/fire/firestore';
import { CountDown } from './modals/countdown';

@Injectable({
  providedIn: "root"
})
export class CustomService {
  email
  password
  isInfoShown = false
  
  constructor(
    public alertCtrl: AlertController,
    public toastCtrl: ToastController,
    public fireauth: AngularFireAuth,
    public firestore: AngularFirestore,
    public storage: Storage,
    public loading: LoadingService,
    public loadCtrl: LoadingController,
    public router: Router
  ) {}
  
    async presentLoading() {
      const loadingController = document.querySelector('ion-loading-controller')
      await loadingController.componentOnReady()
      
      const loadingElement = await loadingController.create({
        message: 'Please wait...',
        spinner: 'crescent',
        duration: 2000
      })
      return await loadingElement.present()
    }

  async alert_dismiss(title, message) {
    const al = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    })
    al.present()
  }

  async alert_signup(title, message) {
    const al = await this.alertCtrl.create({
      header: title,
      message: message,
      buttons: ['OK']
    })
    al.present()
  }

  snapToArray(snapshot) {
    var Arr = []

    snapshot.forEach(function(child) {
      var item = child.data()
      item.id = child.id

      Arr.push(item)
    })

    return Arr
  }
  async toast(msg, pos) {
    const toast = await this.toastCtrl.create({
      message: msg,
      showCloseButton: false,
      position: pos,
      animated: true,
      mode: 'ios'
    })

    toast.present()

    let t = setTimeout(() => {
      toast.dismiss()
    }, 2000)
  }
  
  removeItem(array, item) {
    let type = typeof(item)
    let outputArray = array
    outputArray = []

    for (let obj of array) {
      console.log(obj)
      if (obj != item) { outputArray.push(obj) }
    }

    return outputArray
  }

  showInfo() {
    console.log("Function fired")
    if (!this.isInfoShown) {
      this.alert_dismiss("Info", "This countdown will be repeated every years")
      this.isInfoShown = true
    }
  }

  syncWithFirestore(countdown: CountDown) {
    let obj = {
      title: countdown.title,
      datetime: countdown.datetime,
      isStarred: countdown.isStarred,
      category: countdown.category,
      description: countdown.description,
      isRepeat: countdown.isRepeat,
      owner: countdown.owner
    }
    
    this.firestore.collection("countdowns").doc(countdown.id).update(obj).then(() => {
      return "success"
    }).catch(e => {
      return e
    })
  }
}
