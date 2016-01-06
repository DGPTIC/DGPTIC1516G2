// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.services' is found in services.js
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers', 'starter.services', 'ngOpenFB'])

.run(function($ionicPlatform, ngFB) {
	ngFB.init({appId: '172947333064611'});
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
})

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider

  .state('splash', {
    url: '/splash',
    templateUrl: 'templates/splash.html'
  })

  .state('map', {
    url: '/map',
    templateUrl: 'templates/map.html',
    controller: 'MapController'
  })

  .state('profile', {
    url: '/profile',
    templateUrl: 'templates/profile.html',
    controller: 'ProfileController'
  })

  .state('incidencia', {
    url: '/incidencia',
    templateUrl: 'templates/incidencia.html',
    controller: 'MapController'
  })

  .state('add', {
    url: '/add',
    abstract: true,
    templateUrl: 'templates/add.html',
    controller: 'AddController'
  })

  .state('add.map', {
    url: '/map',
    views: {
      'content': {
        templateUrl: 'templates/add-map.html'
      }
    }
  })

  .state('add.form', {
    url: '/form',
    views: {
      'content': {
        templateUrl: 'templates/add-form.html'
      }
    }
  })

  // if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/splash');

});
