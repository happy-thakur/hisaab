import { Component } from '@angular/core';
import { NavController, NavParams, ViewController, AlertController } from 'ionic-angular';

import { GroupDonePage } from '../group-done/group-done';
import { RequestShowPage } from '../request-show/request-show';


import { PopoverProvider } from '../../providers/popover-provider';
import { Alert } from '../../providers/alert';
import { ProvideData } from '../../providers/provide-data';

@Component({
  selector: 'page-group-setting-popover',
  templateUrl: 'group-setting-popover.html'
})
export class GroupSettingPopoverPage {


  constructor(public navCtrl: NavController, public navParams: NavParams,
               public viewCtrl: ViewController, public alertCtrl: AlertController,
               public popoverProvider: PopoverProvider, public alertShow: Alert,
               public provideData: ProvideData) {

    console.log(navParams);
    console.log(navParams.data['mydata']);
  }

//  COMPUTING THE HISAAB..
  computeHisaab() {
    // this.viewCtrl.dismiss();
    console.log('compute button is clicked..');
    this.navCtrl.push(GroupDonePage, {
      total : parseInt(this.navParams.data['total']),
      memberTotal : this.navParams.data['memberTotal'],
      group_id : this.navParams.data['group_id'],
      query:  this.navParams.data['query']
    });
  }

//  THIS IS TO REQUEST REMOVE A MEMBER FROM THE GROUP....
  removeMember() {
    this.viewCtrl.dismiss();
     var url = "http://myrent.hol.es/hisaab/checkQuery.php?group_id="+this.navParams.data['group_id']+"&query=checkDone"

    let loading = this.provideData.presentLoadingDefault();

    this.provideData.getRequest(url).subscribe(
    (result) => {
      loading.dismiss();
      if(result['resCode'] == 0) {

    // var x = this.checkHisaab();
    // perform
    console.log(' remove member is clickedd');
    this.popoverProvider.removeMember(this.navParams);
    } else {
    // alert
    this.alertShow.presentAlert('Alert !!!', "First complete all the hisabb.. then request...");
    }
    });
  }



//  THIS IS TO ADD A NEW MEMBER TO A GROUP..
  addMember() {
    this.viewCtrl.dismiss();

     var url = "http://myrent.hol.es/hisaab/checkQuery.php?group_id="+this.navParams.data['group_id']+"&query=checkDone"

    let loading = this.provideData.presentLoadingDefault();

    this.provideData.getRequest(url).subscribe(
    (result) => {
      loading.dismiss();
      if(result['resCode'] == 0) {
        // no data present means we can perform operation...
        console.log(' add member is clickedd');
        this.popoverProvider.addMember(this.navParams);
      } else {
        //  some data present .. means we cannot perform operation..
        this.alertShow.presentAlert('Alert !!!', "First complete all the hisabb.. then request...");
      }
    }
    );
  }



//  THIS IS TO REMOVE A GROUP..
  removeGroup() {
    this.viewCtrl.dismiss();
    var url = "http://myrent.hol.es/hisaab/checkQuery.php?group_id="+this.navParams.data['group_id']+"&query=checkDone"

    let loading = this.provideData.presentLoadingDefault();
    this.provideData.getRequest(url).subscribe(
    (result) => {
      loading.dismiss();
      if(result['resCode'] == 0) {
       // perform
      console.log(' remove group is clickedd');
      this.popoverProvider.removeGroup(this.navParams);
      } else {
      // alert
      this.alertShow.presentAlert('Alert !!!', "First complete all the hisabb.. then request...");
      }
    });
    // console.log(' remove group is clickedd');
    // this.popoverProvider.removeGroup(this.navParams);
  }

//  THIS IS TO LEAVE THE GROUP..
  leaveGroup(navCtrl) {
    this.viewCtrl.dismiss();
    var url = "http://myrent.hol.es/hisaab/checkQuery.php?group_id="+this.navParams.data['group_id']+"&query=checkDone"

    let loading = this.provideData.presentLoadingDefault();
    this.provideData.getRequest(url).subscribe(
    (result) => {
      loading.dismiss();
      if(result['resCode'] == 0) {
      // perform
      console.log(' leave group is clickedd');
      this.popoverProvider.leaveGroup(this.navCtrl, this.navParams);
      } else {
      // alert
      this.alertShow.presentAlert('Alert !!!', "First complete all the hisabb.. then request...");
      }
    });

  }


  // this is called when all request is clicked..
  chekQuery() {
    // this.viewCtrl.dismiss();
    this.navCtrl.push(RequestShowPage, {
      group_id : this.navParams.data['group_id']
    });
  }

}
