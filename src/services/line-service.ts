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
    public customerId: number;

    constructor(public http: Http, public leadmeService: LeadmeService){
        this.lineSize = new BehaviorSubject(0);
        this.serving = new BehaviorSubject({name:"Loading...", phone:"Loading..."});
        this.getCustomerId();
    }

    getCustomerId(){
        // this.leadmeService.customerId.subscribe(customerId => this.customerId = customerId);
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
        // console.log('Querying for line size...');
        // let service = this;
        // let uid = firebase.auth().currentUser.uid;
        // firebase.database().ref('users/'+uid).once('value').then(function (snapshot) {
        //     let DBLineRef = snapshot.val().line;
        //     firebase.database().ref(DBLineRef).once('value').then(function (snapshot) {
        //         if(snapshot.val() == 1){
        //             console.log('Line size retrieved!');
        //             service.lineSize.next(0);
        //         }
        //         else {
        //             let realSize = snapshot.numChildren();
        //             console.log('Line size retrieved!');
        //             service.lineSize.next(realSize);
        //         }
        //     });
        // });
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

    setServing(){
        console.log('Querying for current customer...');
        let service = this;
        let uid = firebase.auth().currentUser.uid;
        firebase.database().ref('users/' + uid).once('value').then(function (snapshot) {
            let DBLineRef = snapshot.val().line;
            firebase.database().ref(DBLineRef).once('value').then(function (snapshot) {
                if(snapshot.val() == 1){
                    console.log('No one in line');
                    service.serving.next("Line Empty");
                }
                firebase.database().ref(DBLineRef + '/current').on('value', function (snapshot) {
                    if((snapshot != null) && (snapshot.val() != 1)) {
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
              // var uuid = $scope.currentLine.shift();
              // //  console.log("line ID of popped customer: ",uuid);
              //  firebase.database().ref('lines/University of Waterloo/Bookstore/'+ uuid ).once('value').then(function (snapshot) {
              //       var user = snapshot.val().key;
              //       // console.log("UserID to be popped: ", user);
              //       // Clearing the userCurrent of current and add current to history
              //       firebase.database().ref('lines/University of Waterloo/Bookstore/current' ).once('value').then(function (snapshot) {
              //         var currentBeforePopping = snapshot.val().current;
              //         if (currentBeforePopping != undefined || currentBeforePopping != null ){
              //           var dataKey = firebase.database().ref().child('lines/University of Waterloo/Bookstore/history').push().key;
              //           firebase.database().ref().child('lines/University of Waterloo/Bookstore/history/' + dataKey).update({key:currentBeforePopping,rem:dataKey});
              //           firebase.database().ref('users/'+currentBeforePopping+'/').update({"userCurrent":""});
              //         }
              //       });
              //      firebase.database().ref().child('lines/University of Waterloo/Bookstore/current').update({current:user});
              //      firebase.database().ref().child('lines/University of Waterloo/Bookstore/meta').update({wait_time:30});
              //      firebase.database().ref('users/'+user+'/').update({"userCurrent":"University of Waterloo,Bookstore"});
              //      firebase.database().ref('lines/University of Waterloo/Bookstore/'+ uuid).remove()
              //          .then(function() {
              //              console.log("Remove succeeded. POSTing API data");
              //              var poppedUserLeadmeId;
              //
              //             //  $http({
              //             //     method: 'POST',
              //             //     url: 'http://www.leadme.ca/api/data',
              //             //     data:{
              //             //       "userId": hubGroupKey,
              //             //       "leadId": 123,
              //             //       "location": "Popped"
              //             //     }
              //             //   }).then(
              //             //     function successCallback(response) {
              //             //       console.log("Remove succeeded. LeadMe metric updated");
              //             //     },
              //             //     function errorCallback(response) {
              //             //       console.log("Remove succeeded. LeadMe metric failed")
              //             //     });
              //
              //              $scope.$apply(function () {
              //                 $scope.users.shift();
              //              });
              //          })
              //          .catch(function(error) {
              //              console.log("Remove failed: " + error.message)
              //          });
              //   },function(error){
              //     console.log("uid grabbing failed: " + error.message)
              //   });
              //  console.log($scope.currentLine);
              //  console.log($scope.users);
    }

    previousUser(){
            // var uuid = $scope.history.pop();
            // // console.log("history list id of reversed customer: ", uuid);
            // firebase.database().ref('lines/University of Waterloo/Bookstore/history/'+ uuid ).once('value').then(function (snapshot) {
            //      var user = snapshot.val().key;
            //     //  console.log("UserID to be reversed: ", user);
            //     firebase.database().ref('lines/University of Waterloo/Bookstore/current' ).once('value').then(function (snapshot) {
            //       var currentBeforeReversing = snapshot.val().current;
            //       if (currentBeforeReversing != undefined || currentBeforeReversing != null ){
            //         firebase.database().ref('users/'+currentBeforeReversing+'/').update({"userCurrent":""});
            //         var dataKey = firebase.database().ref().child('lines/University of Waterloo/Bookstore').push().key;
            //         firebase.database().ref().child('lines/University of Waterloo/Bookstore/' + dataKey).update({key:currentBeforeReversing,rem:dataKey});
            //         // var test = {};
            //         // firebase.database().ref('users/'+ currentBeforeReversing ).once('value').then(function (snapshot){
            //         //     var name = snapshot.val().name;
            //         //     var phone = snapshot.val().phone;
            //         //     test = {name: name, phone:phone};
            //         //     $scope.$apply(function () {
            //         //        $scope.users.unshift(test);
            //         //        console.log("users", $scope.users);
            //         //      });
            //         //
            //       }
            //     });
            //     firebase.database().ref().child('lines/University of Waterloo/Bookstore/current').update({current:user});
            //     firebase.database().ref('users/' + user + '/').update({"userCurrent":"University of Waterloo,Bookstore"});
            //     firebase.database().ref('lines/University of Waterloo/Bookstore/history/'+ uuid).remove();
            //  });
    }
}
