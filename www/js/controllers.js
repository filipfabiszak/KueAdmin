'Use Strict';
angular.module('App')

    .controller('MainCtrl', ['$scope', '$stateParams','mainAdminFactory', // The following is the constructor function for this page's controller. See https://docs.angularjs.org/guide/controller
// You can include any angular dependencies as parameters for this function
// TIP: Access Route Parameters for your page via $stateParams.parameterName
        function ($scope, $stateParams,mainAdminFactory) {
            $scope.currentLine=[];
            firebase.database().ref('lines/University of Waterloo/Bookstore').on('child_added', function(snapshot){
                var a = snapshot.val().rem;
                console.log(snapshot);
                if (a != undefined || a!=null ){
                        $scope.currentLine.push(a);
                };

                console.log($scope.currentLine);
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
