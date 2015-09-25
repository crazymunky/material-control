/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';

    angular.module('backendApp.controllers').controller('MainCtrl', function ($scope, $rootScope, $state, AuthService, UserService) {
        var main = this;


        $scope.isAuthorized = AuthService.isAuthorized;

        $rootScope.$on('authorized', function () {
            main.currentUser = UserService.getCurrentUser();
        });

        $rootScope.$on('unauthorized', function () {
            main.currentUser = UserService.setCurrentUser(null);
            $state.go('login');
        });

        $rootScope.addOrUpdateList = addOrUpdateList;

        function addOrUpdateList(array, row, index) {
            if (index < array.length && index >= 0)
                array[index] = row;
            else
                array.push(row);
        }

        main.logout = AuthService.logout;
        main.currentUser = UserService.getCurrentUser();
    });


})();