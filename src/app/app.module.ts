import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FIRE_CONFIG } from "../environments/environment-firebase";
import { AngularFireModule, FirebaseOptionsToken } from "@angular/fire";
import { AngularFireAuthModule } from "@angular/fire/auth";
import { AngularFireDatabaseModule } from "@angular/fire/database";

import { IonicStorageModule } from "@ionic/storage";
import { PopComponent } from './pop/pop.component';
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  declarations: [AppComponent, PopComponent],
  entryComponents: [PopComponent],
  imports: [
    IonicModule.forRoot(),
    BrowserModule,
    IonicStorageModule.forRoot(),
    AppRoutingModule,
    AngularFireModule.initializeApp(FIRE_CONFIG),
    AngularFireAuthModule,
    HttpClientModule,
    // PopComponent,
    // Storage,
    AngularFireDatabaseModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    // TextToSpeechOriginal,
    // NetworkOriginal,
    // Storage,
    // FacebookOriginal,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    // { provide: FirebaseOptionsToken, useValue: FIRE_CONFIG }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
