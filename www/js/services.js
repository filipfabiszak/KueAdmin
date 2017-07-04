angular.module('App.services', [])

.factory('FirebaseFunctions', function() {

  FURL = {
      apiKey: "AIzaSyDE-WMV8Pz4ZtIwReSGsK7O6uC4RqOhurY",
      authDomain: "next-80843.firebaseapp.com",
      databaseURL: "https://next-80843.firebaseio.com",
      storageBucket: "next-80843.appspot.com",
    };


	//var ref = new Firebase(FURL);
  firebase.initializeApp(FURL);

	//var auth = $firebaseAuth(ref);
  //var auth = $firebaseObject(ref);
  // var auth = $firebaseAuth();

  var linesDB = firebase.database().ref('/lines/Wilfrid Laurier University/Bookstore').once('value').then(function(lineStuff) {
    console.log(lineStuff.val())
  });

  FirebaseFunctions = linesDB;
	return FirebaseFunctions;


});
