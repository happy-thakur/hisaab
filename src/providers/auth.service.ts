import { Injectable } from '@angular/core';
import { AngularFireAuth } from 'angularfire2/auth';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

import * as firebase from 'firebase/app';
declare var showNotification: any;

@Injectable()
export class AuthService {

user: any;
items: any;

  constructor(private afAuth: AngularFireAuth, private db: AngularFireDatabase) {

  }

  emailLogin(email="", password="") {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  login(str) {
    var provider;
    switch (str) {
      case 0:
        provider = new firebase.auth.GoogleAuthProvider();
        console.log("thre");
        break;

      case 1:
        provider = new firebase.auth.GithubAuthProvider();
        break;
      case 2:
        provider = new firebase.auth.FacebookAuthProvider();
        break;
      case 3:
        provider = new firebase.auth.TwitterAuthProvider();
        break;
        
      default:
        provider = null
        break;
    }

    if(provider) {
      return this.afAuth.auth.signInWithPopup(provider);
    }
    // console.log(this.items);
  }
  logout() {
    if(localStorage.getItem("email")) {
      this.afAuth.auth.signOut().then((data) => {
        document.cookie = "token=''";

        // navigate..
      }).catch((err) =>{
        // alert(err);
        console.log(err);
      });
    }
  }

  emailSignup(email, password) {
    console.log(email);
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  emailVerify() {
   let user = this.afAuth.auth.currentUser.sendEmailVerification().then((res) => {
     console.log("vaerification send");
     showNotification("top", "left", 'success', 'email send', 'ti-bell');
   },(err) => {
     console.log(err);
   })
  }

   confirmEmail() {
     console.log(this.afAuth.auth.currentUser);
     if(this.afAuth.auth.currentUser)
       return this.afAuth.auth.currentUser.emailVerified;
     else 
       return false; 
   }

   updateInfo(obj) {
     var user = this.afAuth.auth.currentUser;
     return user.updateProfile(obj);
   }

   // geeting user infoo....
   getUserInfo() {
    console.log('auth service');
    this.afAuth.auth.onAuthStateChanged((user) => {
      if(user) {
        // loggedd in
        
      } else {
        // not logged in..
        // this.globalData.isLoggedIn = false;
      }
    })
   
  

     // console.log(this.afAuth.auth);
     // return this.afAuth.auth.currentUser;
   }


   // password reset email..
   resetPass(email: string) {
     this.afAuth.auth.sendPasswordResetEmail(email).then((data) => {
      //  this.globalData.ShowNoti("top", "left", "success", "Email for password reset has been send to "+email, "ti-bell");
     }).catch((err) => {
      //  this.globalData.ShowNoti("top", "left", "danger", err.message, "ti-bell");
     })
   }
}
