angular.module('App').factory('mainAdminFactory', function(FURL, $log,$state,$firebaseAuth, $firebaseArray, $firebaseObject) {

    //var ref = new Firebase(FURL);
    firebase.initializeApp(FURL);
    //var auth = $firebaseAuth(ref);
    var ref = firebase.database().ref();
    //var auth = $firebaseObject(ref);
    var auth = $firebaseAuth();

    var userDB = firebase.database().ref("users")

    var mainAdminFactory = {

        createFBProfile: function(user,phone) {
            firebase.database().ref('users/' + user.uid).set({
                name: user.displayName,
                email: user.email,
                phone: phone,
                registered_in: Date()
            });
        },

    };
    return mainAdminFactory;

});
