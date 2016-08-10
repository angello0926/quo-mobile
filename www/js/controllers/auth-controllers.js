angular.module('quo')

.controller('loginController', function($scope, AuthService, $ionicPopup,$ionicLoading, $state) {
  $scope.user = {
    email: '',
    password: ''
  };

  $scope.showLoading= function() {
    $ionicLoading.show({
      template: 'Loading...'
    }).then(function(){
       console.log("The loading indicator is now displayed");
    });
  };

  $scope.hideLoading = function(){
    $ionicLoading.hide().then(function(){
       console.log("The loading indicator is now hidden");
    });
  };
  $scope.login = function() {
    $scope.showLoading();
    AuthService.login($scope.user).then(function(msg) {
      $scope.hideLoading();
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
    $scope.showLoading();
    AuthService.register($scope.user).then(function(msg) {
      $scope.hideLoading();
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