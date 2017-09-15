import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LineService } from '../services/line-service';
import { PhonePage }from'../phone/phone';
import { NoPhonePage }from'../no-phone/no-phone';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {

  public size: number;
  public serving: string;
  public lineName: string;

  constructor(public nav: NavController, public navParams: NavParams, public navCtrl: NavController, public lineService: LineService) {}

    ngOnInit(){
        this.updateLineInfo();
        this.getLineSize();
        this.getServing();
    }

    updateLineInfo(){
        let homeController = this;
        this.lineService.setServing();
        this.lineService.setLineSize();
        this.lineService.getLineName(function(name){
            homeController.lineName = name.split('_').join(' ');
            console.log(homeController.lineName);
        });
    }

    getLineSize(){
        this.lineService.lineSize.subscribe(size => this.size = size);
    }

    getServing(){
        this.lineService.serving.subscribe(serving => this.serving = serving);
    }
}
