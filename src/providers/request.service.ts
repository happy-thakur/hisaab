import { Injectable } from '@angular/core';

import { Http } from '@angular/http';
import { Observable } from 'rxjs/Rx';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class RequestService {

  constructor(private http: Http, private db: AngularFireDatabase) { }

  getRequest (url) {
  	return this.http.get(url).map((data: any) => {
  		return data.json();
  	}).catch((err: any) => {
  		return Observable.throw(err || "Server Error");
  	})
  }

  postRequest(url, data) {
  	return  this.http.post(url, data).map((data) => {
  		return data.json();
  	}).catch((err: any) => {
  		return Observable.throw(err || "Server Error");
  	});
  }

  pushData(url, data) {
    return this.db.list(url).push(data);
  }

  insertData(url, data) {
    console.log(url);
    return this.db.list(url).update('/', data);
  }

  deleteData(url) {
    this.db.list(url).remove();
  }
  

}
