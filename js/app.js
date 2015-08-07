(function(){
    'use strict';

    angular.module('backendApp', ['ngFileUpload', 'ngMaterial', 'data-table', 'ngResource','ngMessages', 'ui.router','backendApp.controllers', 'backendApp.services'])
        .config(function($mdThemingProvider, $stateProvider, USER_ROLES) {
            var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['50'],
                '50': 'ffffff'
            });
            $mdThemingProvider.definePalette('customBlue', customBlueMap);
            $mdThemingProvider.theme('default').primaryPalette('customBlue', {'default': '500','hue-1': '50'}).accentPalette('pink');
            $mdThemingProvider.theme('input', 'default').primaryPalette('grey');

            $stateProvider .state('main', {
                url: '/',
                abstract: true,
                resolve: {

                }
            }).state('ads',{
                url:'/promos',
                templateUrl: 'partials/promos.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin]
                },
                controller: 'AdListController'
            }).state('canciones',{
                url:'/canciones',
                templateUrl: 'partials/canciones.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin]
                },
                controller: 'CancionListController'
            }).state('categorias',{
                url:'/categorias',
                templateUrl: 'partials/categorias.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor]
                },
                controller: 'CategoriaListController'
            }).state('discos',{
                url:'/discos',
                templateUrl: 'partials/discos.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin]
                },
                controller: 'DiscoListController'
            }).state('eventos',{
                url:'/eventos',
                templateUrl: 'partials/eventos.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin]
                },
                controller: 'EventoListController'
            }).state('noticias',{
                url:'/noticias',
                templateUrl: 'partials/noticias.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor]
                },
                controller: 'NoticiaListController'
            }).state('videos',{
                url:'/videos',
                templateUrl: 'partials/videos.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin]
                },
                controller: 'VideoListController'
            });
        }).constant('AUTH_EVENTS', {
            loginSuccess: 'auth-login-success',
            loginFailed: 'auth-login-failed',
            logoutSuccess: 'auth-logout-success',
            sessionTimeout: 'auth-session-timeout',
            notAuthenticated: 'auth-not-authenticated',
            notAuthorized: 'auth-not-authorized'
        }).constant('USER_ROLES', {
            all: '*',
            admin: 'admin',
            editor: 'editor',
            guest: 'guest'
        }).run(function($state,  Upload, $rootScope, AuthService, AUTH_EVENTS,USER_ROLES, $mdDialog, $http){
            $state.go('noticias');
            $rootScope.upload_url ='http://stg1.jwtdigitalpr.com/mpto/api/upload';
            $rootScope.currentUser = null;
            $rootScope.userRoles = USER_ROLES;
            $rootScope.isAuthorized = AuthService.isAuthorized;

            $rootScope.setCurrentUser = function (user) {
                $rootScope.currentUser = user;
            };
            $rootScope.$on('$stateChangeStart', function (event, next) {
                var authorizedRoles = next.data.authorizedRoles;
                $http.get('http://stg1.jwtdigitalpr.com/mpto/api/profile').success(function(response){
                  //  $rootScope.setCurrentUser(response);
                });
                if (!AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    if (AuthService.isAuthenticated()) {
                        // user is not allowed
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthorized);
                    } else {
                        // user is not logged in
                        $rootScope.$broadcast(AUTH_EVENTS.notAuthenticated);
                        $mdDialog.show({
                            templateUrl: 'partials/login.html',
                            parent: angular.element(document.getElementsByClassName('appControler'))
                        }).then(function(newEvent){
                            console.log("login finishied");
                        });
                    }
                }
            });

        }).filter('capitalize', function() {
            return function(input, all) {
                return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
            }
        });

})();