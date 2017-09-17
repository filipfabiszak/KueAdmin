import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { Login } from '../pages/login/login';

import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = Login;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    var config = {
      apiKey: "AIzaSyDE-WMV8Pz4ZtIwReSGsK7O6uC4RqOhurY",
      authDomain: "next-80843.firebaseapp.com",
      databaseURL: "https://next-80843.firebaseio.com"
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged(() => {
        this.rootPage = Login;
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
