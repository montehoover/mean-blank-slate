var app = angular.module('BlankSlateApp', ['BlankSlateCtrls', 'ui.router', 'ngFlash']);

app.config([
  '$stateProvider',
  '$urlRouterProvider',
  '$locationProvider',
  '$httpProvider',
  function($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {  

  $locationProvider.html5Mode(true);
  
  $urlRouterProvider.otherwise(function($injector) {
    var $state = $injector.get('$state');
    $state.go('404');
  });

  // This intercepts every $http request and runs the AuthInterceptor service
  // along with it.  AuthInterceptor adds an auth token to the http header.
  // $httpProvider.interceptors.push('AuthInterceptor');

  $stateProvider 
  .state('home', {
    url: '/',
    templateUrl: 'app/views/index.html',
    controller: 'HomeCtrl'
  })
  .state('signup', {
    url: '/signup',
    templateUrl: 'app/views/userSignup.html',
    controller: 'SignupCtrl'
  })
  .state('login', {
    url: '/login',
    templateUrl: 'app/views/userLogin.html',
    controller: 'LoginCtrl'
  })
  .state('404', {
    templateUrl: 'app/views/404.html'
  });
}]);


app.run(['$rootScope', 'Flash', function($rootScope, Flash) {
  $rootScope.$on('$stateChangeStart', 
    function(event, toState, toParams, fromState, fromParams) {
      Flash.clear()
  });
}]);