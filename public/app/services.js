svcs = angular.module('BlankSlateServices', ['ngResource']);

svcs.factory('Auth', ['$window', function($window){
  return {
    saveToken: function(token) {
      $window.localStorage['token'] = token;
    },
    getToken: function() {
      return $window.localStorage['token'];
    },
    removeToken: function() {
      $window.localStorage.removeItem('token');
    },
    isLoggedIn: function() {
      var token = this.getToken();
      return token ? true : false;
    },
    currentUser: function() {
      if (this.isLoggedIn()) {
        token = this.getToken()
        try {
          var tokenHeader = token.split('.')[0];
          var tokenPayload = token.split('.')[1];
          var decodedPayload = JSON.parse($window.atob(tokenPayload));
          var user = decodedPayload._doc;
          return user;
        } catch (err) {
          console.log(err);
          return false;
        }
      }
    }
  } 
}]);

// Adds a JWT auth token to the header of all http requests unless they are
// listed in excludedEndpoints[].
svcs.factory('AuthInterceptor', ['Auth', function(Auth) {
    // If querying other APIs, add URLs to this array.
    // Star Wars API added as example.
  var excludedEndpoints = [
    'https://swapi.co/api/films'
  ];

  return {
    request: function(config) {
      var token = Auth.getToken();
      var excludedEndpoint = excludedEndpoints.indexOf(config.url) > -1;

      if (token && !excludedEndpoint) {
        config.headers.Authorization = 'Bearer ' + token;
      }
      return config;
    }
  }
}]);