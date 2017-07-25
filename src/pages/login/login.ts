import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { SignupPage } from '../signup/signup'
import { MyApp } from '../../app/app.component'

import { ProvideData } from "../../providers/provide-data";
import { Alert } from "../../providers/alert";
import { GlobalVars } from "../../providers/global-vars";



@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {

/********* variables  ********* */

login: Object = {};

/***************************** */
  constructor(public navCtrl: NavController, public navParams: NavParams,
               public provideData: ProvideData, public alertShow: Alert,
               public globalVars: GlobalVars
               ) {}


// THIS IS CALLED WHEN LOGIN IS CLICKED..
  loginSubmit() {
    if(this.login['phone_no'] != "" && this.login['password']) {
      // means fileds are filled..
      if(this.login['phone_no'].length == 10 && parseInt(this.login['phone_no'].length) != NaN) {
        // means no is valid..

        var token = this.createToken(this.login['phone_no'], this.login['password']);
        this.login['token'] = token;
        // request for login..
        var url = "http://myrent.hol.es/hisaab/login.php";

        this.provideData.dataRequest(this.login, url).subscribe(
          (result) => {
            console.log(result);
          //checking the result obtained..
          if(result['resCode'] == 0) {
            // means account created..
            this.alertShow.presentAlert('Success.. :))', result['message']);
            localStorage.setItem('phone_no', this.login['phone_no']);
            localStorage.setItem('email', result['email']);
            localStorage.setItem('name', result['name']);
            localStorage.setItem('profile_url', result['profile_url']);
            this.globalVars.name = result['name'];
            this.globalVars.email = result['email'];
            this.globalVars.phone_no = localStorage.getItem('phone_no');
            this.globalVars.profile_url = result['profile_url'];
            let loading = this.provideData.presentLoadingDefault();

            this.provideData.getAllGroups(this.login['phone_no']).then(
                (done) => {
                  loading.dismiss();
                  console.log(done);
                  // this.globalVars.getNotification();
                  localStorage.setItem('token', this.login['token']);
                  setTimeout( () => {
                  this.navCtrl.setRoot(MyApp, { data : this.login['phone_no'] });
                  } , 1000 );
              }
            );
          } else {
            // error occured..
            this.alertShow.presentAlert('Error  :((', result['message']);
          }
          }
        );
      } else {
        // invalid no..
        this.alertShow.presentAlert('Error  :((', 'Phone no is not valid \n It must be of 10 digits only...');
      }
    } else {
      // some field is empty.....
      this.alertShow.presentAlert('Error  :((', 'Please fill all the fields..');
    }
  }

  // THIS IS CALLED WHEN THE SIGNUP IS CLICKED..
  signupSubmit() {
    // navigate to signup page..
    this.navCtrl.push(SignupPage, {'data' : this.login});
  }

   createToken(name, pass) {
    var temp = 0;
    for(var i=0; i<name.length; i++) {
      temp += name.charCodeAt(i);
    }

    for(var i=0; i<pass.length; i++) {
      temp += pass.charCodeAt(i);
    }
    var d = new Date();
    temp += d.getMilliseconds() + d.getSeconds() + d.getMinutes();
    return temp;
  }
}
