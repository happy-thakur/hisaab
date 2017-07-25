import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProvideData } from '../../providers/provide-data';
import { Alert } from '../../providers/alert'

@Component({
  selector: 'page-group-done',
  templateUrl: 'group-done.html'
})
export class GroupDonePage {

  total: any;
  memberTotal: any;
  count: number = 0;
  each: number;
  group_id:any;
  query: any;
  hide: boolean = false;
  constructor(public navCtrl: NavController, public navParams: NavParams,
              public provideData: ProvideData, public alertShow: Alert) {

    var z = 1000;
    console.log(navParams);
    this.total = this.navParams.data['total'];
    this.memberTotal = this.navParams.data['memberTotal'];
    this.group_id = this.navParams.data['group_id'];
    this.query = this.navParams.data['query'];
    console.log(this.total);
    console.log(this.memberTotal);
    console.log(this.memberTotal.length);
    this.count = this.memberTotal.length;
    this.each = this.total/this.count;
    console.log(this.each);
    this.each = Math.round((this.each * z)) / z;
    console.log(this.each);
    console.log(this.query);
    if(this.query != 'null' && this.query !== undefined && this.query != null) {
      for(var i in this.query) {
        if(this.query[i].content.code == 1)
          this.hide = true;
        console.log(this.hide);
      }
    }
  }

//  THIS IS DONE TO SUBMIT HISAAB..
  hisaabDone() {
    console.log('goup done..');

    // before this check for previous hisaab..
    var url2 = "http://myrent.hol.es/hisaab/checkQuery.php?group_id="+this.group_id+"&query=checkHisaab";
    this.provideData.getRequest(url2).subscribe(
      (result) => {
            if(result['resCode'] == 0) {
              // query exists..
              this.alertShow.presentAlert('Error', 'Request already made..');
            } else if(result['resCode'] == 1) {
              // noo query present..
              var url = "http://myrent.hol.es/hisaab/queryrequest.php";
              var x = {};
              x['phone_no'] = localStorage.getItem('phone_no');
              x['group_id'] = this.group_id;
              x['query'] = "hisaab, "+x['phone_no'];
              x['content'] = "none";
              console.log(x);
              this.provideData.dataRequest(x, url).subscribe(
                (result) => {
                  console.log(result);
                }
              );
            } else {
              this.alertShow.presentAlert('Error', 'Database error..');
            }
    });

      }
}
