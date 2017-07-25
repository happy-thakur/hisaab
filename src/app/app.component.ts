import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar, Splashscreen } from 'ionic-native';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';

import { Page1 } from '../pages/page1/page1';
// import { Page2 } from '../pages/page2/page2';
import { HomePage } from '../pages/home/home';
import { SettingPage } from '../pages/setting/setting';
import { GroupCreatePage } from '../pages/group-create/group-create';
// import { GroupSettingPage } from '../pages/group-setting/group-setting';
// import { GroupDonePage } from '../pages/group-done/group-done';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
// import { SignupPage } from '../pages/signup/signup';
import { MemberDetailPage } from '../pages/member-detail/member-detail';

import { GlobalVars } from "../providers/global-vars"
import { ProvideData } from "../providers/provide-data"

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any;
  name: string;
  email: string;
  profile_url: string;
  phone_no:any;
  groupError: any;
  group: any = null;

  pages: Array<{title: string, component: any}>;

  constructor(public platform: Platform, public http: Http, public globalVars: GlobalVars,
              public provideData: ProvideData
            ) {
    
    this.phone_no = localStorage.getItem('phone_no');
    if(this.phone_no != null) {
      this.globalVars.email = localStorage.getItem('email');
      this.globalVars.name = localStorage.getItem('name');
      this.globalVars.profile_url = localStorage.getItem('profile_url');
      this.globalVars.phone_no = localStorage.getItem('phone_no');
      // means logged in..
      this.provideData.getAllGroups(localStorage.getItem('phone_no')).then(
        (done) => {
          console.log(done);
          console.error(this.globalVars.group);

          // this.globalVars.getNotification(this.globalVars.group[0].group_id);

          // temp_function(this);
            this.globalVars.getNotification();
          
          setInterval(() => {
            this.globalVars.getNotification();
            // console.log("this is done");
          }, 10000);
            // function temp_function(now) {
            //   // for(var i=0; i<now.globalVars.group.length; i++) {
            //     now.globalVars.getNotification();          
            //   // }
            //   console.log('doneee');
            //   // setTimeout(temp_function(now), 20000);  
            // }
          
          
          this.globalVars.temp = 1;
            this.rootPage = HomePage;
            
            // used for an example of ngFor and navigation
            this.globalVars.pages = [
            // { title: 'Page One', component: Page1 },
            // { title: 'Page Two', component: Page2 },
            { title: 'Home', component: HomePage, icon: 'home' },
            { title: 'Group Create', component: GroupCreatePage, icon: 'add-circle' },
            { title: 'Setting', component: SettingPage, icon: 'build' },
            // { title: 'Group Setting', component: GroupSettingPage },
            // { title: 'Group Done', component: GroupDonePage },
            // { title: 'Login', component: LoginPage },
            { title: 'About', component: ProfilePage, icon: 'at' },
            // { title: 'Signup', component: SignupPage },
            // { title: 'Member Details', component: MemberDetailPage }
          ];
          this.initializeApp();
          console.log(this.globalVars.pages);
       }
      );
    } else {
      this.rootPage = LoginPage;
      this.globalVars.temp = 2;
    }
    console.log(this.globalVars.temp);
  }

  initializeApp() {
    console.log("initializing the app..");
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      StatusBar.styleDefault();
      Splashscreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.push(page.component);
  }

  // to clear the local storage..
  logout() {
    localStorage.removeItem('phone_no');
    this.globalVars.group = [];
    this.globalVars.pages = [];
    this.globalVars.groupError = false;
    this.nav.setRoot(LoginPage);
  }

  //function to get all the groupss.
  getAllGroups(phone_no){
    return new Promise(resolve => {
      console.log(phone_no);
      console.info(this.phone_no);
      var url = "http://myrent.hol.es/hisaab/getGroups.php?phone_no=";
      if(this.phone_no != null) {
        if(this.phone_no.length == 10 && parseInt(this.phone_no) != NaN) {
          url += this.phone_no;
          this.http.get(url).map(
          (res) => res.json()
          ).subscribe(
            (data) => {
              if(data['resCode'] == 0) {
                // suucess..
                this.groupError = false;
                this.group = data['data'];
                console.log(this.group);
              } else {
                this.groupError = true;
                console.log('error');
                console.log(data);
              }
              this.initializeApp();
            }
          );
        }
      }
    });
  }

  // this is to show group details...
  showGroup(group_name, group_id) {
    this.nav.setRoot(Page1, { 'group_name' : group_name, 'group_id' : group_id });
  }
}
// USE POPOVERS..
//  TABS..
//  SEGMENTS..
