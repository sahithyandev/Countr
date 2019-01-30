import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FIRE_CONFIG } from "./environment-firebase";
import { AngularFireModule } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";
import { IonicStorageModule } from "@ionic/storage";
import { Network, NetworkOriginal } from '@ionic-native/network';
import { TextToSpeech } from '@ionic-native/text-to-speech';
// import { Storage } from "@ionic/storage";

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    IonicModule.forRoot(),
    BrowserModule,
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(FIRE_CONFIG),
    AngularFireAuthModule,
    // Storage,
    AngularFireDatabaseModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // TextToSpeechOriginal,
    // NetworkOriginal,
    // Storage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
