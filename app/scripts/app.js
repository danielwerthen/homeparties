'use strict';

angular.module('homepartiesApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute'
])
  .config(function ($routeProvider, $locationProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'partials/main',
        controller: 'MainCtrl'
      })
  	  .when('/signup', {
				templateUrl: 'partials/signup',
				controller: 'SignupCtrl'
			})
      .otherwise({
        redirectTo: '/'
      });
      
    $locationProvider.html5Mode(true);
  });
