
angular.module('App', ['ionic', 'App.controllers', 'App.services'])
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
        controller: 'FullLineController'
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
  $ionicConfigProvider.tabs.position('top'); // other values: bottom
})
.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
  });
});
