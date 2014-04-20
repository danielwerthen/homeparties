'use strict';

angular.module('homepartiesApp')
	.controller('SignupCtrl', function ($scope, $http) {
		$scope.form = {
			name: 'Daniel',
			email: 'danielwerthen+testing@gmail.com',
			password: 'testar'
		};
		$scope.submitForm = function () {
			$http.post('/api/signup', JSON.stringify($scope.form))
				.success(function () {
					$scope.message = 'Du kommer att få ett mail till epostadressen du angav, följ instruktionerna där för att slutföra registreringen';
				})
				.error(function () {
					$scope.message = 'Något gick fel, skicka ett mail till support@homeparti.es och berätta att registreringen inte fungerar';
				});
		};
	});
