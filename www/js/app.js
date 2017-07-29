
angular.module('App', ['ionic', 'ngCordova','firebase'])
.config(function($stateProvider, $urlRouterProvider, $ionicConfigProvider) {
  $stateProvider
  .state('tab', {
    url: '/tab',
    abstract: true,
    templateUrl: 'templates/tabs.html'
  })
  .state('tab.full-line', {
    url: '/full-line',
    views: {
      'tab-full-line': {
        templateUrl: 'templates/tab-full-line.html',
        controller: 'MainCtrl'
      }
    }
  })
  .state('tab.main', {
    url: '/main',
    views: {
      'tab-main': {
        templateUrl: 'templates/tab-main.html',
        controller: 'MainCtrl'
      }
    }
  })
  .state('tab.settings', {
    url: '/settings',
    views: {
      'tab-settings': {
        templateUrl: 'templates/tab-settings.html',
        controller: 'SettingsCtrl'

      }
    }
  });
  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/tab/main');

  $ionicConfigProvider.tabs.position('bottom'); // other values: bottom
})


// Changue this for your Firebase App URL.

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
