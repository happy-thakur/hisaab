import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { AlertController } from 'ionic-angular';
import 'rxjs/add/operator/map';


@Injectable()
export class Alert {

  constructor(public http: Http, private alertCtrl: AlertController) {
    console.log('Hello Alert Provider');
  }

  
    //this is to show alert..
    presentAlert(title, subTitle) {
    let alert = this.alertCtrl.create({
      title: title,
      subTitle: subTitle,
      buttons: ['OK..']
    });
    alert.present();
  }

}
