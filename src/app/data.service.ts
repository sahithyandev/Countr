import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { CountDown } from './modals/countdown';

@Injectable({
  providedIn: "root"
})
export class DataService {

  countDownId;
  edit_id;
  public email;
  password;

  available_offline: boolean;

  constructor(
    public fireauth: AngularFireAuth,
    public storage: Storage,
    public router: Router
  ) {}

  
}
