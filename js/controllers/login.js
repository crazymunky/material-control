/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('LoginController', function ($scope, $rootScope,$mdDialog, AUTH_EVENTS, AuthService) {
        $scope.credentials = {
            username: '',
            password: ''
        };
        console.log($rootScope.currentUser);
        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function (user) {
                if(user.error){
                    alert("BAD LOGIN");
                }else {
                    $rootScope.$broadcast(AUTH_EVENTS.loginSuccess);
                    console.log(user);
                    $rootScope.setCurrentUser(user);
                    $mdDialog.hide();
                }
            }, function () {
                $rootScope.$broadcast(AUTH_EVENTS.loginFailed);
            });
        };
    });
})();