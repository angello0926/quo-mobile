angular.module('quo')

.controller('loginController', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.login = function() {
    AuthService.login($scope.user).then(function(msg) {
      $state.go('app.member.explore');
      console.log(AuthService.isAuthenticated());
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Login failed!',
        template: errMsg
      });
    });
  };
})

.controller('signupController', function($scope, AuthService, $ionicPopup, $state) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.signup = function() {
    AuthService.register($scope.user).then(function(msg) {
      $state.go('app.member.profile');
      console.log(AuthService.isAuthenticated());
      var alertPopup = $ionicPopup.alert({
        title: 'Register success!',
        template: msg
      });
    }, function(errMsg) {
      var alertPopup = $ionicPopup.alert({
        title: 'Register failed!',
        template: errMsg
      });
    });
  };
})

.controller('exploreController', function($scope, AuthService, API_ENDPOINT, $http, $state) {
  $scope.destroySession = function() {
    AuthService.logout();
    console.log(AuthService.isAuthenticated());
  };

  $scope.getInfo = function() {
    $http.get(API_ENDPOINT.url + '/memberinfo').then(function(result) {
      console.log(result);
      $scope.memberinfo = result.data.msg;
    });
  };

  $scope.logout = function() {
    AuthService.logout();
    $state.go('app.landing');
    console.log(AuthService.isAuthenticated());
  };
})

.controller('appController', function($scope, $state, $ionicPopup, AuthService, AUTH_EVENTS) {
  $scope.$on(AUTH_EVENTS.notAuthenticated, function(event) {
    AuthService.logout();
    $state.go('app.landing');
    var alertPopup = $ionicPopup.alert({
      title: 'Session Lost!',
      template: 'Sorry, You have to login again.'
    });
  });
});