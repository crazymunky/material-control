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

    angular.module('backendApp.controllers').controller('MenuController', ['$scope', 'USER_ROLES',
        function ($scope, USER_ROLES) {
            $scope.menu = [
                {
                    link : 'ads',
                    title: 'Ads',
                    icon: 'add_shopping_cart',
                    roles: [USER_ROLES.admin, USER_ROLES.editorPlus]
                },
                {
                    link : 'canciones',
                    title: 'Canciones',
                    icon: 'music_note',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },
                {
                    link : 'categorias',
                    title: 'Categorias',
                    icon: 'filter_list',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },
                {
                    link : 'comentarios',
                    title: 'Comentarios',
                    icon: 'book',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },
                {
                    link : 'cuentos',
                    title: 'Cuentos',
                    icon: 'book',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },
                {
                    link : 'discos',
                    title: 'Discos',
                    icon: 'library_music',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },
                {
                    link : 'eventos',
                    title: 'Eventos',
                    icon: 'event',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },
                {
                    link : 'integrantes',
                    title: 'Integrantes',
                    icon: 'account_circle',
                    roles: [USER_ROLES.admin]
                },
                {
                    link : 'noticias',
                    title: 'Noticias',
                    icon: 'new_releases',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },
                {
                    link : 'videos',
                    title: 'Videos',
                    icon: 'video_library',
                    roles: [USER_ROLES.admin,USER_ROLES.editor, USER_ROLES.editorPlus]
                },{
                    link : 'users',
                    title: 'Usuarios',
                    icon: 'account_circle',
                    roles: [USER_ROLES.admin]
                }
            ];
        }
    ]);

    angular.module('backendApp.controllers').controller('MainCtrl', function ($scope, $rootScope, $state, AuthService, UserService) {
        var main = this;



        $scope.isAuthorized = AuthService.isAuthorized;

        $rootScope.$on('authorized', function() {
            main.currentUser = UserService.getCurrentUser();
        });

        $rootScope.$on('unauthorized', function() {
            main.currentUser = UserService.setCurrentUser(null);
            $state.go('login');
        });

        $rootScope.addOrUpdateList = addOrUpdateList;

        function addOrUpdateList(array, row, index){
            if(index<array.length && index>=0)
                array[index] = row;
            else
                array.push(row);
        }

        main.logout = AuthService.logout;
        main.currentUser = UserService.getCurrentUser();
    });


})();