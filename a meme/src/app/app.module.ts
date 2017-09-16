import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Http import
import { HttpModule } from '@angular/http';

// Native imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

// Page imports
import { HomePage } from '../pages/home/home';
import { Login } from '../pages/login/login';
import { Signup } from '../pages/signup/signup'

// Service imports
import { ItemApi } from '../services/item-api.service';

import { AuthData } from '../services/auth-data';
import { LineService } from '../services/line-service';
import { LeadmeService } from '../services/leadme-service';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    Login,
    Signup
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    Login,
    Signup
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ItemApi,
    HttpModule,
    AuthData,
    LeadmeService,
    LineService,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
