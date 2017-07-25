import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { Alert } from "../../providers/alert";
import { ProvideData } from "../../providers/provide-data";
import { GlobalVars } from '../../providers/global-vars';

@Component({
  selector: 'page-group-create',
  templateUrl: 'group-create.html'
})
export class GroupCreatePage {

/**************  VARIABLES   ************ */

  create: Object = {};
  members: any = [1];
  phone_no: String;
/*************************************** */
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertShow: Alert,
               public provideData: ProvideData, public globalVars: GlobalVars) {
                 this.phone_no = localStorage.getItem('phone_no');
               }

// to decrease th no of input fields..
decrease(i) {
  if(this.members.length<14) {
    var count = 0;
    if(this.create['member'] != undefined && this.create['member'] != "") {
      if(this.create['member'+(i)] == undefined || this.create['member'+(i)] == "") {
        console.log('empty');
      } else {
        for(var j=1; j<=this.members.length; j++) {
          if(this.create['member'+(j)] == undefined || this.create['member'+(j)] == "")
            count++;
        }
        console.error(count);
        if(count == 0)
          this.members.push(this.members.length+1);
        }
        // for(var z=0; z<count; z++) {
        //   this.members.pop(this.members.length-z);
        // }
    }
  } else {
    this.alertShow.presentAlert('Alert !!!', "Maximum member allowed in a is 15");
  }
}

//  THIS IS CALLED WHEN A GROUP CREATE BUTTON IS LCICKED..
groupCreateSubmit() {

  var url = "http://myrent.hol.es/hisaab/createGroup.php";
  var message = "";
  console.log('create');
  for(var i in this.create) {
    console.log(i);
    if(i.indexOf('member') >= 0) {
      if(this.create[i] == "" || this.create[i] === undefined) {
        delete this.create[i];
      } else {
        //means no is present and now validate..
        if(this.create[i].length != 10 || parseInt(this.create[i]) == NaN) {
          // means no is invalid..
          message += '\n' + this.create[i];
        }
      }
    }
  }
  if(message != "") {
    this.alertShow.presentAlert('Error !!!', "Numbers : "+message+ " are Invalid");
  } else {
    // means we can request for creating a group..
    this.create['author'] = localStorage.getItem('phone_no');
    let loading = this.provideData.presentLoadingDefault();
    this.provideData.dataRequest(this.create, url).subscribe(
      (data) => {
          loading.dismiss();
          if(data['resCode'] == 0) {
            this.globalVars.getNotification();
            this.provideData.getAllGroups(localStorage.getItem('phone_no')).then(
              (data2) => {
                console.log(data2);
              }
            );
            this.alertShow.presentAlert('Success  :))', "Group Created..");
          } else if(data['resCode'] == 6) {
            var f = "";
            data['userNotPresent'].forEach(user => {
              f += "    " + user;
            });
            this.alertShow.presentAlert('Error !!!', data['message'] +f);
          } else {
            this.alertShow.presentAlert('Error !!!', data['message']);
          }
      }
    );
  }
  console.info(this.create);
}


}
