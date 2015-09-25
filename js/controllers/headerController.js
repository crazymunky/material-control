/**
 * Created by Maxi on 7/31/2015.
 */
(function(){
    'use strict';
    angular.module('backendApp.controllers').controller('HeaderController', ['$scope', '$mdSidenav','$rootScope',
        function ($scope, $mdSidenav,$rootScope) {
            $scope.openLeftMenu = function () {
                $mdSidenav('side-nav').toggle();
            };
            $rootScope.$on('$stateChangeSuccess',
                function(event, toState, toParams, fromState, fromParams) {
                    $scope.state = toState;
                }
            )
        }
    ]);

})();