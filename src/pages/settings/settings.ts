import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LineService } from '../../services/line-service';

@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})

export class SettingsPage implements OnInit {


  constructor(public nav: NavController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public lineService: LineService) {}

    ngOnInit(){
    }

}
