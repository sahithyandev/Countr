import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { Storage } from "@ionic/storage";
import { identifierModuleUrl } from '@angular/compiler';

@Injectable({
  providedIn: "root"
})
export class DataService {

  count_down_id;
  edit_id;
  email;
  password;

  constructor(
    public fireauth: AngularFireAuth,
    public storage: Storage,
    public router: Router
  ) {}

  
}
