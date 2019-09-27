import { Injectable } from '@angular/core'
import { AlertController, ToastController, LoadingController } from '@ionic/angular'
import { Storage } from "@ionic/storage"
import { Router } from '@angular/router'
import { LoadingService } from './loading.service'
import { Countdown } from './modals/countdown'
import { auth } from 'firebase'
import { User } from './modals/user'
import { isComponentInstance } from '@angular/core/src/render3/context_discovery'

@Injectable({
  providedIn: "root"
})
export class CustomService {
  email
  password
  isInfoShown = false
  
  constructor(
    public alertCtrl: AlertController,
    private toastCtrl: ToastController,
    private storage: Storage,
    private loading: LoadingService,
    private loadCtrl: LoadingController,
    private router: Router
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
    let outputArray = array
    outputArray = []

    for (let obj of array) {
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
}