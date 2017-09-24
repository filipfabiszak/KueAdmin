import { Injectable } from '@angular/core';
import firebase from 'firebase';
import { LeadmeService } from './leadme-service';
import { Http, Headers, RequestOptions, Response } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/map';

@Injectable()

export class LineService {

    public lineSize: BehaviorSubject<number>;
    public serving: BehaviorSubject<Object>;
    public postResponse: string;
    public leadmeCustomerId: number;
    public line: any[]
    public users: any[];
    public history: any[];

    constructor(public http: Http, public leadmeService: LeadmeService){

        this.lineSize = new BehaviorSubject(0);
        this.serving = new BehaviorSubject({name:"Loading...", phone:"Loading..."});
        this.line = [];
        this.users = [];
        this.history = [];
        this.getCustomerId();
    }

    getCustomerId(){
        // this.leadmeService.customerId.subscribe(leadmeCustomerId => this.leadmeCustomerId = leadmeCustomerId);
    }

    createLine(company,line) {
        company = company.split(' ').join('_');
        line = line.split(' ').join('_');
        let DBLineRef =  'lines/' + company + '/' + line;
        var uid = firebase.auth().currentUser.uid;
        var updates = {};
        updates['users/' + uid + '/line'] = DBLineRef;
        var initialLine = {
          current: {
            current: "none"
          },
          history: {
            placeholder: {
              place: "holder"
            }
          },
          meta: {
            avg_wait_time: 0,
            pop_amount: 1
          }
        }
        updates['lines/' + company + '/' + line] = initialLine;
        firebase.database().ref().update(updates);
    }

    setLineSize(){
        console.log('Querying for line size...');
        let service = this;
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
            let DBLineRef = snapshot.val().line+ '/';
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

    setLine(){
        console.log('Querying for line size...');
        let service = this;
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
            let DBLineRef = snapshot.val().line+ '/';

            firebase.database().ref(DBLineRef).on('child_added', function(snapshot){
                console.log("User line update triggered by firebase change");
                var lineKey = snapshot.val().rem;
                // console.log("lineKey is", lineKey);
                var uid = snapshot.val().key;
                // console.log("User key is", uid);
                if (lineKey != undefined || lineKey != null && uid != undefined || uid != null ){
                        service.line.push(lineKey);
                        var test = {};
                        firebase.database().ref('users/'+ uid ).once('value').then(function (snapshot){
                            console.log("UID " + uid + " User is: ",  snapshot.val());
                            var user = snapshot.val();
                            var name;
                            var phone;
                            if (user.name === ""){
                              name = "Phone"
                              phone = user.phone;
                            }
                            if (user.phone === ""){
                              phone = "Tablet"
                              name = user.name;
                            }
                            else{
                              name = user.name;
                              phone = user.phone;
                            }

                            test = {name: name, phone:phone};
                            service.users.push(test);
                        });
                };
                console.log("Users are: ", service.users);
                console.log("Current Line IDs are: ", service.line);
            });

            firebase.database().ref(DBLineRef + 'history').on('child_added', function(snapshot){
                // console.log("history line update triggered by firebase change");
                var lineKey = snapshot.val().rem;
                // console.log("history Line Key is: ", lineKey);
                if (lineKey != undefined || lineKey != null ){
                        service.history.push(lineKey);
                };
                console.log("History IDs are: ", service.history);
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

    getUsers(){
        return this.users;
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

    setServing(){
        console.log('Querying for current customer...');
        let service = this;
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + uid).once('value').then(function (snapshot) {
            let DBLineRef = snapshot.val().line+ '/';
            firebase.database().ref(DBLineRef).once('value').then(function (snapshot) {
                if(snapshot.val() == 1){
                    console.log('No one in line');
                    service.serving.next("Line Empty");
                }
                firebase.database().ref(DBLineRef + '/current').on('value', function (snapshot) {
                    if((snapshot != null) && (snapshot.val() != 1)) {
                        console.log(snapshot.val())
                        let serving = snapshot.val().current;
                        console.log(serving)
                        firebase.database().ref('users/' + serving).once('value').then(function (snapshot) {
                            if (snapshot !== null) {
                                service.serving.next(snapshot.val());
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

    nextUser(){
      let service = this;
      let uid = firebase.auth().currentUser.uid;
      firebase.database().ref('users/' + uid).once('value').then(function (snapshot) {
          let DBLineRef = snapshot.val().line + '/';
          var uuid = service.line.shift();
          //  console.log("line ID of popped customer: ",uuid);
           firebase.database().ref( DBLineRef + uuid ).once('value').then(function (snapshot) {
             console.log("NEXT", snapshot.val())
                var user = snapshot.val().key;
                // console.log("UserID to be popped: ", user);
                // Clearing the userCurrent of current and add current to history
                firebase.database().ref(DBLineRef + 'current' ).once('value').then(function (snapshot) {
                  var currentBeforePopping = snapshot.val().current;
                  if (currentBeforePopping != undefined || currentBeforePopping != null ){
                    var dataKey = firebase.database().ref().child( DBLineRef + 'history').push().key;
                    firebase.database().ref().child(DBLineRef + 'history/' + dataKey).update({key:currentBeforePopping,rem:dataKey});
                    firebase.database().ref('users/'+currentBeforePopping+'/').update({"userCurrent":""});
                  }
                });
               firebase.database().ref().child(DBLineRef + 'current').update({current:user});
               firebase.database().ref().child(DBLineRef + 'meta').update({wait_time:30});
               firebase.database().ref('users/'+user+'/').update({"userCurrent": DBLineRef});
               firebase.database().ref( DBLineRef + uuid).remove()
                   .then(function() {
                       console.log("Remove succeeded. POSTing API data");
                       var poppedUserLeadmeId;
                       service.users.shift();
                   })
                   .catch(function(error) {
                       console.log("Remove failed: " + error.message)
                   });
            },function(error){
              console.log("uid grabbing failed: " + error.message)
            });
           console.log(service.line);
           console.log(service.users);
     });
    }

    previousUser(){
      let service = this;
      let uid = firebase.auth().currentUser.uid;
      firebase.database().ref('users/' + uid).once('value').then(function (snapshot) {
          let DBLineRef = snapshot.val().line+ '/';
            var uuid = service.history.pop();
            // console.log("history list id of reversed customer: ", uuid);
            firebase.database().ref(DBLineRef + 'history/'+ uuid ).once('value').then(function (snapshot) {
                 var user = snapshot.val().key;
                //  console.log("UserID to be reversed: ", user);
                firebase.database().ref(DBLineRef + 'current' ).once('value').then(function (snapshot) {
                  var currentBeforeReversing = snapshot.val().current;
                  if (currentBeforeReversing != undefined || currentBeforeReversing != null ){
                    firebase.database().ref('users/'+currentBeforeReversing+'/').update({"userCurrent":""});
                    var dataKey = firebase.database().ref().child(DBLineRef).push().key;
                    firebase.database().ref().child(DBLineRef + dataKey).update({key:currentBeforeReversing,rem:dataKey});
                  }
                });
                firebase.database().ref().child(DBLineRef + 'current').update({current:user});
                firebase.database().ref('users/' + user + '/').update({"userCurrent": DBLineRef});
                firebase.database().ref(DBLineRef + 'history/'+ uuid).remove();
             });
      });
    }
}
