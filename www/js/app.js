// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('quo', ['ionic']);

app.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

app.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('app', {
      url: '/app',
      abstract: true,
      templateUrl: 'templates/app.html'
    })
    .state('app.landing', {
      url: '/landing',
      templateUrl: 'templates/landing/landing.html'
    })
    .state('app.auth', {
      url: '/auth',
      abstract: true,
      templateUrl: 'templates/auth/auth.html'
    })
    .state('app.auth.login', {
      url: '/login',
      templateUrl: 'templates/auth/login.html'
    })
    .state('app.auth.signup', {
      url: '/signup',
      templateUrl: 'templates/auth/signup.html'
    })
    .state('app.auth.get-started', {
      url: '/get-started',
      templateUrl: 'templates/auth/get-started.html'
    })
  $urlRouterProvider.otherwise('/app/landing');
});