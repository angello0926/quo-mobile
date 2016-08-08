// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'

var app = angular.module('quo', ['ionic','ngCordova']);

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
    .state('index',{
      url:'/index',
      templateUrl: 'index.html'
    })
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
      templateUrl: 'templates/auth/login.html',
      controller: 'loginController'
    })
    .state('app.auth.signup', {
      url: '/signup',
      templateUrl: 'templates/auth/signup.html',
      controller: 'signupController'
    })
    .state('app.auth.get-started', {
      url: '/get-started',
      templateUrl: 'templates/auth/get-started.html'
    })
    .state('app.member', {
      url: '/member',
      abstract: true,
      templateUrl: 'templates/member/member.html',

    })
    .state('app.member.explore', {
      url: '/explore',
      templateUrl: 'templates/member/explore.html',
      controller: 'exploreController'
    })
    .state('app.member.home', {
      url: '/home',
      templateUrl: 'templates/member/home.html'

    })
    .state('app.member.subs', {
      url: '/subs',
      templateUrl: 'templates/member/subs.html'
    })
    .state('app.member.profile', {
      url: '/profile',
      templateUrl: 'templates/member/profile.html'
    })
    .state('editor', {
      url: '/editor',
      abstract:true,
      templateUrl: 'templates/editor/editor.html',
      controller: "editorController"
    })
    .state('editor.text', {
      url: '/text',
      views: {
        "text": {
          templateUrl: 'templates/editor/text.html',
        }
      }
    })
     .state('editor.color', {
      url: '/color',
      views: {
        "color": {
          templateUrl: 'templates/editor/color.html',
        }
      }
    })
    .state('editor.shapes', {
      url: '/shapes',
      views: {
        "shapes": {
          templateUrl: 'templates/editor/shapes.html',
        }
      }
    })
    .state('editor.photos', {
      url: '/photos',
      views: {
        "photos": {
          templateUrl: 'templates/editor/photos.html',
        }
      }
    })
    .state('createPost', {
      url: '/createpost',
      params: {
        url: null,
        img: null
      },
      templateUrl: 'templates/createpost.html',
      controller: 'postController'
   })


  $urlRouterProvider.otherwise('/app/landing');
});

//prevent users access other pages without login
app.run(function ($rootScope, $state, AuthService, AUTH_EVENTS) {
  $rootScope.$on('$stateChangeStart', function (event,next, nextParams, fromState) {
    if (!AuthService.isAuthenticated()) {
       if (next.name !== 'app.landing' && next.name !== 'app.auth.login' && next.name !== 'app.auth.signup'&& next.name !== 'app.auth.get-started') {
        event.preventDefault();

        $state.go('app.landing');
      }
    }
  });
});

app.config(['$ionicConfigProvider', function($ionicConfigProvider) {

    $ionicConfigProvider.tabs.position('bottom'); // other values: top

}]);
