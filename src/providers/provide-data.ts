import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { LoadingController } from 'ionic-angular';
import 'rxjs/add/operator/map';

import { GlobalVars } from './global-vars';

@Injectable()
export class ProvideData {

data:any = [];
members:any = [];
  constructor(public http: Http, public globalVars: GlobalVars, public loadingCtrl: LoadingController) {
    console.log('Hello ProvideData Provider');
  }

  // this return an object having the dtail of the member..
  getMemberDetailWithName(name, data) {
    var memberDetail = Array()
    data.filter(function(detail){
      if(detail.name == name)
        memberDetail.push(detail);
    });
    return memberDetail;
  }

  // this is done to calculate the total..
  getTotal(data, member){
    var tot = 0;
    // for(var i in data) {
    //   tot += parseInt(data[i]['cost']);
    // }
    data.forEach(one => {
    var count1 = 0, count2 = 0;
    if(one['done'] == '0') {
        member.forEach(element => {
          if(one[element.phone_no] == '1') {
            count1++;
          }
          count2++;
        });
        if(count1 == count2)
          tot += parseInt(one['cost']);
    }
      });

    return(tot);
  }

  // this is done to calculate the member total..
  calcMemberTotal() {
    this.globalVars.memberTotal = [];
        for(var i in this.globalVars.members) {
      var obj = {};
      obj['name'] = this.globalVars.members[i]['name'];
      obj['total'] = calculateTot(this.globalVars.members[i]['name'], this);
      obj['phone_no'] = this.globalVars.members[i]['phone_no'];
      this.globalVars.memberTotal.push(obj);
    }

    //console.log(this.memberTotal);
    function calculateTot(name, now) {
      var cost = 0;
      // //console.log(now.data);
      for(var i in now.globalVars.data) {
        console.info(now.globalVars.data[i]['done']);
          if(now.globalVars.data[i]['done'] == '0') {
            if(now.globalVars.data[i]['name'] == name) {
              var count1 = 0, count2 = 0;
              // now check iff all have accepted or not...
              console.log(now.globalVars.data[i]);
                    now.globalVars.members.forEach(element => {
                      if(now.globalVars.data[i][element.phone_no] == '1') {
                        count1++;
                      }
                      count2++;
                    });
                    if(count1 == count2)
                      cost += parseInt(now.data[i]['cost']);
            }
      }
      }
      return cost;
    }
  }

  // this done to add data in the array..
  addItem(data) {
    return new Promise(
      resolve => {
        console.log(data);
        var url = "http://myrent.hol.es/hisaab/enterGroupDetail.php";
        this.dataRequest(data, url).subscribe(
          (data) => {
            console.log(data);
            resolve(data);
          }
        );

      }
    );

  }

  //this is for requesting the post data
  dataRequest(data, url) {
    const headers = new Headers();
    headers.append('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
    let datatry = this.formData(data);
    return this.http.post(url, datatry, {headers: headers}).map(
        (res) => res.json());
  }


// this is done to encode the url in case of post request...
  formData(myFormData){
    return Object.keys(myFormData).map(function(key){
    return encodeURIComponent(key) + '=' + encodeURIComponent(myFormData[key]);
  }).join('&');
  }

  // this is a simple get request...
  getRequest(url) {

    return this.http.get(url).map(
  		(res) => res.json()
  		);
  }

// this is done to get all the Members group..
getMemberDetails(group_id) {
 return new Promise(resolve => {
    // first get all the member details..
    var url1 = "http://myrent.hol.es/hisaab/getGroupMembers.php?group_id="+group_id;
    this.getRequest(url1).subscribe(
      (data) => {
        console.log(data);;
        if(data['resCode'] == 0) {
          //success
          this.members = data['groupMembers'];
        } else {
          // error
          this.members = null;
        }
        resolve(this.members);
      }
    );
  }) ;
}

// this is done to get the details..
  getDetails(group_name){
  return new Promise(resolve => {
    var phone_no = localStorage.getItem('phone_no');
    // now getting the mebers details..
    if(phone_no != null) {
      var url2 = "http://myrent.hol.es/hisaab/getGroupDetails.php?phone_no="+phone_no+"&group_name="+group_name;
      this.getRequest(url2).subscribe(
        (result) => {
            console.log(result);
            if(result['resCode'] == 0) {
              //success
              var mDetails = result['memberDetail'];
              console.info(mDetails);
              this.data = mDetails;
              if(mDetails.length > 0) {
                this.data.forEach( (data) => {
                    var approved = {};
                    this.members.forEach(member => {
                    approved[member['phone_no']] = data[member['phone_no']];
                    // console.error(member);
                    // console.warn(data[member+""]);
                  });
                  data['approved'] = approved;
                } );
              }
            } else {
              // error
              this.data = null
            }

      resolve(this.data);

        }
      );
    }
  }) ;
}

//function to get all the groupss.
getAllGroups(phone_no){
  return new Promise(resolve => {
    console.log(phone_no);
    console.info(phone_no);
    var url = "http://myrent.hol.es/hisaab/getGroups.php?phone_no=";
    if(phone_no != null) {
      if(phone_no.length == 10 && parseInt(phone_no) != NaN) {
        url += phone_no;
        this.http.get(url).map(
        (res) => res.json()
        ).subscribe(
          (data) => {
            if(data['resCode'] == 0) {
              // suucess..
              // upading the notification...
              this.globalVars.groupError = false;
              this.globalVars.group = data['data'];
              console.log(this.globalVars.group);
            } else {
              this.globalVars.groupError = true;
              console.log('error');
              console.log(data);
            }
            // this.globalVars.initializeApp();
            resolve('done');
            
          }
        );
      }
    }
  });
}

//this is loading icon..
presentLoadingDefault() {
  let loading = this.loadingCtrl.create({
    content: 'Please wait...'
  });

  loading.present();
  return loading;
}

}
