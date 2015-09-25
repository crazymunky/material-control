/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('LoginController', function ($scope, $rootScope, AuthService, $state) {
        $scope.credentials = {
            email: '',
            password: ''
        };

        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function (response) {
                var data = response.data;
                if(data.error){
                    $scope.form.$isValid = false;
                }else {
                    $state.go('noticias');
                }
            });
        };

        $scope.register = function(){
            LoginService.register($scope.newUser).then(function(response){
                $scope.login($scope.newUser);
            });
        }

        $scope.newUser = null;
    });
})();