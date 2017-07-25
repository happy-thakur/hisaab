import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AlertController, PopoverController } from 'ionic-angular';

import { ProvideData } from "../../providers/provide-data";
import { Alert } from "../../providers/alert";
import { Page2 } from '../page2/page2';
import { MemberDetailPage } from '../member-detail/member-detail';
import { GroupSettingPopoverPage } from "../group-setting-popover/group-setting-popover";

import { PopoverProvider } from '../../providers/popover-provider'
import { GlobalVars } from '../../providers/global-vars'

@Component({
  selector: 'page-page1',
  templateUrl: 'page1.html'
})
export class Page1 {

data: any = null;
total: number = 0;
members: any = [];
memberTotal: any = Array();
empty:boolean = false;
group_name: string;
group_id: string;
query: any = null;
phone_no: any;
filterValue: string = 'null';
all: boolean = true;

  constructor(public navCtrl: NavController, public provideData: ProvideData,
              private alertCtrl: AlertController, public navParams: NavParams,
              public alertShow: Alert, public popoverCtrl: PopoverController,
              public popoverShow: PopoverProvider, public globalVars: GlobalVars
              ) {
        this.globalVars.profile_url = localStorage.getItem('profile_url');
        this.innerContainer(this).then(
          (data) => {console.log(data);}
        );
  }
 
  //thsi is the inner of the container..
  innerContainer(now) {
    return new Promise(
      (resolve) => {

        now.globalVars.makeEmpty();
        //console.log(now.globalVars.name);
        now.phone_no = localStorage.getItem('phone_no');
        now.group_id = now.navParams.get('group_id');
        now.group_name = now.navParams.get('group_name');
        //console.log(now.group_name);
        // now is done to get members..
        now.provideData.getMemberDetails(now.navParams.get('group_id'))
          .then( (memberDetails) => {
          //  global var..
              now.globalVars.members = memberDetails;
              now.members = memberDetails;
              console.log(now.globalVars.members);
              })
          .then(() => {
          now.provideData.getDetails(now.navParams.get('group_name'))
          // })
          .then( (allData) => {
          // global var..
              now.globalVars.data = allData;
              now.data = allData;
              console.log(now.globalVars.data);
              })
          .then( () => {
          // global var...
              now.total = now.provideData.getTotal(now.globalVars.data, now.globalVars.members);
              console.log(now.globalVars.total);

              if(now.data.length > 0) {
                now.empty = true;
              } else {
                now.empty = false;
              }

              now.globalVars.total = now.provideData.getTotal(now.globalVars.data, now.globalVars.members);
              console.log(now.globalVars.data);

              // to calculate the member total..
              now.provideData.calcMemberTotal();

              // now done to check query..
              now.getQuery();
              resolve('done');
              });
            });
          });
  }

   // this done to check any query..
   getQuery() {
     /*
      1 >>  hisaab..
      2 >>  Remove member
      3 >>  add member...
      4 >>  remove this group
      5 >>  leave this group..
      */
     var phone_no = localStorage.getItem('phone_no');
     var url = "http://myrent.hol.es/hisaab/queryrequest.php?group_id="+this.group_id+"&phone_no="+phone_no;

     this.provideData.getRequest(url).subscribe(
       (result) => {
         //console.log(result);
         if(result['resCode'] == 0) {
           // means query is present..

           this.query = result['query'];
           this.globalVars.query = result['query'];

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



  //this is called when view is clicked..
  showDetail(index) {
    //console.log(this.globalVars.data[index]);
    var x = this.globalVars.data[index];
    this.navCtrl.push(Page2, {content : x, total : this.globalVars.total, index: index});
  }


  // this is to show the memberb details..
  showMember(index) {
    //console.log(index);
    this.navCtrl.push(MemberDetailPage, {data : this.globalVars.memberTotal[index], allData: this.globalVars.data});
  }

  // this function check if query is present or not
  checkQuery(code) {
    var temp = 0;
    //console.log(this.globalVars.query);
      this.globalVars.query.forEach(one => {
        //console.log(one.content.code);
      if(parseInt(one.content.code) === code) {
        // means query for hisaab is present..
        temp = 1;
        return true;
      }
      //console.log(one);
    });
    if(temp != 1)
      return false;
  }

  // this is called when an item is added..
  addItem() {
    //console.log('item add');
    //console.log(this.checkQuery(1));
    // check if query is present then show alert mess...
    // if(this.checkQuery(1) == true) {
    //   // show alert message..
    //   this.alertShow.presentAlert('Alert', "No data will be save till the Hisaab has been done!!! So try to complete it as soon as possible..");
    //   return ;
    // }

    let alert = this.alertCtrl.create({
      title: 'Add Item',
      inputs: [
        {
          name: 'item',
          placeholder: 'Item/ Items'
        },
        {
          name: 'cost',
          placeholder: 'Enter total Cost'
        },
        {
          name: 'date',
          placeholder: 'Enter Date',
          type: 'date'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Done',
          handler: data => {
            //we have data in data as object..
            if(data.item !== "" && data.cost != "" && data.date != "") {

              // adding additional details..
              data['groupname'] = this.group_id;
              data['name'] = localStorage.getItem('name');
              data['phone_no'] = localStorage.getItem('phone_no');
              let loading = this.provideData.presentLoadingDefault();

              this.provideData.addItem(data)
              .then(
                (data2) => {
                  loading.dismiss();
                  if(data2['resCode'] == 0) {
                    //success..
                    this.alertShow.presentAlert('Success', data['message']);
                    this.globalVars.total = this.provideData.getTotal(this.globalVars.data, this.globalVars.members);
            //
              // /      this.total += parseInt(data.cost);
                    // this.updateMemberTot(data['name'], data.cost, 'add');
                    this.provideData.getDetails(this.group_name)
                    .then(
                      result => { this.globalVars.data = result; }
                    );
                    this.empty = true;
                    //console.log(data2);
                  } else {
                    // error
                    this.alertShow.presentAlert('Error !!!', data2['message']);
                  }
                });

            } else {
              //console.log('error occured');
            }
          }
        }
      ]
    });
    alert.present();
  }

  // this is done to update the member total...
  updateMemberTot(name, cost, operation){
    if(operation == 'add') {
      //addition..
      for(var i in this.globalVars.memberTotal) {
        if(this.globalVars.memberTotal[i].name == name) {
          console.info(this.globalVars.memberTotal[i].name);
          if(this.globalVars.memberTotal[i].total === undefined)
            this.globalVars.memberTotal[i].total = parseInt(cost);
          else
            this.globalVars.memberTotal[i].total += parseInt(cost);
        }
      }
    } else {

    }
  }


  // TO ACTIVATE POPOVER...
  presentPopover(myEvent) {
      let popover = this.popoverCtrl.create(GroupSettingPopoverPage,
         { total : this.globalVars.total, memberTotal: this.globalVars.memberTotal,
           group_id: this.group_id, query: this.globalVars.query });
      popover.present({
        ev: myEvent
      });
    }

  //  when query is accepted..
  accept(data) {
    var url = "http://myrent.hol.es/hisaab/update.php";

    //console.log('accepted');
    //console.log(data);
    var y = {};

    y['about'] = "query";
    y['phone_no'] = localStorage.getItem('phone_no');
    y['group_id'] = this.group_id;
    y['query'] = data.content.lastQuery;

    let loading = this.provideData.presentLoadingDefault();

    this.provideData.dataRequest(y, url).subscribe(
      (result) => {
        if(result['resCode'] == 0) {
          // success..
          // check if code == 0 && done == 0 && removeGroup == 0 then remove the groupp//
          console.log(result);
          if(result.extra !== undefined) {
            if(result.extra['done'] == 0 && result.extra['removeGroup'] == 0 ) {
              this.provideData.getAllGroups(localStorage.getItem('phone_no')).then(
                (data3) => {
                  console.log(data3);
                }
              );
            }
          }
          data.myValue = 1;
          this.popoverShow.presentToast('Your data has been updated...');

        } else {
          // error occured..
          this.alertShow.presentAlert('Error !!!', 'Unable to process now... ')
        }
        loading.dismiss();
      }
    );
  }

  //  when query is rejected..
  reject(data) {
    var url = "http://myrent.hol.es/hisaab/queryrequest.php";

    //console.log('rejected');
    //console.log(data);
    let y:any = {};
    y['phone_no'] = localStorage.getItem('phone_no');
    y['group_id'] = this.group_id;
    y['query'] = "rejection, "+data.content.lastQuery+'? '+y['phone_no'];
    y['content'] = 'rejection';
    y['lastQuery'] = data.content.lastQuery;
    //console.log(data.content.lastQuery);
    let loading = this.provideData.presentLoadingDefault();

    this.provideData.dataRequest(y, url).subscribe(
      (result) => {
        loading.dismiss();
        if(result['resCode'] == 0) {
          data.myValue = 1;
          this.popoverShow.presentToast('Your process has been processed..');
        } else {
          // error
          this.alertShow.presentAlert('Error !!!', 'Unable to process now... ')
        }
      }
    );
  }

  toggle(data, val) {
     var x = {};
    x['group_id'] = data.group_id;
    x['phone_no'] = localStorage.getItem('phone_no');
    x['s_no'] = data.s_no;
    x['about'] = "item";
    x['value'] = val;
    var url = "http://myrent.hol.es/hisaab/update.php";
    this.provideData.dataRequest(x, url).subscribe(
      (result) => {
    if(result['resCode'] == 0) {
        this.popoverShow.presentToast('Request accepted');
    } else {
      // error..
      this.popoverShow.presentToast('Error occured');
    }
      }
    );
  }

  //accpet the item means to check the item..
  acceptItem(data, index) {
    this.toggle(data, 0);
    this.globalVars.data[index][this.phone_no] = '1';
    this.globalVars.data[index].approved[this.phone_no] = '1';
    this.globalVars.total = this.provideData.getTotal(this.globalVars.data, this.globalVars.members);
    this.provideData.calcMemberTotal();

  }

  //reject to item means to uncheck the item..
  rejectItem(data, index) {
    this.toggle(data, 1);
    this.globalVars.data[index][this.phone_no] = '0';
    this.globalVars.data[index].approved[this.phone_no] = '0';
    this.globalVars.total = this.provideData.getTotal(this.globalVars.data, this.globalVars.members);
    this.provideData.calcMemberTotal();
  }

  // this is to delete item..
  deleteItem(data, index) {
    // now remove the data..
    console.log(data);
    var x = {};
    x['s_no'] = data['s_no'];
    x['group_id'] = data['group_id'];
    x['about'] = "deleteItem";

    var url = "http://myrent.hol.es/hisaab/update.php";
    this.provideData.dataRequest(x, url).subscribe(
      (result) => {
    if(result['resCode'] == 0) {
        this.popoverShow.presentToast('Item deleted...');
        this.globalVars.data.splice(index, 1);
    } else {
      // error..
      this.popoverShow.presentToast('Some Error occured');
    }
      }
    );
  }


  // thtis is for the refresher..
  doRefresh(event) {
    console.log('refresh itt..');
    this.innerContainer(this).then(
      (data) => {
        console.log(data);
        event.complete();
      }
    );
  }
  myFilter(data) {
    this.filterValue = data;
    console.log(this.filterValue);
    if(data == 'null') {
      this.all = true;
    } else {
      this.all = false;
    }
  }
}
