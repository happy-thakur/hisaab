import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { AlertController, ToastController } from 'ionic-angular';

import { ProvideData } from './provide-data';
import { Alert } from './alert';
// import { MyApp } from '../app/app.component';


@Injectable()
export class PopoverProvider {

  constructor(public http: Http, public alertCtrl: AlertController,
              public provideData: ProvideData, public alertShow: Alert,
              public toast: ToastController) {
    console.log('Hello PopoverProvider Provider');
    
  }

//  radio alert to show to remove member...
  removeMember(navParams) {

    let phone_no = localStorage.getItem('phone_no');
    let alert = this.alertCtrl.create();
    alert.setTitle('Lightsaber color');
   navParams.data['memberTotal'].forEach(element => {
     if(element.phone_no != phone_no) {
        alert.addInput({
        type: 'radio',
        label: element.name +'('+element.phone_no+')',
        value: element.phone_no,
        checked: false
      });
     }
   });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        console.log(data);

              var url = "http://myrent.hol.es/hisaab/queryrequest.php";
              var x = {};
              x['phone_no'] = phone_no;
              x['group_id'] = navParams.data['group_id'];
              x['query'] = "removeMember, "+phone_no+": "+data;
              x['content'] = "none";
              console.log(x);
              this.provideData.dataRequest(x, url).subscribe(
                (result) => {
                  if(result['resCode'] == 0) {
                    //success..
                    // this.alertShow.presentAlert('Success..', "Request have been done. Member will be added only when all the member accepts this request..");
                    this.presentToast("Request have been done. Member will be removed only when all the member accepts this request..");
                  } else {
                    //errror
                    this.alertShow.presentAlert('Error!!!', "Some error occured..")
                  }
                }
              );


      }
    });
    alert.present();
  }

  //  this is to show the input field
addMember(navParams) {
  let prompt = this.alertCtrl.create({
    title: 'Add Member',
    message: "Enter the Phone No. of new Member",
    inputs: [
      {
        name: 'phone_no',
        placeholder: 'Phone No.',
        type: "tel"
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
          console.log('Saved clicked');
           console.log(data);
        // this.testRadioOpen = false;
        // this.testRadioResult = data;

        // check for valid phone no..
        if(data['phone_no'].length == 10 && parseInt(data['phone_no']) != NaN) {
            // check if user exist or not..
            this.provideData.getRequest("http://myrent.hol.es/hisaab/checkUser.php?phone_no="+data['phone_no']).subscribe(
              (result) => {
                console.log(result);

                if(result['resCode'] == 0) {
                  //success
                  var phone_no = localStorage.getItem('phone_no');
                  var url = "http://myrent.hol.es/hisaab/queryrequest.php";
                  var x = {};
                  x['phone_no'] = phone_no;
                  x['group_id'] = navParams.data['group_id'];
                  x['query'] = "add, "+phone_no+": "+data['phone_no'];
                  x['content'] = "none";
                  console.log(x);
                  this.provideData.dataRequest(x, url).subscribe(
                    (result) => {
                      if(result['resCode'] == 0) {
                        //success..
                        // this.alertShow.presentAlert('Success..', "Request have been done. Member will be added only when all the member accepts this request..");
                        this.presentToast("Request have been done. Member will be added only when all the member accepts this request..");
                      } else {
                        //errror
                        this.alertShow.presentAlert('Error!!!', "Some error occured..")
                      }
                    }
                  );

                } else if(result['resCode'] == 1) {
                  // user not found
                  this.alertShow.presentAlert('Alert!!!', data['phone_no']+" is not present in the database")
                } else {
                  // error..
                  this.alertShow.presentAlert('Error!!!', "Some error occured..")
                }
              }
            );
          } else {
            this.alertShow.presentAlert('Error!!!', "Please enter Valid Phone No. It must be of 10 digits only..")
          }
        }
      }
    ]
  });
  prompt.present();
}

  /// to remove the group..
  removeGroup(navParams) {
    let confirm = this.alertCtrl.create({
      title: 'Remove Group..',
      message: 'Are you sure you want to remove Group..',
      buttons: [
        {
          text: 'No..',
          handler: () => {
            console.log('Disagree clicked');
            this.presentToast('You have decline to remove the group...');

          }
        },
        {
          text: 'Yess..',
          handler: () => {
            console.log('Agree clicked');
            this.presentToast('Group will be removed when all the member accepts your request.. You can also cancel it..');
              var phone_no = localStorage.getItem('phone_no');
              var url = "http://myrent.hol.es/hisaab/queryrequest.php";
              var x = {};
              x['phone_no'] = phone_no;
              x['group_id'] = navParams.data['group_id'];
              x['query'] = "removeGroup, "+phone_no;
              x['content'] = "none";
              console.log(x);
              this.provideData.dataRequest(x, url).subscribe(
                (result) => {
                  if(result['resCode'] == 0) {
                    //success..
                   this.presentToast("Request have been done. Group will be removed only when all the member accepts this request..");
                  } else {
                    //errror
                    this.alertShow.presentAlert('Error!!!', "Some error occured..")
                  }
                }
              );

          }
        }
      ]
    });
    confirm.present();
  }

  // to leave the group...
  leaveGroup(navCtrl, navParams) {
     let confirm = this.alertCtrl.create({
      title: 'Leave Group..',
      message: 'Are you sure you want to Leave Group..',
      buttons: [
        {
          text: 'No..',
          handler: () => {
            console.log('Disagree clicked');
            this.presentToast('You have decline to left the group...');

          }
        },
        {
          text: 'Yess..',
          handler: () => {
            console.log('Agree clicked');
            var x = {};
            x['group_id'] = navParams.data['group_id'];
            x['phone_no'] = localStorage.getItem('phone_no');
            x['content'] = "leaveGroup";

            var url = "http://myrent.hol.es/hisaab/queryrequest.php";
            this.provideData.dataRequest(x, url).subscribe(
              (result) => {
                if(result['resCode'] == 0) {
                  this.provideData.getAllGroups(localStorage.getItem('phone_no')).then(
                    (myData) => {
                      console.log(myData);
                      this.presentToast('You Left the group..');
                      // navCtrl.popTo(MyApp);
                    }
                  );
                  
                } else {
                  // error..
                  this.alertShow.presentAlert('Error!!!', "Some error occured..")
                }
              }
            );
          }
        }
      ]
    });
    confirm.present(confirm);
    // return false;

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
