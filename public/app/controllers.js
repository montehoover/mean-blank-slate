ctrls = angular.module('BlankSlateCtrls', ['BlankSlateServices']);


ctrls.controller('HomeCtrl', ['$scope', function($scope) {
  $scope.angularTest = "Test successful!";
}]);


ctrls.controller('NavCtrl', ['$scope', '$location', 'Auth', 
  function($scope, $location, Auth) {
    $scope.Auth = Auth;
    $scope.logout = function() {
      Auth.removeToken();
      $location.path('/');
  }
}]);


ctrls.controller('SignupCtrl', [
  '$scope', 
  '$http', 
  '$location', 
  'Auth', 
  'Flash', 
  function($scope, $http, $location, Auth, Flash) {
    $scope.user = {
      email: '',
      password: ''
    };
    $scope.userSignup = function() {
      $http.post('api/users', $scope.user).then(function success(res) {
        Auth.saveToken(res.data.token);
        $location.path('/');
      }, function error(res) {
        Flash.create('warning', 'Signup failure: ' + res.data.message, 0, null, true);
      });
  }
}]);


ctrls.controller('LoginCtrl', ['$scope', '$http', '$location', 'Auth', 'Flash', 
  function($scope, $http, $location, Auth, Flash) {
    $scope.user = {
      email: '',
      password: ''
    };
    $scope.userLogin = function() {
      $http.post('/api/authenticate', $scope.user).then(function success(res) {
        Auth.saveToken(res.data.token);
        $location.path('/');
      }, function error(res) {
        Flash.create('warning', 'Login failure: ' + res.data.message, 0, null, true);
      });
    }
}]);