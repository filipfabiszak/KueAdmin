import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { TabsPage } from '../pages/tabs/tabs';

import { Login } from '../pages/login/login';


import firebase from 'firebase';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  rootPage:any = TabsPage;

  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen) {
    // Initialize Firebase
    var config = {
      apiKey: "AIzaSyDE-WMV8Pz4ZtIwReSGsK7O6uC4RqOhurY",
      authDomain: "next-80843.firebaseapp.com",
      databaseURL: "https://next-80843.firebaseio.com",
      storageBucket: "next-80843.appspot.com",
      messagingSenderId: "244563636043",
    };
    firebase.initializeApp(config);
    firebase.auth().onAuthStateChanged((user) => {
        // this.rootPage = Login;

        if (!user) {
            console.log("not login");
            // this.rootPage = Login;


        } else {
            console.log("login");
            // this.rootPage = HomePage;

        }

    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      splashScreen.hide();
    });
  }
}
