import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { ProvideData } from "../../providers/provide-data";
import { Alert } from "../../providers/alert";


@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {

  /******* variables  ********* */

  signup: Object = {};
  c_password: string;
  error = null;
  errorMess = "";

  /**************************** */
  constructor(public navCtrl: NavController, public provideData: ProvideData,
             public navParams: NavParams, public alertShow: Alert) {}



  // CALLED WHEN SIGNUP IS CLICKED..
  signupSubmit() {
    console.log(this.signup);
    if(this.signup['name'] !== undefined && this.signup['email'] !== undefined && this.signup['phone_no'] !== undefined && this.signup['password'] !== undefined) {
      // this means all the fields are filled now we can submit the form..
      this.validationCheck();
      if(this.error == null) {

        var token = this.createToken(this.signup['name'], this.signup['password']);
        this.signup['token'] = token;
        // sending request..
        var url = "http://myrent.hol.es/hisaab/signup.php";
        let loading = this.provideData.presentLoadingDefault();

        this.provideData.dataRequest(this.signup, url).subscribe(
          (result) => {
            loading.dismiss();
            console.log(result);
          //checking the result obtained..
          if(result['resCode'] == 0) {
            // means account created..
            this.alertShow.presentAlert('Success.. :))', result['message']);
          } else {
            // error occured..
            this.alertShow.presentAlert('Error  :((', result['message']);
          }
          }
        );


      } else {
        this.alertShow.presentAlert('Error', this.errorMess);
      }
    } else {
      // show alert...
      this.alertShow.presentAlert('Empty Input field', 'Please fill all the fields..');
    }


  }


/***************    VALIDATION CHECKING STARTS ********************* */

 //  TO CHECK FOR THE PASSWORD..
 validationCheck(){

  var phone = this.signup['phone_no'];
  var email = this.signup['email'];

   // pass CHECK
   if(this.signup['password'] != this.c_password) {
     // means pass not equal..
     this.error = true;
     this.errorMess = "Password Did't match..";
  } else if(email.indexOf('@') < 0 || email.indexOf('.') < 0) {
   //  email check..
     // invalid email..
     this.error = true;
     this.errorMess = "Invalid Email Id..";
   } else  if(phone.length != 10 || parseInt(phone) == NaN ) {
   //  phone check..
     // invalid phone no..
     this.error = true;
     this.errorMess = "Invalid phone no..\n It must be of 10 digits only";
   } else {
     this.error = null;
     this.errorMess = "";
   }

 }


/***************    VALIDATION CHECKING ENDS ********************* */

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
