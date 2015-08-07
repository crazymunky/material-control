(function(){
    'use strict';

    var module = angular.module('backendApp.services', []);

    module.factory('Ad', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/ads/:id');
    });

    module.factory('Cancion', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/canciones/:id');
    });

    module.factory('Categoria', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/categorias/:id');
    });

    module.factory('Disco', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/discos/:id');
    });

    module.factory('Evento', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/eventos/:id');
    });

    module.factory('Noticia', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/noticias/:id');
    });

    module.factory('Video', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/videos/:id');
    });

    module.factory('AuthService', function ($rootScope, $http, Session) {
        var authService = {};

        authService.login = function (credentials) {
            return $http
                .post('http://stg1.jwtdigitalpr.com/mpto/api/login', credentials)
                .then(function (res) {
                    Session.create(res.data);
                    return res.data;
                });
        };

        authService.isAuthenticated = function () {
            console.log($rootScope.currentUser);
            return $rootScope.currentUser!=null;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
            authorizedRoles.indexOf($rootScope.currentUser.role) !== -1);
        };

        return authService;
    });

    module.factory('AuthResolver', function ($q, $rootScope, $state) {
        return {
            resolve: function () {
                var deferred = $q.defer();
                var unwatch = $rootScope.$watch('currentUser', function (currentUser) {
                    if (angular.isDefined(currentUser)) {
                        if (currentUser) {
                            deferred.resolve(currentUser);
                        } else {
                            deferred.reject();
                            $state.go('user-login');
                        }
                        unwatch();
                    }
                });
                return deferred.promise;
            }
        };
    });
    module.service('Session', function () {
        this.create = function (loggedUser) {
            this.user = loggedUser;
        };
        this.destroy = function () {
            this.user = null;
        };
    });
})();