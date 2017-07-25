import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
// import { ProvideData } from './provide-data';
import 'rxjs/add/operator/map';

@Injectable()
export class GlobalVars {

name : string = "hello";
total: number;
memberTotal: any = Array();
query: any;
data: any;
members: any;
temp:number;
email: string;
phone_no: string;
token: string = "abcdefgh12345";

// this is for the first page..
group:any;
groupError:any;
pages: any;
profile_url: string;

//***************** */

// notification...

notification: any;

//***************** */

  constructor(public http: Http) {
    this.temp = 0;
    // this.getNotification();
  }

  makeEmpty() {
    this.total = 0;
    this.memberTotal = [];
    this.query = [];
    this.members = [];
    this.data = [];
  }

  getNotification() {
    var url = "http://myrent.hol.es/hisaab/getNotification.php?phone_no="+localStorage.getItem('phone_no')+"&token="+this.token;
    this.http.get(url).map(
  		(res) => res.json()
  		).subscribe(
      (result) => {
        // console.log(url);
        // console.log(result);
        this.notification = result;
        // setTimeout(this.getNotification, 3000);
      });
  }

}
