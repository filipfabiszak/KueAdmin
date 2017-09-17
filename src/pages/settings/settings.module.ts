import { NgModule } from '@angular/core';
import { IonicModule } from 'ionic-angular';
import { SettingsPage } from './settings';

@NgModule({
  declarations: [
    SettingsPage,
  ],

  exports: [
    SettingsPage
  ]
})
export class SettingsModule {}
