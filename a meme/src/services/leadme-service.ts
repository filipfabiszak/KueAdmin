import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()

export class LeadmeService{

    public leadmeId: BehaviorSubject<number>;
    public customerId: BehaviorSubject<number>;

    constructor(public http: Http){
        this.customerId = new BehaviorSubject(-1);
        this.leadmeId = new BehaviorSubject(-1);
    }

    /**
     * [leadmeLogin description]
     * Will take an email and password and log the user into the Leadme platform.
     * @param  {string} email    [User's email address]
     * @param  {string} password [User's password]
     */
    leadmeLogin(email, password) {

        let service = this;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeLogin',
            JSON.stringify({email:email,password:password}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => service.leadmeId.next(res.id));
    }

    /**
     * [leadmeRegister description]
     * This function will take the user's email and password and create a new account on the Leadme platform, once it does
     * it's going to log the user in and create a node in the leadmeUsers child with the user's Leadme id. This also sets the
     * id of the scanner.
     * @param  {string} email [User's email address]
     * @param  {string} pass  [User's password]
     * @param  {string} name  [User's name]
     */

    leadmeRegister(name, email, pass) {

        let userId = '';
        let service = this;

        firebase.database().ref().child('users').orderByChild('email').equalTo(email).once('value', function(snap) {
            userId = snap.val().key;
        });

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeAuth',
            JSON.stringify({name:name,email:email,pass:pass}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => { if(res.id == -1){ service.leadmeLogin(email,pass) } else{ service.leadmeId.next(res.id); } });
    }

    /**
     * [leadmeRegisterCustomer description]
     * This function will take the user's email and password and create a new account on the Leadme platform, once it does
     * it's going to log the user in and create a node in the leadmeUsers child with the user's Leadme id. This does not set the
     * id of the scanner.
     * @param  {string} email [User's email address]
     * @param  {string} pass  [User's password]
     * @param  {string} name  [User's name]
     */

    leadmeRegisterCustomer(name, email, pass) {

        let userId = '';
        let service = this;

        firebase.database().ref().child('users').orderByChild('email').equalTo(email).once('value', function(snap) {
            userId = snap.val().key;
        });

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeAuth',
            JSON.stringify({name:name,email:email,pass:pass}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => service.customerId.next(res.id));
    }

    /**
     * [leadmeLoginCustomer description]
     * leadmeLoginCustomer will take an email and password and log the user into the Leadme platform. This does not set the
     * id of the scanner.
     * @param  {string} email    [User's email address]
     * @param  {string} password [User's password]
     */
    leadmeLoginCustomer(email, password) {

        let service = this;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeLogin',
            JSON.stringify({email:email,password:password}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => service.customerId.next(res.id));
    }

    /**
     * [leadmeData description]
     * This function will take the the IKue id of a user joining the line and register the interaction with the
     * Leadme platform.
     * @param  {string} leadId
     * @param  {string} location
     */

    leadmeData(leadId,location) {

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeData',
            JSON.stringify({lead:leadId,user:this.leadmeId,location:location}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => console.log(res));
    }
}