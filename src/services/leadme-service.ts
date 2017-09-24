import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()

export class LeadmeService{

    public leadmeId: BehaviorSubject<number>;
    public customerId: BehaviorSubject<number>;
    public localLeadmeId: number;

    constructor(public http: Http){
        this.customerId = new BehaviorSubject(-1);
        this.leadmeId = new BehaviorSubject(-1);
        this.localLeadmeId = -1;
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
            JSON.stringify({email:email,pass:password}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => { service.leadmeId.next(res['res']['id']); service.localLeadmeId = res['res']['id']; });
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
        let service = this;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeAuth',
            JSON.stringify({name:name,email:email,pass:pass}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => { service.leadmeId.next(res['res']['id']); service.localLeadmeId = res['res']['id'];  },
                (err) => { service.leadmeLogin(email,pass) });
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
    leadmeRegisterCustomer(callback, name, email, pass) {
        let service = this;
        console.log('registering...');
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeAuth',
            JSON.stringify({name:name,email:email,pass:pass}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => { service.customerId.next(res['res']['id']); callback(res['res']['id']); });
    }

    /**
     * [leadmeLoginCustomer description]
     * leadmeLoginCustomer will take an email and password and log the user into the Leadme platform. This does not set the
     * id of the scanner.
     * @param  {string} email    [User's email address]
     * @param  {string} password [User's password]
     */
    leadmeLoginCustomer(callback, email, password) {
        let service = this;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeLogin',
            JSON.stringify({email:email,pass:password}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => { console.log(res['res']['id']); service.customerId.next(res['res']['id']); callback(res['res']['id']); },
                (err) => { service.leadmeRegisterCustomer(callback, email.split('_dummy')[0].replace('_', ' '), email, password); } );
    }

    /**
     * [leadmeData description]
     * This function will take the the IKue id of a user joining the line and register the interaction with the
     * Leadme platform.
     * @param  {string} leadId
     * @param  {string} location
     */
    leadmeData(leadId,location) {
        let service = this;
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        return this.http.post('http://gentle-forest-16873.herokuapp.com/leadmeData',
            JSON.stringify({lead:leadId,user:service.localLeadmeId,location:location}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res) => console.log(res));
    }

    /**
     * [openLeadmeDashboard description]
     * This function will simply open a new tab to LeadMe
     * @param  {string} leadId
     * @param  {string} location
     */
    openLeadmeDashboard(){
      var newWindow = window.open('http://www.leadme.ca/home');
    }
}
