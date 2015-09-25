(function () {
    'use strict';
    angular.module('backendApp').config(configRoutes);

    configRoutes.$inject = ['$stateProvider', 'USER_ROLES', '$httpProvider', '$provide'];
    function configRoutes($stateProvider, USER_ROLES, $httpProvider, $provide) {

        $httpProvider.interceptors.push('APIInterceptor');

        $stateProvider.state('ads', {
            url: '/promos/:id',
            controller: 'AdListController',
            controllerAs: 'vm',
            templateUrl: 'partials/promos/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editorPlus]
            }
        }).state('canciones', {
            url: '/canciones/:id',
            controller: 'CancionListController',
            controllerAs: 'vm',
            templateUrl: 'partials/canciones/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('categorias', {
            url: '/categorias/:id',
            controller: 'CategoriaListController',
            controllerAs: 'vm',
            templateUrl: 'partials/categorias/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('cuentos', {
            url: '/cuentos/:id',
            controller: 'CuentoController',
            controllerAs: 'vm',
            templateUrl: 'partials/cuentos/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('comentarios', {
            url: '/comentarios/:id',
            controller: 'ComentarioController',
            controllerAs: 'vm',
            templateUrl: 'partials/comentarios/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('discos', {
            url: '/discos/:id',
            controller: 'DiscoListController',
            controllerAs: 'vm',
            templateUrl: 'partials/discos/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('eventos', {
            url: '/eventos',
            controller: 'EventoListController',
            controllerAs: 'vm',
            templateUrl: 'partials/eventos/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('noticias', {
            url: '/noticias',
            controller: 'NoticiaListController',
            controllerAs: 'vm',
            templateUrl: 'partials/noticias/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('videos', {
            url: '/videos',
            controller: 'VideoListController',
            controllerAs: 'vm',
            templateUrl: 'partials/videos/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
            }
        }).state('users', {
            url: '/users',
            controller: 'UserListController',
            controllerAs: 'vm',
            templateUrl: 'partials/users/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).state('siteusers', {
            url: '/siteusers',
            controller: 'SiteUserListController',
            controllerAs: 'vm',
            templateUrl: 'partials/siteUsers/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).state('integrantes', {
            url: '/integrantes/:id',
            controller: 'IntegranteListController',
            controllerAs: 'vm',
            templateUrl: 'partials/integrantes/list.html',
            data: {
                authorizedRoles: [USER_ROLES.admin]
            }
        }).state('login', {
            url: '/login',
            controller: 'LoginController',
            controllerAs: 'vm',
            templateUrl: 'partials/login.html'
        }).state('analytics', {
            url: '/analytics',
            controller: 'AnalyticsController',
            controllerAs: 'vm',
            templateUrl: 'partials/analytics.html'
        });

        /*.html5Mode({
         enabled:true,
         requireBase:false
         });*/
    }

})();