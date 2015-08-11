(function(){
    'use strict';

    var module = angular.module('backendApp.services', []);

    module.factory('Ad', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/ads/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('Cancion', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/canciones/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('Categoria', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/categorias/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('Disco', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/discos/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('Evento', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/eventos/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('User', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/users/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('Noticia', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/noticias/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('Video', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/videos/:id', null, {'update':{method: 'PUT'}});
    });

    module.factory('AuthService', function ($rootScope, $http, UserService) {
        var authService = {};

        authService.login = function (credentials) {
            var promise = $http.post('http://stg1.jwtdigitalpr.com/mpto/api/login', credentials);

            promise.then(function (response) {
                var data = response.data;
                if(data.error){
                    alert("BAD LOGIN");
                }else {
                    UserService.setCurrentUser(data);
                    $rootScope.$broadcast('authorized');
                }
            }, function () {
                $rootScope.$broadcast('unauthorized');
            });

            return promise;
        };

        authService.logout = function(){
            var promise = $http.post('http://stg1.jwtdigitalpr.com/mpto/api/logout');
            $rootScope.$broadcast('unauthorized');
        };
        authService.isAuthenticated = function () {
            return UserService.getCurrentUser()!=null;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(UserService.getCurrentUser().role.toLowerCase()) !== -1);
        };

        return authService;
    });

    module.service('UserService', function(store) {
        var service = this,
            currentUser = null;

        service.setCurrentUser = function(user) {
            currentUser = user;

            store.set('user', user);
            return currentUser;
        };

        service.getCurrentUser = function() {
            if (!currentUser) {
                currentUser = store.get('user');
            }
            return currentUser;
        };
    });

    module.service('APIInterceptor', function($rootScope, UserService) {
        var service = this;

        service.request = function(config) {
            var currentUser = UserService.getCurrentUser(),
                access_token = currentUser ? currentUser.access_token : null;
            if (access_token) {
                config.headers.Authorization = access_token;
            }
            return config;
        };

        service.responseError = function(response) {
            if (response.status === 401) {
                $rootScope.$broadcast('unauthorized');
            }
            return response;
        };
    })
})();