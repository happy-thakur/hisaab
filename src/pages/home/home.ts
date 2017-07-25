import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';

import { LoginPage } from '../login/login';
// import { Page1 } from '../page1/page1';

import { GlobalVars } from "../../providers/global-vars";



@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  groupError: any;
  group: any;
  phone_no: any;
  message: any;
  imagesLink: any;
  quote: Object = null;
  constructor(public nav: NavController, public navParams: NavParams, public http: Http,
              public globalVars: GlobalVars
              ) {
    console.warn(this.globalVars.temp++);
    this.phone_no = localStorage.getItem('phone_no');
    // this.getAllGroups(this.phone_no);
    if(localStorage.getItem('phone_no') != null) {
      this.phone_no = localStorage.getItem('phone_no');
    } else {
      this.phone_no = "";
      this.nav.setRoot(LoginPage);
    }

    this.imagesLink = [
      './assets/images/img1.png',
      './assets/images/img2.png',
      './assets/images/img3.png',
      './assets/images/img4.png',
      './assets/images/img5.png'
    ];

    this.message = [
      {
        // contains array of first mess..
       '1': ["This application is made to make the calculations easy for all your 'Hisaab'..",
        "In it only you have to make group with which you make your expenses. And save your data for that perticular group..",
        "The item/data is calculated only when all the member accepts the item..",
        "And finally you can finish the hisaab of that group..."],
        'title' : 'What is this app about???'
      },
      {
        '1': ["First Create a group with which you want to add expenses...",
        "After creating the account save the item/data which are purchased..",
        "Finally you can get how much you have to give or take using the done hisaab..",
        ],
        'title': 'How to use it..'
      },
      {
        '1': ["you can create a group with Max of 15 members and min 2 members..",
        "At nay time you can calculate the hisaab..",
        "At any time you can remove or add a member..",
        "You can also leave a group",
        "You can also change your password, Email Id, Name"
        ],
        'title': 'Features..'
      }
    ]
    // getting the quotes..
    var quoteUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&key=557653&format=json&lang=en"
     this.http.get(quoteUrl).map(
  		(res) => res.json()).subscribe(
        (data) => {
          this.quote = data;
        }
      );

  }

    //function to get all the groupss.
    // getAllGroups(phone_no){
    //   console.error(phone_no);
    //   var url = "http://myrent.hol.es/hisaab/getGroups.php?phone_no=";
    //   if(phone_no != null) {
    //     if(phone_no.length == 10 && parseInt(phone_no) != NaN) {
    //       url += phone_no;
    //       this.http.get(url).map(
    //       (res) => res.json()
    //       ).subscribe(
    //         (data) => {
    //           if(data['resCode'] == 0) {
    //             // suucess..
    //             this.groupError = false;
    //             this.group = data['name'];
    //             console.log(this.group);
    //           } else {
    //             this.groupError = true;
    //             console.log('error');
    //             console.log(data);
    //           }
    //         }
    //       );
    //     }
    //   }
    // }

    // // this is to show group details...
    // showGroup(group_name) {
    //   this.nav.setRoot(Page1, { 'group_name' : group_name });
    // }

  // thtis is for the refresher..
  doRefresh(event) {
    console.log('refresh itt..');
    // getting the quotes..
    var quoteUrl = "http://api.forismatic.com/api/1.0/?method=getQuote&key=557653&format=json&lang=en"
     this.http.get(quoteUrl).map(
  		(res) => res.json()).subscribe(
        (data) => {
          this.quote = data;
          event.complete();
        }
      );
  }

}
