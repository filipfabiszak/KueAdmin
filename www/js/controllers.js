'Use Strict';
angular.module('App')

    .controller('MainCtrl', ['$scope', '$stateParams','mainAdminFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,mainAdminFactory) {
            $scope.currentLine=[];
            $scope.history=[];
            $scope.users=[];
            $scope.currentCust={};
            var popNumber;

            firebase.database().ref('lines/University of Waterloo/Bookstore').on('child_added', function(snapshot){
                console.log("User line update triggered by firebase change");
                var lineKey = snapshot.val().rem;
                // console.log("lineKey is", lineKey);
                var uid = snapshot.val().key;
                // console.log("User key is", uid);
                if (lineKey != undefined || lineKey != null && uid != undefined || uid != null ){
                        $scope.currentLine.push(lineKey);
                        var test = {};
                        firebase.database().ref('users/'+ uid ).once('value').then(function (snapshot){
                            var name = snapshot.val().name;
                            var phone = snapshot.val().phone;
                            test = {name: name, phone:phone};
                            $scope.$apply(function () {
                                $scope.users.push(test);
                            });
                        });
                };
                // console.log("Users are: ", $scope.users);
                // console.log("Current Line IDs are: ",$scope.currentLine);
            });

            firebase.database().ref('lines/University of Waterloo/Bookstore/history').on('child_added', function(snapshot){
                // console.log("history line update triggered by firebase change");
                var lineKey = snapshot.val().rem;
                // console.log("history Line Key is: ", lineKey);
                if (lineKey != undefined || lineKey != null ){
                        $scope.history.push(lineKey);
                };
                // console.log("History IDs are: ", $scope.history);
            });

            firebase.database().ref('lines/University of Waterloo/Bookstore/current').on('child_added', function(snapshot){
                // console.log("Current customer update triggered by initial load");
                var uid = snapshot.val();
                if (typeof uid === 'string') {
                    firebase.database().ref('users/' + uid).once('value').then(function (snapshot) {
                        var name = snapshot.val().name;
                        var phone = snapshot.val().phone;
                        $scope.$apply(function () {
                            $scope.currentCust = {name: name, phone: phone};
                        });
                    });
                }
            });

            firebase.database().ref('lines/University of Waterloo/Bookstore/current').on('child_changed', function(snapshot){
                console.log("Current customer update triggered by firebase change");
                var uid = snapshot.val();
                if (typeof uid === 'string') {
                    firebase.database().ref('users/' + uid).once('value').then(function (snapshot) {
                        var name = snapshot.val().name;
                        var phone = snapshot.val().phone;
                        $scope.$apply(function () {
                            $scope.currentCust = {name: name, phone: phone};
                        });
                    });
                }
            });

            firebase.database().ref('lines/University of Waterloo/Bookstore/meta/pop_amount' ).once('value').then(function (snapshot){
                popNumber=snapshot.val();
            });

            $scope.nextUser=function(){

              for(var i=0; i < popNumber; i++){

              }

               var uuid = $scope.currentLine.shift();
              //  console.log("line ID of popped customer: ",uuid);
               firebase.database().ref('lines/University of Waterloo/Bookstore/'+ uuid ).once('value').then(function (snapshot) {
                    var user = snapshot.val().key;
                    // console.log("UserID to be popped: ", user);
                    // Clearing the userCurrent of current and add current to history
                    firebase.database().ref('lines/University of Waterloo/Bookstore/current' ).once('value').then(function (snapshot) {
                      var currentBeforePopping = snapshot.val().current;
                      if (currentBeforePopping != undefined || currentBeforePopping != null ){
                        var dataKey = firebase.database().ref().child('lines/University of Waterloo/Bookstore/history').push().key;
                        firebase.database().ref().child('lines/University of Waterloo/Bookstore/history/' + dataKey).update({key:currentBeforePopping,rem:dataKey});
                        firebase.database().ref('users/'+currentBeforePopping+'/').update({"userCurrent":""});
                      }
                    });
                   firebase.database().ref().child('lines/University of Waterloo/Bookstore/current').update({current:user});
                   firebase.database().ref().child('lines/University of Waterloo/Bookstore/meta').update({wait_time:30});
                   firebase.database().ref('users/'+user+'/').update({"userCurrent":"University of Waterloo,Bookstore"});
                   firebase.database().ref('lines/University of Waterloo/Bookstore/'+ uuid).remove()
                       .then(function() {
                           console.log("Remove succeeded.")
                           $scope.$apply(function () {
                              $scope.users.shift();
                           });
                       })
                       .catch(function(error) {
                           console.log("Remove failed: " + error.message)
                       });
                },function(error){
                  console.log("uid grabbing failed: " + error.message)
                });
               console.log($scope.currentLine);
               console.log($scope.users);
            };

            $scope.previousUser=function(){
              var uuid = $scope.history.pop();
              // console.log("history list id of reversed customer: ", uuid);
              firebase.database().ref('lines/University of Waterloo/Bookstore/history/'+ uuid ).once('value').then(function (snapshot) {
                   var user = snapshot.val().key;
                  //  console.log("UserID to be reversed: ", user);
                  firebase.database().ref('lines/University of Waterloo/Bookstore/current' ).once('value').then(function (snapshot) {
                    var currentBeforeReversing = snapshot.val().current;
                    if (currentBeforeReversing != undefined || currentBeforeReversing != null ){
                      firebase.database().ref('users/'+currentBeforeReversing+'/').update({"userCurrent":""});
                      var dataKey = firebase.database().ref().child('lines/University of Waterloo/Bookstore').push().key;
                      firebase.database().ref().child('lines/University of Waterloo/Bookstore/' + dataKey).update({key:currentBeforeReversing,rem:dataKey});
                      // var test = {};
                      // firebase.database().ref('users/'+ currentBeforeReversing ).once('value').then(function (snapshot){
                      //     var name = snapshot.val().name;
                      //     var phone = snapshot.val().phone;
                      //     test = {name: name, phone:phone};
                      //     $scope.$apply(function () {
                      //        $scope.users.unshift(test);
                      //        console.log("users", $scope.users);
                      //      });
                      //
                    }
                  });
                  firebase.database().ref().child('lines/University of Waterloo/Bookstore/current').update({current:user});
                  firebase.database().ref('users/' + user + '/').update({"userCurrent":"University of Waterloo,Bookstore"});
                  firebase.database().ref('lines/University of Waterloo/Bookstore/history/'+ uuid).remove();
               });
            };

            $scope.updatePop=function(){
              var popNumber = parseInt(document.getElementById("slider").value);
              firebase.database().ref().child('lines/University of Waterloo/Bookstore/meta').update({pop_amount:popNumber});
            }

        }]);
