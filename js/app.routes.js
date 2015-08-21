(function() {
    'use strict';
    angular.module('backendApp').config(config);

    function config($stateProvider, USER_ROLES, $httpProvider) {
        $httpProvider.interceptors.push('APIInterceptor');

        $stateProvider .state('ads',{
            url:'/promos',
            controller: 'AdListController',
            controllerAs: 'vm',
            templateUrl: 'partials/promos/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editorPlus]
            }
        }).state('canciones',{
            url:'/canciones',
            controller: 'CancionListController',
            controllerAs: 'vm',
            templateUrl: 'partials/canciones/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('categorias',{
            url:'/categorias',
            controller: 'CategoriaListController',
            controllerAs: 'vm',
            templateUrl: 'partials/categorias/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('cuentos',{
            url:'/cuentos',
            controller: 'CuentoController',
            controllerAs: 'vm',
            templateUrl: 'partials/cuentos/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('discos',{
            url:'/discos',
            controller: 'DiscoListController',
            controllerAs: 'vm',
            templateUrl: 'partials/discos/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('eventos',{
            url:'/eventos',
            controller: 'EventoListController',
            controllerAs: 'vm',
            templateUrl: 'partials/eventos/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('noticias',{
            url:'/noticias',
            controller: 'NoticiaListController',
            controllerAs: 'vm',
            templateUrl: 'partials/noticias/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('videos',{
            url:'/videos',
            controller: 'VideoListController',
            controllerAs: 'vm',
            templateUrl: 'partials/videos/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('users',{
            url:'/users',
            controller: 'UserListController',
            controllerAs: 'vm',
            templateUrl: 'partials/users/list.html',
            data:{
                authorizedRoles:[USER_ROLES.admin]
            }
        }).state('login',{
            url:'/login',
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: 'partials/login.html'
        });
    }

})();