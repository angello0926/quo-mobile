angular.module('quo')

.constant('AUTH_EVENTS', {
  notAuthenticated: 'auth-not-authenticated'
})

.constant('API_ENDPOINT', {
  url: 'http://localhost:8100/api'
  //for android-emualtor
  // url: 'http://10.0.2.2:8080/api'
// url: 'http://localhost:8080/api'
});