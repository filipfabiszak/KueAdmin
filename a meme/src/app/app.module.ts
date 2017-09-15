import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

// Http import
import { HttpModule } from '@angular/http';

// Page imports
import { CategoryPage } from '../pages/category/category';
import { ListPage } from '../pages/list/list';
import { TabsPage } from '../pages/tabs/tabs';
import { SingleItem } from '../pages/single-item/single-item';

import { HomePage } from '../pages/home/home';

import { Login } from '../pages/login/login';
import { ResetPassword } from '../pages/reset-password/reset-password';
import { Signup } from '../pages/signup/signup'

// Service imports
import { ItemApi } from '../services/item-api.service';

import { AuthData } from '../services/auth-data';
import { LineService } from '../services/line-service';
import { LeadmeService } from '../services/leadme-service';



// Native imports
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

@NgModule({
  declarations: [
    MyApp,

    CategoryPage,
    ListPage,
    SingleItem,
    TabsPage,
    HomePage,

    Login,
    ResetPassword,
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

    CategoryPage,
    ListPage,
    SingleItem,
    TabsPage,
    HomePage,

    Login,
    ResetPassword,
    Signup

  ],
  providers: [
    StatusBar,
    SplashScreen,
    ItemApi,
    HttpModule,

    AuthData,
    LeadmeService,

    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
