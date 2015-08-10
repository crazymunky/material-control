(function(){
    'use strict';

    angular.module('backendApp', ['angular-storage','ngFileUpload', 'ngMaterial', 'data-table', 'ngResource','ngMessages', 'ui.router','backendApp.controllers', 'backendApp.services'])
        .config(function($mdThemingProvider, $stateProvider, USER_ROLES, $httpProvider) {
            var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['50'],
                '50': 'ffffff'
            });
            $mdThemingProvider.definePalette('customBlue', customBlueMap);
            $mdThemingProvider.theme('default').primaryPalette('customBlue', {'default': '500','hue-1': '50'}).accentPalette('pink');
            $mdThemingProvider.theme('input', 'default').primaryPalette('grey');

            $httpProvider.interceptors.push('APIInterceptor');

            $stateProvider .state('ads',{
                url:'/promos',
                controller: 'AdListController',
                templateUrl: 'partials/promos/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editorPlus]
                }
            }).state('canciones',{
                url:'/canciones',
                controller: 'CancionListController',
                templateUrl: 'partials/canciones/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
                }
            }).state('categorias',{
                url:'/categorias',
                controller: 'CategoriaListController',
                templateUrl: 'partials/categorias/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
                }
            }).state('discos',{
                url:'/discos',
                controller: 'DiscoListController',
                templateUrl: 'partials/discos/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
                }
            }).state('eventos',{
                url:'/eventos',
                controller: 'EventoListController',
                templateUrl: 'partials/eventos/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
                }
            }).state('noticias',{
                url:'/noticias',
                controller: 'NoticiaListController',
                templateUrl: 'partials/noticias/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
                }
            }).state('videos',{
                url:'/videos',
                controller: 'VideoListController',
                templateUrl: 'partials/videos/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin, USER_ROLES.editor, USER_ROLES.editorPlus]
                }
            }).state('users',{
                url:'/users',
                controller: 'UserListController',
                templateUrl: 'partials/users/list.html',
                data:{
                    authorizedRoles:[USER_ROLES.admin]
                }
            }).state('login',{
                url:'/login',
                controller: 'LoginController',
                templateUrl: 'partials/login.html'
            });
        }).constant('USER_ROLES', {
            admin: 'admin',
            editor: 'editor',
            editorPlus: 'editorPlus',
            analista: 'analista',
            lector:'lector'
        }).run(function($state, $rootScope, UserService, AuthService){
            $rootScope.upload_url = 'http://stg1.jwtdigitalpr.com/mpto/api/upload';
            if(UserService.getCurrentUser() == null)
                $state.go('login');
            else {
                $state.go('videos');
            }

            $rootScope.$on('$stateChangeStart', function (event, next) {

                if(next.data)
                    var authorizedRoles = next.data.authorizedRoles;
                if (authorizedRoles && !AuthService.isAuthorized(authorizedRoles)) {
                    event.preventDefault();
                    $rootScope.$broadcast('unauthorized');
                }
            });
        }).filter('capitalize', function() {
            return function(input, all) {
                return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
            }
        }).directive('equals', function() {
            return {
                restrict: 'A', // only activate on element attribute
                require: '?ngModel', // get a hold of NgModelController
                link: function(scope, elem, attrs, ngModel) {
                    if(!ngModel) return; // do nothing if no ng-model

                    // watch own value and re-validate on change
                    scope.$watch(attrs.ngModel, function() {
                        validate();
                    });

                    // observe the other value and re-validate on change
                    attrs.$observe('equals', function (val) {
                        validate();
                    });

                    var validate = function() {
                        // values
                        var val1 = ngModel.$viewValue;
                        var val2 = attrs.equals;
                        // set validity
                        ngModel.$setValidity('equals', ! val1 || ! val2 || val1 === val2);
                    };
                }
            }
        });;

})();