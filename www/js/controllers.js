'Use Strict';
angular.module('App')

    .controller('MainCtrl', ['$scope', '$stateParams','mainAdminFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,mainAdminFactory) {
            $scope.currentLine=[];
            $scope.users=[];
            $scope.currentCust={};
            firebase.database().ref('lines/University of Waterloo/Bookstore').on('child_added', function(snapshot){
                var a = snapshot.val().rem;
                console.log(snapshot);
                if (a != undefined || a!=null ){
                        $scope.currentLine.push(a);
                };

                console.log($scope.currentLine);
                });

            firebase.database().ref('lines/University of Waterloo/Bookstore').on('child_added', function(snapshot){
                var uid = snapshot.val().key;
                console.log(uid);
                if (uid != undefined || uid!=null ){

                    var test = {};
                    var info = [];
                    firebase.database().ref('users/'+ uid ).once('value').then(function (snapshot){
                        var name = snapshot.val().name;
                        var phone = snapshot.val().phone;
                        // info.push(name);
                        // info.push(phone);
                        test = {name: name, phone:phone};
                        $scope.$apply(function () {
                            $scope.users.push(test);
                        });

                    },function(error){


                    });

                    };
                console.log("Info of line people");
                console.log($scope.users);
            });


            firebase.database().ref('lines/University of Waterloo/Bookstore/current').on('child_added', function(snapshot){
                console.log("Current triggered");
                var uid = snapshot.val();
                console.log(snapshot.val());


                if (uid != {}) {
                    firebase.database().ref('users/' + uid).once('value').then(function (snapshot) {
                        var name = snapshot.val().name;
                        var phone = snapshot.val().phone;
                        console.log(name);
                        // info.push(name);
                        // info.push(phone);
                        $scope.$apply(function () {
                            $scope.currentCust = {name: name, phone: phone};
                        });

                    }, function (error) {


                    });
                }

                    console.log("CURRENT NIGGA");
                    console.log($scope.currentCust);



            });



            $scope.popUser=function(){
               var uuid = $scope.currentLine.shift();
               console.log("popped!");
               console.log(uuid);
               firebase.database().ref('lines/University of Waterloo/Bookstore/'+ uuid ).once('value').then(function (snapshot) {
                    console.log("getting lines ");
                    var user = snapshot.val().key;

                   // var fDB = firebase.database().ref();
                   // var dataKey = fDB.child('lines/University of Waterloo/Bookstore/current').push().key;
                   // var updates = {};
                   // updates['lines/University of Waterloo/Bookstore/current'+ dataKey]= {key:user,rem:dataKey};
                   firebase.database().ref('lines/University of Waterloo/Bookstore/current').set({
                       current: user,
                       meta:{wait_time:20}
                   });

                   firebase.database().ref('lines/University of Waterloo/Bookstore/'+ uuid).remove()
                       .then(function() {
                           console.log("Remove succeeded.")
                       })

                       .catch(function(error) {
                           console.log("Remove failed: " + error.message)
                       });


                },function(error){


                });
               console.log($scope.currentLine);
            };

            $scope.getLine = function () {


            }


        }]);
//
//
// .controller('MainCtrl', function($scope, $stateParams) {
//
//
//
// })
//
// .controller('SettingsCtrl', function($scope, $stateParams) {
//
//
// });
