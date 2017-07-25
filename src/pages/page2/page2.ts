import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';
import { ProvideData } from "../../providers/provide-data";
import { PopoverProvider } from "../../providers/popover-provider";
import { GlobalVars } from '../../providers/global-vars'

@Component({
  selector: 'page-page2',
  templateUrl: 'page2.html'
})
export class Page2 {
  content: any;
  members: any;
  total: number;
  phone_no: string;
  index: any;

  // icons: string[];
  // items: Array<{title: string, note: string, icon: string}>;

  constructor(public navCtrl: NavController, public navParams: NavParams, public provideData: ProvideData,
              public popoverShow: PopoverProvider, public globalVars: GlobalVars
              ) {
    this.globalVars.name = "bye";
    // this will give the content to be shown...
    this.phone_no = localStorage.getItem('phone_no');
    console.log('page2');
    // this.content = navParams.get('content');
    console.log(this.content);
    this.total = navParams.get('total');
    this.members = this.provideData.members;
    this.index = navParams.get('index');
    this.content = this.globalVars.data[this.index];
    console.log(typeof(this.members[0].phone_no));
    console.log(typeof(this.phone_no));
    this.globalVars.total = this.provideData.getTotal(this.globalVars.data, this.globalVars.members);
    this.provideData.calcMemberTotal();
    console.log(this.globalVars.members);
  }

  toggle(data) {
    console.log('clikced');
    console.log(data);
    var x = {};
    x['group_id'] = this.content.group_id;
    x['phone_no'] = localStorage.getItem('phone_no');
    x['s_no'] = this.content.s_no;
    x['about'] = "item";
    x['value'] = this.content[x['phone_no']];
    console.warn(x['value']);

    // to update the global vars..
    if(x['value'] == '0') {
      this.globalVars.data[this.index][x['phone_no']] = '1';
      this.globalVars.data[this.index]['approved'][x['phone_no']] = '1';
    } else {
      this.globalVars.data[this.index][x['phone_no']] = '0';
      this.globalVars.data[this.index]['approved'][x['phone_no']] = '0';
    }
    console.log(this.globalVars.data);
    this.globalVars.total = this.provideData.getTotal(this.globalVars.data, this.globalVars.members);
    this.provideData.calcMemberTotal();



    var url = "http://myrent.hol.es/hisaab/update.php";
    let loading = this.provideData.presentLoadingDefault();

    this.provideData.dataRequest(x, url).subscribe(
      (result) => {
        loading.dismiss();
    if(result['resCode'] == 0) {
        this.popoverShow.presentToast('Request accepted');
    } else {
      // error..
      this.popoverShow.presentToast('Error occured');
    }
      }
    );
  }

}
