import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';

import { AlertController, ToastController } from 'ionic-angular';
import { ProvideData } from "../../providers/provide-data";
import { Alert } from '../../providers/alert';
import { PopoverProvider } from '../../providers/popover-provider';
import { GlobalVars } from '../../providers/global-vars';


import { LoginPage } from "../login/login";


/*
  Generated class for the Setting page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-setting',
  templateUrl: 'setting.html'
})
export class SettingPage {

name: string;
email: string;
phone_no: string;

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController,
              public provideData: ProvideData, public alertShow: Alert, public toast: ToastController,
              public popoverProvider: PopoverProvider, public globalVars: GlobalVars
            ) {
    this.globalVars.profile_url = localStorage.getItem('profile_url');
    this.name = localStorage.getItem('name');
    this.phone_no = localStorage.getItem('phone_no');
    this.email = localStorage.getItem('email');
            }
  profileSetting() {
    console.log("you entered into profile setting");
  }

editNameOrEmail(dataContent) {
  let prompt = this.alertCtrl.create({
    title: 'Edit '+dataContent,
    message: "Enter "+dataContent,
    inputs: [
      {
        name: dataContent,
        placeholder: dataContent,
        type: "text"
      },
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          data['phone_no'] = localStorage.getItem('phone_no');
          data['content'] = dataContent;
          // now send the data..
          if(data[dataContent] != "" || data[dataContent] != undefined || data[dataContent] != null) {
            ///now request..
           var url = "http://myrent.hol.es/hisaab/profile_settings.php";
          let loading = this.provideData.presentLoadingDefault();

            this.provideData.dataRequest(data, url).subscribe(
                (result) => {
                  loading.dismiss();
                  if(result['resCode'] == 0) {
                    //success..
                    // this.alertShow.presentAlert('Success..', "Request have been done. Member will be added only when all the member accepts this request..");
                    if(dataContent == 'Name') {
                      this.globalVars.name = data['Name'];
                      localStorage.setItem('name', data['Name']);
                    } else if(dataContent == 'Email') {
                      this.globalVars.email = data['Email'];
                      localStorage.setItem('email', data['Email']);
                    }
                    this.presentToast(result['message']);
                  } else {
                    //errror
                    this.alertShow.presentAlert('Error!!!', "Some error occured..")
                  }
                }
              );

          }
        }
      }
    ]
  });
  prompt.present();
}

editPassowrd() {
  let prompt = this.alertCtrl.create({
    title: 'Edit Password',
    message: "Enter Name",
    inputs: [
      {
        name: 'old_password',
        placeholder: 'Old Password',
        type: "password"
      },
      {
        name: 'new_password',
        placeholder: 'New Password',
        type: "password"
      },
       {
        name: 'c_password',
        placeholder: 'Confirm Password',
        type: "password"
      }
    ],
    buttons: [
      {
        text: 'Cancel',
        handler: data => {
          console.log('Cancel clicked');
        }
      },
      {
        text: 'Save',
        handler: data => {
          console.log(data);
          data['phone_no'] = localStorage.getItem('phone_no');
          data['content'] = 'password';
          // now send the data..
          if(data['new_password'] != "" || data['new_password'] != undefined || data['new_password'] != null) {
            if(data['new_password'] == data['c_password']) {
              // pass matched..
              ///now request..
             var url = "http://myrent.hol.es/hisaab/profile_settings.php";
            let loading = this.provideData.presentLoadingDefault();

              this.provideData.dataRequest(data, url).subscribe(
                  (result) => {
                    loading.dismiss();
                    console.log(result);
                    if(result['resCode'] == 0) {
                      //success..
                      // this.alertShow.presentAlert('Success..', "Request have been done. Member will be added only when all the member accepts this request..");
                      this.presentToast(result['message']);
                    } else if(result['resCode'] == 1) {
                      // pass did't match..
                      this.alertShow.presentAlert('Error!!!', result['messsage']);
                    } else {
                      //errror
                      this.alertShow.presentAlert('Error!!!', "Some error occured..")
                    }
                  }
                );

            } else {
              // pass not matched..
              //errror
              this.alertShow.presentAlert('Error!!!', "Confirm Password didn't match...");
            }
          }
        }
      }
    ]
  });
  prompt.present();
}


// to delete the account..
delete() {

      // now show the confimation..
      let confirm = this.alertCtrl.create({
        title: 'Delete Account..',
        message: 'Are you sure you want to Delete Account. All the data will be removed...',
        buttons: [
          {
            text: 'No..',
            handler: () => {
              console.log('Disagree clicked');
              this.presentToast('You have decline to delete the account...');

            }
          },
          {
            text: 'Yess..',
            handler: () => {
            console.log('Agree clicked');
            
            var temp = {};
            temp['content'] = "deleteAccount";
            temp['phone_no'] = localStorage.getItem('phone_no');
            
            var url = "http://myrent.hol.es/hisaab/profile_settings.php";
            let loading = this.provideData.presentLoadingDefault();

              this.provideData.dataRequest(temp, url).subscribe(
                (result) => {
                  loading.dismiss();
                  if(result['resCode'] == 0) {
                    this.presentToast('You have Successfully deleted the account');
                    localStorage.clear();
                    this.navCtrl.setRoot(LoginPage);
                    
                  } else if(result['resCode'] == 6) {
                    // hisaab not clear..
                    this.alertShow.presentAlert('Hisaab Not clear..', result['message']);
                  } else {
                    // error..
                    this.alertShow.presentAlert('Error!!!', "Some error occured..");
                  }
                }
              );
            }
          }
        ]
      });
      confirm.present(confirm);
}

// toast Show
presentToast(message) {
    let toast = this.toast.create({
      message: message,
      duration: 3000
    });
    toast.present();
  }

}
