import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { Page1 } from '../pages/page1/page1';
import { GroupCreatePage } from '../pages/group-create/group-create';
import { GroupDonePage } from '../pages/group-done/group-done';
import { GroupSettingPage } from '../pages/group-setting/group-setting';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { ProfilePage } from '../pages/profile/profile';
import { SettingPage } from '../pages/setting/setting';
import { SignupPage } from '../pages/signup/signup';
import { Page2 } from '../pages/page2/page2';
import { MemberDetailPage } from '../pages/member-detail/member-detail';
import { GroupSettingPopoverPage } from '../pages/group-setting-popover/group-setting-popover';
import { RequestShowPage } from '../pages/request-show/request-show';
import { BrowserModule } from '@angular/platform-browser';

import { ProvideData } from "../providers/provide-data";
import { Alert } from "../providers/alert";
import { PopoverProvider } from "../providers/popover-provider";
import { GlobalVars } from '../providers/global-vars';
import { GetDataService } from '../providers/get-data.service';
import { RequestService } from '../providers/request.service';

import { HttpModule } from '@angular/http';

@NgModule({
  declarations: [
    MyApp,
    Page1,
    Page2,
    MemberDetailPage,
    GroupCreatePage,
    GroupDonePage,
    GroupSettingPage,
    HomePage,
    LoginPage,
    ProfilePage,
    SettingPage,
    SignupPage,
    GroupSettingPopoverPage,
    RequestShowPage
  ],
  imports: [
    IonicModule.forRoot(MyApp), BrowserModule, HttpModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    Page1,
    Page2,
    MemberDetailPage,
    GroupCreatePage,
    GroupDonePage,
    GroupSettingPage,
    HomePage,
    LoginPage,
    ProfilePage,
    SettingPage,
    SignupPage,
    GroupSettingPopoverPage,
    RequestShowPage
  ],
  providers: [{provide: ErrorHandler, useClass: IonicErrorHandler}, ProvideData, Alert, PopoverProvider, GlobalVars, GetDataService, RequestService]
})
export class AppModule {}
