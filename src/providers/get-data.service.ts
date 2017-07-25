import { Injectable } from '@angular/core';
import { AngularFireDatabase } from 'angularfire2/database';
import { FirebaseApp } from 'angularfire2';
import 'firebase/storage';

// import { GlobalDataService } from './global-data.service';
import { RequestService } from './request.service';
@Injectable()
export class GetDataService {

	constructor(private db: AngularFireDatabase, private firebase: FirebaseApp, private requestService: RequestService) { }

	follower: number = 0;
	following: number = 0;
	doneNo: number = 0;
	toDoNo: number = 0;
	followed: boolean = false;

	// function to get the data...

	getDataList(str: any, query?:object) {
		console.log(query);
		if(query) {
			console.log("query");
			return this.db.list(str, query);
		} else {
			console.log(" no query");
			return this.db.list(str);
		}
		// this
	}

	getDataObj(url) {
		return this.db.object(url);
	}

	upload(file, name) {
		return this.firebase.storage().ref(name).put(file);

		// console.log(this.firebase.storage);

	}

	deleteFile(url: string) {
		return this.firebase.storage().ref(url).delete();
	}

	getDataByValue(url: string, value: string) {
		return this.getDataList(url, {query: {
			equalTo: value,
			orderByValue: true
		}});
	}


	// check for aftersignup page..
	checkAfterSignup() {
		// check if data is filled if not then move to after signup page..

		let uid = atob(atob(atob(atob(atob(atob(localStorage.getItem("uid")))))));  

		// let sub = this.list("/users/"+localStorage.getItem('providerId')+'/'+uid+'/personal-info').subscribe((data) => {
			//   if(data.length > 0) {
				//     // means move forward..
				//     router.navigate(['/index/main-page']);
				//   } 
				// },
				// (err) => console.log(err),
				// () => sub.unsubscribe());
			}	

		}

		// https://firebasestorage.googleapis.com/v0/b/talent-15ac3.appspot.com/o/uploads%2FFashion_Design%2FvnyDgAv3cvQupicHaRfPLhPBori1%2F-Kns5mjb4X2D_auIVXhq?alt=media&token=2804b62a-7d92-42df-90a8-c41e458500de
