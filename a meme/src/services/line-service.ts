import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { LeadmeService } from './leadme-service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()

export class LineService {

    public lineSize: BehaviorSubject<number>;
    public serving: BehaviorSubject<string>;
    public postResponse: string;
    public customerId: number;

    constructor(public http: Http, public leadmeService: LeadmeService){
        this.lineSize = new BehaviorSubject(0);
        this.serving = new BehaviorSubject('None');
        this.getCustomerId();
    }

    getCustomerId(){
        this.leadmeService.customerId.subscribe(customerId => this.customerId = customerId);
    }

    startNotifications(DBLineRef){
        let company = DBLineRef.split('/')[DBLineRef.split('/').length - 2];
        let line = DBLineRef.split('/')[DBLineRef.split('/').length - 1];

        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        this.http.post('http://gentle-forest-16873.herokuapp.com/line',
            JSON.stringify({company:company,name:line}),
            {headers:headers})
            .map((res: Response) => res.json())
            .subscribe((res: string) => this.postResponse = res);
    }
    createLine(company,line) {
        company = company.split(' ').join('_');
        line = line.split(' ').join('_');

        let DBLineRef =  'lines/' + company + '/' + line;
        var uid = firebase.auth().currentUser.uid;
        var updates = {};

        updates['users/' + uid + '/line'] = DBLineRef;
        updates['lines/' + company + '/' + line] = 1;
        firebase.database().ref().update(updates);
    }
    setLineSize(){
        console.log('Querying for line size...');
        let service = this;
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
            let DBLineRef = snapshot.val().line;
            firebase.database().ref(DBLineRef).once('value').then(function (snapshot) {
                if(snapshot.val() == 1){
                    console.log('Line size retrieved!');
                    service.lineSize.next(0);
                }
                else {
                    let realSize = snapshot.numChildren();
                    console.log('Line size retrieved!');
                    service.lineSize.next(realSize);
                }
            });
        });
    }
    getLineRef(callback){
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
            let name = snapshot.val().line;
            callback(name);
        });
    }
    getLineName(callback){
        console.log('Querying for line name...');
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
            let name = snapshot.val().line;
            name = name.split('/')[name.split('/').length - 1];
            callback(name);
        });
    }
    joinWithPhone(callback, name, number){

        let service = this;
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
            var lineName = snapshot.val().line;
            var dataKey = firebase.database().ref().child(lineName).push().key;

            let dummyUid = name.split(' ').join('_') + number.split(' ').join('_');

            firebase.database().ref('users/'+dummyUid).set({
                name: name,
                phone: number,
                userCurrent: "",
                registered_in: Date()
            });

            var updates = {};
            updates[lineName + '/' + dataKey]= {key:dummyUid};
            firebase.database().ref().update(updates);

            this.leadmeService.leadmeLoginCustomer(name, name + '_' + number + '_dummy@ikue.co').then( function(){
                    if(service.customerId == -1){
                        service.leadmeService.leadmeRegisterCustomer(name, name + '_' + number + '_dummy@ikue.co',number);
                    }
                }
            );
            this.leadmeService.leadmeData(dummyUid,lineName);

            callback();
        });
    }
    setServing(){
        console.log('Querying for current customer...');
        let service = this;
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
            let DBLineRef = snapshot.val().line;
            firebase.database().ref(DBLineRef).once('value').then(function (snapshot) {
                if(snapshot.val() == 1){
                    console.log('No one in line');
                    service.serving.next("Line Empty");
                }
                firebase.database().ref(DBLineRef + '/current').on('value', function (snapshot) {
                    if((snapshot != null) && (snapshot.val() != 1)) {
                        let serving = snapshot.val().current;
                        firebase.database().ref('users/' + serving).once('value').then(function (snapshot) {
                            if (snapshot !== null) {
                                service.serving.next(snapshot.val().name);
                                console.log('Current customer retrieved!');
                            }
                            else{
                                console.log('No current customer could be found.');
                            }
                        });
                    }
                    else{
                        console.log('The line is empty.');
                    }
                });
            });
        });
    }
}
