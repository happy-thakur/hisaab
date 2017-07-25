
import { Component, OnDestroy } from '@angular/core';
// import { RouterLink, Router } from '@angular/router';
import {NgForm} from '@angular/forms';

import { AuthService } from '../../providers/auth.service';
// import { GlobalDataService } from '../global-data.service';
import { GetDataService } from '../../providers/get-data.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css'],
  providers: [AuthService, GetDataService]
})
export class SignupComponent implements OnDestroy {

private subscriptions: Array<Subscription> = [];
defaultURL: string = "https://yt3.ggpht.com/-BReUM2rDhGM/AAAAAAAAAAI/AAAAAAAAAAA/d-gLG-rmoUA/s288-c-k-no-mo-rj-c0xffffff/photo.jpg";
loginData = {
  email: "",
  password: ""
};
signupData = {
  name: "",
  email: "",
  password: ""
};

allright = {
  login: true,
  signup: true,
  loginMess: "",
  signupMess: ""
};

showLogin: boolean = false;


  ngOnDestroy(): void {
      this.subscriptions.forEach((subscription: Subscription) => {
          subscription.unsubscribe();
      });
  }
  constructor(private authService: AuthService, private getData: GetDataService) {
   }


 
  login() {
    // console.log(this.loginData);
    // check Data
    // this.globalData.ShowNoti("top", "left");
    if(this.loginData['email'] !== undefined && this.loginData['email'].length < 4) {
      this.allright['loginMess'] = "Please enter a valid Email Id";
      this.allright['login'] = false;
    } else if(this.loginData['password'] !== undefined && this.loginData['password'].length <= 6) {
      this.allright['loginMess'] = "Please enter password greater than 6";
      this.allright['login'] = false;
    } else {
      this.allright['loginMess'] = "";
      this.allright['login'] = true;
    }
    if(this.allright['login']) {
      // this.globalData.mainLoader = true;

      this.authService.emailLogin(this.loginData['email'], this.loginData['password']).then(
        (data) => {
          console.log(data);
          console.log("done");  
          // console.log(this.signupData.name);
          document.cookie = "token="+data.refreshToken;
          // this.globalData.isLoggedIn = true;
          // this.globalData.profileInfo.name = data.displayName;
          // this.globalData.profileInfo.email = data.email;
          // this.globalData.profileInfo.photoURL = this.defaultURL;
          // this.globalData.emailVerified = data.emailVerified;

          localStorage.setItem("email", data.email);
          localStorage.setItem("uid", btoa(btoa(btoa(btoa(btoa(btoa(data.uid)))))));
          localStorage.setItem("user-name", data.displayName);
          localStorage.setItem("photoURL", this.defaultURL);
          localStorage.setItem("providerId", data.providerData[0].providerId);

          // check if entry exixst in database..
          let provider = data.providerData[0].providerId;
          this.subscriptions.push(this.getData.getDataList('/users/'+provider+"/"+data['uid']).subscribe((data) => {
                      if(data == null || data.length == 0) {
                        // no data exist..
                        // move to after signup
                        // this.router.navigate(['/afterSignup']);
                      } else {
                        // move to maon-page
                        // this.router.navigate(['/index/main-page']);
                        window.location.href = window.location.origin+"/index/main-page";
                      }
                    }));
        // this.globalData.mainLoader = false;

        }).catch(
          (err) => {
            console.log(err['message']);
            // this.globalData.mainLoader = false;

            this.allright['loginMess'] = err['message'];
            this.allright['login'] = false;
    })
  }
}


  logout() {
    // this.globalData.mainLoader = true;

    this.authService.logout();
    // this.globalData.mainLoader = false;

    // this.globalData.isLoggedIn = false;
    window.location.href = window.location.origin+"/";
  }


  emailAndPassSignup() {
    // first validate..

    if(this.signupData['email'] === undefined || this.signupData['email'].length < 4) {
      this.allright['signupMess'] = "Please enter a valid Email Id";
      this.allright['signup'] = false;
    } else if(this.signupData['password'] === undefined || this.signupData['password'].length <= 6) {
      this.allright['signupMess'] = "Please enter password greater than 6";
      this.allright['signup'] = false;
    } else if(this.signupData['name'] === undefined || this.signupData['name'].length == 0) {
      this.allright['signupMess'] = "Please enter Your Name";
      this.allright['signup'] = false;
    } else {
      this.allright['signupMess'] = "";
      this.allright['signup'] = true;
    }

    if(this.allright['signup']) {
      // mow request
      // this.globalData.mainLoader = true;

      this.authService.emailSignup(this.signupData['email'], this.signupData['password']).then(
        (data) => {
          // done
          console.log(data);
          console.log("done");  
          console.log(this.signupData.name);
          document.cookie = "token="+data.refreshToken;
          // this.globalData.isLoggedIn = true;
          // this.globalData.profileInfo.name = this.signupData.name;
          // this.globalData.profileInfo.email = data.email;
          // this.globalData.profileInfo.photoURL = this.defaultURL;
          // this.globalData.emailVerified = data.emailVerified;


          localStorage.setItem("email", data.email);
          localStorage.setItem("uid", btoa(btoa(btoa(btoa(btoa(btoa(data.uid)))))));
          localStorage.setItem("user-name", this.signupData.name);
          localStorage.setItem("photoURL", this.defaultURL);
          localStorage.setItem("providerId", data.providerData[0].providerId);
          // provider = provider.substring(0, provider.lastIndexOf("."));

          // now send email verification..
          this.authService.emailVerify();

          let obj: object = {
            displayName: this.signupData.name,
            photoURL: this.defaultURL
          }
          // setting displayname..
          this.authService.updateInfo(obj).then((data) => {
            console.log("updated");
          }).catch((err) => {
            console.log(err);
          })
          // this.globalData.mainLoader = false;


          // navigate to the next page
          // this.router.navigate(['/afterSignup']);
        }).catch((err) => {
          if(err) {  
          	console.log(err);
            // this.globalData.mainLoader = false;

            this.allright['signup'] = false;
            this.allright['signupMess'] = err.message;
          }
        });
        // this.authService.emailSignup("j", "k")
      // console.log(data);
      // if(data['error']) {
      //   this.allright['signup'] = true;
      //   this.allright['signupMess'] = data['message'];
      // } else {
      //   this.allright['signupMess'] = "";
      //   this.allright['signup'] = true;
      // }
    }
  }


  signup(str) {
    // 0 -> google
    // 1 -> github
    // 2 -> facebook
    // 3 -> twitter
    // 4 -> email and pass..


    // this.globalData.mainLoader = true;
    this.authService.login(str).then((result) => {
      console.log(result);
      document.cookie = "token="+result.user.refreshToken;
      // this.globalData.isLoggedIn = true;
      // this.globalData.profileInfo.name = result.user.providerData[0].displayName;
      // this.globalData.profileInfo.email = result.user.providerData[0].email;
      // this.globalData.profileInfo.photoURL = result.user.providerData[0].photoURL;
      // this.globalData.profileInfo.uid = result.user.uid;
      // this.globalData.emailVerified = result.user.emailVerified;

      localStorage.setItem("email", result.user.providerData[0].email);
      localStorage.setItem("uid", btoa(btoa(btoa(btoa(btoa(btoa(result.user.uid)))))));
      
      localStorage.setItem("user-name", result.user.providerData[0].displayName);
      localStorage.setItem("photoURL", result.user.providerData[0].photoURL);
      let provider = result.user.providerData[0].providerId;
      provider = provider.substring(0, provider.lastIndexOf("."));
      localStorage.setItem("providerId", provider);

      // check if first time..
      let xx = this.getData.getDataList('/users/'+provider+'/'+result.user.uid).subscribe((data) => {
              console.log(data);
              if(data == null || data.length == 0) {
                // first time..
                console.log("first time");
                xx.unsubscribe();
                window.location.href = window.location.origin+"/afterSignup"
                // this.router.navigate(['/afterSignup']);
              } else {
                // not first..
                // move to main-page..
                console.log('second time');
                xx.unsubscribe();
                // this.router.navigate(['/index/main-page']);
              }
            },
            (err) => console.log(err),
            () => {
              console.log("****************///////////////////////*********************///////////////**********");
            });
      // console.log("done ii");
      // this.globalData.mainLoader = false;
    }).catch((err) => {
      // this.globalData.isLoggedIn = false;
      // this.globalData.mainLoader = false;
      alert(err.message);
    });
  }

  forgotPass() {
    
    if(this.loginData.email !== undefined && this.loginData.email.length > 0) {
      // this.globalData.mainLoader = true;
      this.authService.resetPass(this.loginData.email);
      // this.globalData.mainLoader = false;

    } else {
      //  this.globalData.ShowNoti("top", "left", "danger", 'Please enter Email id..', "ti-bell");
    }
  }
}

