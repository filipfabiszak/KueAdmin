import { Component, OnInit } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LineService } from '../../services/line-service';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})

export class HomePage implements OnInit {

  public lineName: string;
  public size: number;
  public serving: Object;
  public line: any[];

  constructor(public nav: NavController,
    public navParams: NavParams,
    public navCtrl: NavController,
    public lineService: LineService) {}

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

    nextUser(){
      this.lineService.nextUser();
    }

    previousUser(){
      this.lineService.previousUser();
    }

    showSettings(){
      // this.nav.push(SettingsPage);
    }

    showFullLine(){
      // this.nav.push(FullLinePage);
    }

    getLineSize(){
        this.lineService.lineSize.subscribe(size => this.size = size);
    }

    getServing(){
        this.lineService.serving.subscribe(serving => this.serving = serving);
    }
}
