(function(){
    'use strict';
    /*  var apiResources = ['Ad', 'Cancion', 'Categoria', 'Comentario', 'Cuento', 'Disco', 'Evento', 'Integrante', 'User', 'UserSite', 'Noticia', 'Video', 'Tag'];

     for (var i = 0; i < apiResources.length; i++) {
     var serviceName = apiResources[i];
     console.log("resource Name", serviceName);
     console.log("resource id", serviceName.toLowerCase());
     angular.module("backendApp.services").factory(serviceName, function ($resource, $rootScope) {
     return $resource($rootScope.server_url + '/api/ad' + serviceName.toLowerCase() + '/:id', null, {'update': {method: 'PUT'}});
     });
     }*/
    angular.module("backendApp.services").factory('Ad', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/ads/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Cancion', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/canciones/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Categoria', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/categorias/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Comentario', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/comentarios/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Cuento', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/cuentos/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Disco', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/discos/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Evento', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/eventos/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Integrante', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/integrantes/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('User', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/users/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('SiteUser', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/siteusers/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Noticia', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/noticias/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Video', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/videos/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('Tag', function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/tags/:id', null, {'update':{method: 'PUT'}});
    });

    angular.module("backendApp.services").factory('AuthService', function ($rootScope, $http, UserService) {
        var authService = {};

        authService.login = function (credentials) {
            var promise = $http.post($rootScope.server_url + '/api/login', credentials);

            promise.then(successAuhthentication, function () {
                $rootScope.$broadcast('unauthorized');
            });

            return promise;
        };

        authService.logout = function(){
            var promise = $http.post($rootScope.server_url + '/api/logout');
            $rootScope.$broadcast('unauthorized');
        };

        authService.refresh = function(){
            var user = UserService.getCurrentUser();
            if(user) {
                var promise = $http.post($rootScope.server_url + '/api/refresh', user.access_token);

                promise.then(successAuhthentication, function () {
                    $rootScope.$broadcast('unauthorized');
                });

                return promise;
            }
        };

        function successAuhthentication(response){
            var data = response.data;
            console.log("new user data", data);
            if (data.error) {
                alert("BAD LOGIN");
            } else if(data.access_token){
                UserService.setCurrentUser(data);
                $rootScope.$broadcast('authorized');
            }
        }

        authService.isAuthenticated = function () {
            return UserService.getCurrentUser()!=null;
        };

        authService.isAuthorized = function (authorizedRoles) {
            if (!angular.isArray(authorizedRoles)) {
                authorizedRoles = [authorizedRoles];
            }
            //console.log("authorized roles", authorizedRoles, "user role", UserService.getCurrentUser().role);
            return (authService.isAuthenticated() &&
            authorizedRoles.indexOf(UserService.getCurrentUser().role.toLowerCase()) !== -1);
        };

        return authService;
    });

    angular.module("backendApp.services").service('UserService', function(store) {
        var service = this,
            currentUser = null;

        service.setCurrentUser = function(user) {
            currentUser = user;

            store.set('user-backend', user);
            return currentUser;
        };

        service.getCurrentUser = function() {
            if (!currentUser) {
                currentUser = store.get('user-backend');
            }
            return currentUser;
        };
    });

    angular.module("backendApp.services").service('APIInterceptor', function($rootScope, UserService) {
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