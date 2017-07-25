import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProvideData } from '../../providers/provide-data';
import { GlobalVars } from '../../providers/global-vars';
import { PopoverProvider } from '../../providers/popover-provider';
import { Alert } from "../../providers/alert";


@Component({
  selector: 'page-request-show',
  templateUrl: 'request-show.html'
})
export class RequestShowPage {

query: any;
group_id: string;
phone_no: string;
  constructor(public navCtrl: NavController, public navParams: NavParams, public provideData: ProvideData, public globalVars: GlobalVars,
              public popoverShow: PopoverProvider, public alertShow: Alert
              ) {
    this.group_id = this.navParams.data['group_id'];
    console.log(this.navParams);
    console.info(this.globalVars.members);
    this.getQuery();
    this.phone_no = localStorage.getItem('phone_no');
  }

   // this done to check any query..
   getQuery() {
     /*
     code  --  1 to 5..
      1 >>  hisaab..
      2 >>  Remove member
      3 >>  add member...
      4 >>  remove this group
      5 >>  leave this group..
      */
     var phone_no = localStorage.getItem('phone_no');
     var url = "http://myrent.hol.es/hisaab/queryrequest.php?group_id="+this.group_id+"&phone_no="+phone_no;
     console.log(url);
     this.provideData.getRequest(url).subscribe(
       (result) => {
         console.log(result);
         if(result['resCode'] == 0) {
           // means query is present..

           this.query = result['query'];
           this.globalVars.query = result['query'];
           console.info(this.query);
           // loop to include hounor's accepted value
           this.query.forEach(one => {
             one.detail.forEach( data => {
              if(data.phone_no == phone_no)
                one['myValue'] = data.accepted;
             });
           });
         } else {
           // no query..
           this.query = null;
           this.globalVars.query = null;
         }
         console.log(this.query);
       }
     );
   }


   //to handle toggle..
   toggle(data, allData, i, j) {
     console.warn(data);
     if(data == 1 || data == '1') {
       // means reject
       this.reject(allData, this);
     } else {
       // accept
       this.accept(allData, i, j, this);
     }
   }

  //  when query is accepted..
  accept(data, i, j, now) {
    var url = "http://myrent.hol.es/hisaab/update.php";

    console.log('accepted');
    //console.log(data);
    var y = {};

    y['about'] = "query";
    y['phone_no'] = localStorage.getItem('phone_no');
    y['group_id'] = now.group_id;
    y['query'] = data.content.lastQuery;

    now.provideData.dataRequest(y, url).subscribe(
      (result) => {
        if(result['resCode'] == 0) {
          // success..
          data.myValue = 1;
          now.globalVars.query.
          now.popoverShow.presentToast('Your data has been updated...');
          now.globalVars.query[i].detail[j].accepted = 1;
        } else {
          // error occured..
          now.alertShow.presentAlert('Error !!!', 'Unable to process now... ')
        }
      }
    );
  }

  //  when query is rejected..
  reject(data, now) {
    var url = "http://myrent.hol.es/hisaab/queryrequest.php";

    console.log('rejected');
    //console.log(data);
    let y:any = {};
    y['phone_no'] = localStorage.getItem('phone_no');
    y['group_id'] = now.group_id;
    y['query'] = "rejection, "+data.content.lastQuery+'? '+y['phone_no'];
    y['content'] = 'rejection';
    y['lastQuery'] = data.content.lastQuery;
    //console.log(data.content.lastQuery);
    now.provideData.dataRequest(y, url).subscribe(
      (result) => {
        if(result['resCode'] == 0) {
          data.myValue = 1;
          now.getQuery();
          now.popoverShow.presentToast('Your process has been processed..');
        } else {
          // error
          now.alertShow.presentAlert('Error !!!', 'Unable to process now... ')
        }
      }
    );
  }


}
