import { Injectable } from '@angular/core';
import { LeadmeService } from './leadme-service';
import firebase from 'firebase';


@Injectable()
export class AuthData {

  public leadmeId: number;

  constructor(public leadmeService: LeadmeService) {
    this.getLeadmeId();
  }

  getLeadmeId(){
    this.leadmeService.leadmeId.subscribe(leadmeId => this.leadmeId = leadmeId);
  }

  /**
   * [loginUser We'll take an email and password and log the user into the firebase app]
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   */
  loginUser(email: string, password: string): firebase.Promise<any> {

    this.leadmeService.leadmeLogin(email,password);
    return firebase.auth().signInWithEmailAndPassword(email, password);
    
  }

  /**
   * [signupUser description]
   * This function will take the user's email and password and create a new account on the Firebase app, once it does
   * it's going to log the user in and create a node on users/uid with the user's email address, you can use
   * that node to store the profile information.
   * @param  {string} email    [User's email address]
   * @param  {string} password [User's password]
   * @param  {string} name [User's name]
   */
  signupUser(email: string, password: string, name: string): firebase.Promise<any> {

      let service = this;

      return firebase.auth().createUserWithEmailAndPassword(email, password).then((newUser) => {

        let uid = newUser.uid;

        firebase.database().ref('users/'+uid).set({
          name: name,
          email: email,
          userCurrent: "",
          registered_in: Date()
        });

        service.leadmeService.leadmeRegister(name,email,password);
    });
  }

  /**
   * [resetPassword description]
   * This function will take the user's email address and send a password reset link, then Firebase will handle the
   * email reset part, you won't have to do anything else.
   *
   * @param  {string} email    [User's email address]
   */
  resetPassword(email: string): firebase.Promise<any> {
    return firebase.auth().sendPasswordResetEmail(email);
  }

  /**
   * This function doesn't take any params, it just logs the current user out of the app.
   */
  logoutUser(): firebase.Promise<any> {
    return firebase.auth().signOut();
  }

}
