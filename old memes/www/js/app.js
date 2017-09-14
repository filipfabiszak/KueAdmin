
angular.module('App', ['ionic', 'ngCordova','firebase'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html'
  })
  .state('app.login', {
    url: '/login',
    views: {
      'menuContent': {
        templateUrl: 'templates/login.html',
        controller: 'MainCtrl'
      }
    }
  })
  .state('app.dashboard', {
    url: '/dashboard',
    views: {
      'menuContent': {
        templateUrl: 'templates/dashboard.html',
        controller: 'MainCtrl'
      }
    }
  })
  .state('app.full-line', {
    url: '/full-line',
    views: {
      'menuContent': {
        templateUrl: 'templates/full-line.html',
        controller: 'MainCtrl'
      }
    }
  })
  .state('app.settings', {
    url: '/settings',
    views: {
      'menuContent': {
        templateUrl: 'templates/settings.html',
        controller: 'MainCtrl'
      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/dashboard');

  $ionicConfigProvider.tabs.position('bottom'); // other values: bottom
})
    .constant('FURL', {
            apiKey: "AIzaSyDE-WMV8Pz4ZtIwReSGsK7O6uC4RqOhurY",
            authDomain: "next-80843.firebaseapp.com",
            databaseURL: "https://next-80843.firebaseio.com",
            storageBucket: "next-80843.appspot.com"
        }
    )



.run(function($ionicPlatform) {
  $ionicPlatform.ready(function(FURL) {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if(window.cordova && window.cordova.plugins.Keyboard) {
          cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if(window.StatusBar) {
          StatusBar.styleDefault();
      }
  });
});
