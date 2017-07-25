import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { ProvideData } from "../../providers/provide-data";
import { GlobalVars } from "../../providers/global-vars";
import { Page2 } from '../page2/page2';

@Component({
  selector: 'page-member-detail',
  templateUrl: 'member-detail.html'
})
export class MemberDetailPage {

  data:any = {};
  allData:any ;
  memberDetail:any = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public provideData: ProvideData,
              public globalVars: GlobalVars
              ) {
    this.data = navParams.get('data');
    this.allData = navParams.get('allData');
   console.log(this.data); 

  //  let allData = this.provideData.getDetails();
   this.memberDetail = this.provideData.getMemberDetailWithName(this.data['name'], this.allData);
   console.log(this.memberDetail);


  }

  //this is called when view is clicked..
  showDetail(index) {
      console.log(this.memberDetail[index]);
      var x = this.memberDetail[index];
      let total = this.provideData.getTotal(this.memberDetail, this.globalVars.members);
      this.navCtrl.push(Page2, {content : x, total : total, index: index});
    }

  
}
