/**
 * Created by Maxi on 7/31/2015.
 */
(function(){
    'use strict';

    var module = angular.module('backendApp.controllers', []);

    module.controller('HeaderController', ['$scope', '$mdSidenav','$rootScope',
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

    module.controller('MenuController', ['$scope',
        function ($scope) {
            $scope.menu = [
                {
                    link : 'ads',
                    title: 'Ads',
                    icon: 'add_shopping_cart'
                },
                {
                    link : 'canciones',
                    title: 'Canciones',
                    icon: 'music_note'
                },
                {
                    link : 'categorias',
                    title: 'Categorias',
                    icon: 'filter_list'
                },
                {
                    link : 'discos',
                    title: 'Discos',
                    icon: 'library_music'
                },
                {
                    link : 'eventos',
                    title: 'Eventos',
                    icon: 'event'
                },
                {
                    link : 'noticias',
                    title: 'Noticias',
                    icon: 'new_releases'
                },
                {
                    link : 'videos',
                    title: 'Videos',
                    icon: 'video_library'
                }
            ];
        }
    ]);

})();