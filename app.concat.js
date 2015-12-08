(function(){
    'use strict';


    var equalsDirective = function () {
        return {
            restrict: 'A', // only activate on element attribute
            require: '?ngModel', // get a hold of NgModelController
            link: function (scope, elem, attrs, ngModel) {
                if (!ngModel) return; // do nothing if no ng-model

                // watch own value and re-validate on change
                scope.$watch(attrs.ngModel, function () {
                    validate();
                });

                // observe the other value and re-validate on change
                attrs.$observe('equals', function (val) {
                    validate();
                });

                var validate = function () {
                    // values
                    var val1 = ngModel.$viewValue;
                    var val2 = attrs.equals;
                    // set validity
                    ngModel.$setValidity('equals', !val1 || !val2 || val1 === val2);
                };
            }
        }
    };
    var capitalizeFilter = function () {
        return function (input, all) {
            return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }) : '';
        }
    };
    angular.module('backendApp', [,'chart.js','chart.js','angular-storage','ngFileUpload', 'ngMaterial', 'data-table', 'ngResource','ngMessages', 'ui.router','backendApp.controllers', 'backendApp.services'])
        .config(themeConfig)
        .constant('USER_ROLES', {
            admin: 'admin',
            editor: 'editor',
            editorPlus: 'editorPlus',
            analista: 'analista',
            lector: 'lector'
        })
        .run(appRun)
        .filter('capitalize', capitalizeFilter)
        .directive('equals', equalsDirective);

    angular.module('backendApp.controllers',[]);
    angular.module('backendApp.services',[]);

    function appRun($state, $rootScope, UserService, AuthService) {
        switch(window.location.origin){
            case 'http://stg1.jwtdigitalpr.com':
                $rootScope.server_url = 'http://stg1.jwtdigitalpr.com/mpto';
                break;
            case 'http://192.168.235.153':
            case 'http://localhost:63342':
                $rootScope.server_url = 'http://192.168.235.153/musica_para_tus_oidos/public';
                break;
            case 'http://www.musicaparatusoidospr.com':
            case 'http://www.mptopr.com':
                $rootScope.server_url = 'http://www.musicaparatusoidospr.com';
                break;
        }
        $rootScope.upload_url = $rootScope.server_url + '/api/upload';

        $rootScope.isType = function (type, strType, file) {
            //console.log("CAMBIO DE COSO", type, strType, file);
            var isType = false;
            if (strType == type)
                isType = true;
            else if (file && file.type != undefined)
                isType = file.type.indexOf(type) > -1;

            return isType;
        };

        if (!AuthService.isAuthenticated())
            $state.go('login');
        else {
            AuthService.refresh().then(function(response){});
        }

        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next.data)
                var authorizedRoles = next.data.authorizedRoles;
            if (authorizedRoles && !AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                $rootScope.$broadcast('unauthorized');
            }
        });
    }
    appRun.$inject = ["$state", "$rootScope", "UserService", "AuthService"];;

    function themeConfig($mdThemingProvider) {
        var customBlueMap = $mdThemingProvider.extendPalette('light-blue', {
            'contrastDefaultColor': 'light',
            'contrastDarkColors': ['50'],
            '50': 'ffffff'
        });
        $mdThemingProvider.definePalette('customBlue', customBlueMap);
        $mdThemingProvider.theme('default').primaryPalette('customBlue', {
            'default': '500',
            'hue-1': '50'
        }).accentPalette('pink');
        $mdThemingProvider.theme('input', 'default').primaryPalette('grey');
    }
    themeConfig.$inject = ["$mdThemingProvider"];;
})();
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
            url: '/noticias/:id',
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
    angular.module("backendApp.services").factory('Ad', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/ads/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Cancion', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/canciones/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Categoria', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/categorias/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Comentario', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/comentarios/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Cuento', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/cuentos/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Disco', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/discos/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Evento', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/eventos/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Integrante', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/integrantes/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('User', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/users/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('SiteUser', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/siteusers/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Noticia', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/noticias/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Video', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/videos/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('Tag', ["$resource", "$rootScope", function($resource, $rootScope){
        return $resource($rootScope.server_url+ '/api/tags/:id', null, {'update':{method: 'PUT'}});
    }]);

    angular.module("backendApp.services").factory('AuthService', ["$rootScope", "$http", "UserService", function ($rootScope, $http, UserService) {
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
            //console.log("new user data", data);
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
    }]);

    angular.module("backendApp.services").service('UserService', ["store", function(store) {
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
    }]);

    angular.module("backendApp.services").service('APIInterceptor', ["$rootScope", "UserService", function($rootScope, UserService) {
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
    }])
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';

    angular.module('backendApp.controllers').controller('AnalyticsController', AnalyticsController);
    AnalyticsController.$inject = ['Ad', '$http', '$rootScope', '$scope'];
    function AnalyticsController(Ad, $http, $rootScope, $scope) {
        var vm = this;

        vm.ads = Ad.query();
        vm.options = {
            rowHeight: "auto",
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };
        //This is each day in group by
        vm.labels = [];
        //Every different stat (clicks, prints, etc)
        vm.series = [];
        //Show it or not in the chart
        vm.seriesEnabled = [true, true];

        //Data each array corresponds to one series and should both have a value for each label index
        var data = [];
        vm.data = [ ];

        vm.filter = function(newVal) {
            if(data.length == 0 ) return;
            //console.log("filter with data", data, data.length);
            //console.log("filter with enabled", vm.seriesEnabled);
            vm.data = [];
            vm.series  = [];
            vm.labels = data.fechas;
            if(vm.seriesEnabled[0]){
                vm.series.push("Clicks");
                vm.data.push(data.clicks)
            }
            if(vm.seriesEnabled[1]){
                vm.series.push("Impresiones");
                vm.data.push(data.prints)
            }
            //console.log("filtered data", vm.data);
        };


        $scope.$watch('vm.seriesEnabled', vm.filter , true);

        //STATS API
        $http.get($rootScope.server_url + "/api/analytics").then(function(response){
            //console.log("api request got" +response);
            data = response.data;
            vm.filter();
        });
    }
})();
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
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('LoginController', ["$scope", "$rootScope", "AuthService", "$state", function ($scope, $rootScope, AuthService, $state) {
        $scope.credentials = {
            email: '',
            password: ''
        };

        $scope.login = function (credentials) {
            AuthService.login(credentials).then(function (response) {
                var data = response.data;
                if(data.error){
                    $scope.form.$isValid = false;
                }else {
                    $state.go('noticias');
                }
            });
        };

        $scope.register = function(){
            LoginService.register($scope.newUser).then(function(response){
                $scope.login($scope.newUser);
            });
        }

        $scope.newUser = null;
    }]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';

    angular.module('backendApp.controllers').controller('MainCtrl', ["$scope", "$rootScope", "$state", "AuthService", "UserService", function ($scope, $rootScope, $state, AuthService, UserService) {
        var main = this;


        $scope.isAuthorized = AuthService.isAuthorized;

        $rootScope.$on('authorized', function () {
            main.currentUser = UserService.getCurrentUser();
        });

        $rootScope.$on('unauthorized', function () {
            main.currentUser = UserService.setCurrentUser(null);
            $state.go('login');
        });

        $rootScope.addOrUpdateList = addOrUpdateList;

        function addOrUpdateList(array, row, index) {
            if (index < array.length && index >= 0)
                array[index] = row;
            else
                array.push(row);
        }

        main.logout = AuthService.logout;
        main.currentUser = UserService.getCurrentUser();
    }]);


})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function(){
    'use strict';
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
                    link : 'analytics',
                    title: 'Metricas',
                    icon: 'add_shopping_cart',
                    roles: [USER_ROLES.admin, USER_ROLES.analista]
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
                },{
                    link : 'siteusers',
                    title: 'Usuarios sitio',
                    icon: 'account_circle',
                    roles: [USER_ROLES.admin]
                }
            ];
        }
    ]);



})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AddCancionController', AddCancionController);

    AddCancionController.$inject = ['$scope','$rootScope','$mdToast', '$mdDialog', 'Cancion', 'Disco', 'Upload'];

    function AddCancionController($scope, $rootScope,$mdToast, $mdDialog, Cancion, Disco, Upload){
        var vm = this;
        vm.edit = false;
        vm.discos = Disco.query();
        vm.progress = 0;
        vm.submitting = false;
        vm.fileChanged = false;
        vm.attempted = false;

        vm.submit = submit;
        vm.fileChange = fileChange;
        vm.hide = $mdDialog.hide;

        if($scope.selectedItem != undefined) {
            vm.cancion = $scope.selectedItem;
            if(vm.cancion.disco)
                vm.cancion.disco_id = vm.cancion.disco.id;
            vm.edit = true;
        }else
            vm.cancion = new Cancion();

        /*******functions*******/
        function submit(){
            vm.attempted = true;

            if(!$scope.form.$valid)
                return false;
            else
                console.log("isValid");

            vm.submitting = true;

            console.log(vm.fileChanged);
            if(vm.fileChanged)
                uploadAndSave();
            else if(vm.edit)
                update();
            else
                save();
        };


        function fileChange(){
            vm.fileChanged = true;
        };

        function uploadAndSave() {
            console.log("upload");
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.cancion.audio_source
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.cancion.audio_source = data.url;
                vm.fileChanged = true;
                vm.progress=0;
                if(vm.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                vm.submitting = false;
                vm.progress = 0;
            });
        }

        function save() {
            Cancion.save(vm.cancion).$promise.then(function (response, algo, algo2) {
                console.log(algo);
                console.log(algo2);
                if (response.error) {
                    $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                } else {
                    $mdDialog.hide(response);
                    $mdToast.show($mdToast.simple().content("Nueva cancion guardado"));
                }
                vm.submitting = false;
            });
        }

        function update() {
            Cancion.update({id: vm.cancion.id}, vm.cancion).$promise.then(function(response){
                vm.submitting = false;
                $mdDialog.hide(vm.cancion);
            });
        }
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CancionListController',CancionListController);

    CancionListController.$inject = ['$rootScope','$scope', 'Cancion', '$mdDialog','$mdToast', '$stateParams', '$state' ];
    function CancionListController($rootScope, $scope, Cancion, $mdDialog, $mdToast, $stateParams, $state){
        var vm = this;
        vm.canciones = Cancion.query();
        vm.options = {
            rowHeight: 50,
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };

        vm.showAdd = showAdd;
        vm.delete = doDelete;
        vm.showEdit = navigateToItem;
        vm.hide = $mdDialog.cancel;

        activate();

        /**********************/
        function activate(){
            if($stateParams.id){
                Cancion.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };

        function showAdd(ev){
            $mdDialog.show({
                controller: 'AddCancionController',
                controllerAs: 'vm',
                templateUrl: 'partials/canciones/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function(newModel){
                if(newModel!= true)
                    $rootScope.addOrUpdateList(vm.canciones, newModel);
            });
        };


        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Cancion.delete({id: row.id}).$promise.then(function (response) {
                    if (response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.canciones.indexOf(row);
                        vm.canciones.splice(index, 1);
                    }
                });
            });

        };

        function navigateToItem(row){
            $state.go("canciones",{id:row.id}, {notify:false});
            showEdit(row);
        };

        function showEdit(row){
            $scope.selectedItem = angular.copy(row);
            var index = vm.canciones.indexOf(row);
            $mdDialog.show({
                controller: 'AddCancionController',
                controllerAs: 'vm',
                templateUrl: 'partials/canciones/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function(edited){
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.canciones, edited, index);
                $state.go("canciones",{id:''}, {notify:false});
            });
        };


    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';

    angular.module('backendApp.controllers').controller('AddCategoriaController',AddCategoriaController);
    AddCategoriaController.$inject = ['$scope','$mdToast', '$mdDialog', 'Categoria'];
    function AddCategoriaController($scope, $mdToast, $mdDialog, Categoria) {
        var vm = this;

        vm.categoria = null;
        vm.edit = false;

        vm.hide = $mdDialog.hide;
        vm.submitting = false;
        vm.attempted = false;
        vm.submit = submit;

        activate();

        /******************/

        function activate(){
            if ($scope.selectedItem != undefined) {
                vm.categoria = $scope.selectedItem;
                vm.edit = true;
            } else
                vm.categoria = new Categoria();
        }

        function submit() {
            vm.attempted = true;
            if (!$scope.form.$valid)
                return false;

            if (vm.edit)
                update();
            else
                save();
        }

        function save() {
            Categoria.save(vm.categoria).$promise.then(function (response) {
                if (response.error) {
                    $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                } else {
                    $mdDialog.hide(response);
                    $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
                }
                vm.submitting = false;
            });
        }

        function update() {
            Categoria.update({id: vm.categoria.id}, vm.categoria).$promise.then(function (response) {
                vm.submitting = false;
                $mdDialog.hide(vm.categoria);
            });
        }
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CategoriaListController', CategoriaListController);
    CategoriaListController.$inject = ['Categoria', '$rootScope','$scope','$mdDialog', '$mdToast', '$state', '$stateParams'];

    function CategoriaListController(Categoria,$rootScope, $scope, $mdDialog, $mdToast, $state, $stateParams){
        var vm = this;
        vm.categorias = Categoria.query();
        vm.options = {
            rowHeight: 50,
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };
        vm.showAdd = showAdd;
        vm.delete = doDelete;
        vm.showEdit = navigateToItem;

        activate();

        /**********************/
        function activate(){
            if($stateParams.id){
                Categoria.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };

        function navigateToItem(row){
            $state.go("categorias",{id:row.id}, {notify:false});
            showEdit(row);
        };

        function showAdd(ev) {
            $mdDialog.show({
                controller: 'AddCategoriaController',
                controllerAs: 'vm',
                templateUrl: 'partials/categorias/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (newEvent) {
                if (newEvent !== undefined)
                    vm.categorias.push(newEvent);
            });
        }


        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Categoria.delete({id: row.id}).$promise.then(function (response) {
                    if (response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.categorias.indexOf(row);
                        vm.categorias.splice(index, 1);
                    }
                });
            });
        };


        function showEdit(row) {
            $scope.selectedItem = row;
            var index = vm.categorias.indexOf(row);
            $mdDialog.show({
                controller: 'AddCategoriaController',
                controllerAs:'vm',
                templateUrl: 'partials/categorias/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function(edited){
                console.log("back", edited);
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.categorias, edited, index);
                $state.go("categorias",{id:''}, {notify:false});
            });
        }
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CuentoController',['$scope', 'Cuento', '$mdDialog','$mdToast',
        function($scope, Cuento, $mdDialog, $mdToast){
            var data;

            Cuento.query().$promise.then(function(response){
                $scope.cuentos = data = response;
                console.log($scope.cuentos);
            });
            $scope.hide = $mdDialog.hide;

            $scope.options = {
                rowHeight: 'auto',
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };

            $scope.filters = {
                aprobados: false,
                pendientes: false,
                rechazados: false
            };

            $scope.filter = function(newVal) {
                console.log("filtering");
                if(!data)return;
                if(!$scope.filters.aprobados &&!$scope.filters.pendientes && !$scope.filters.rechazados)
                    $scope.cuentos = data;
                else
                    $scope.cuentos = data.filter(function(d) {
                        var aprobado = d.aprobado;

                        switch(aprobado){
                            case 1:
                                var retorno = $scope.filters.aprobados;
                                break;
                            case 0:
                                var retorno = $scope.filters.rechazados;
                                break;
                            case -1:
                                var retorno = $scope.filters.pendientes;
                                break;
                        }
                        return retorno;
                    });
                console.log($scope.cuentos);
            };

            $scope.$watch('filters', $scope.filter , true);
            $scope.delete = doDelete;
            function doDelete(row, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var confirm = $mdDialog.confirm()
                    .content('Esta seguro que desea borrar este elemento')
                    .ok('Borrar')
                    .cancel('Cancelar')
                    .targetEvent($event);

                $mdDialog.show(confirm).then(function(){
                    Cuento.delete({id: row.id}).$promise.then(function (response) {
                        if (response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.cuentos.indexOf(row);
                            $scope.cuentos.splice(index, 1);
                        }
                    });
                });
            };

            $scope.approve = function(row, isApproved, $event){
                $event.preventDefault();
                $event.stopPropagation();
                $mdDialog.hide();
                console.log("aprobar", row);
                row.aprobado = isApproved ? 1 : 0;
                $scope.filter();
                $scope.submitting = true;
                Cuento.update({id: row.id}, row).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide(row);
                });

            };


            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    templateUrl: 'partials/cuentos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    controller: ShowCuentoController
                });
            };

            function ShowCuentoController($scope, $mdDialog){
                console.log("INIT");
                $scope.cuento = $scope.selectedItem;
            }
            ShowCuentoController.$inject = ["$scope", "$mdDialog"];
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('ComentarioController',['$scope', 'Comentario', '$mdDialog','$mdToast',
        function($scope, Comentario, $mdDialog, $mdToast){
            var data;

            Comentario.query().$promise.then(function(response){$scope.comentarios = data = response;$scope.filter();});
            $scope.hide = $mdDialog.hide;

            $scope.options = {
                rowHeight: 'auto',
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };

            $scope.filters = {
                aprobados: false,
                pendientes: true,
                rechazados: false
            };

            $scope.filter = function(newVal) {
                if(!data)return;
                if(!$scope.filters.aprobados &&!$scope.filters.pendientes && !$scope.filters.rechazados)
                    $scope.comentarios = [];
                else
                    $scope.comentarios = data.filter(function(d) {
                        var aprobado = d.aprobado;
                        var retorno = false;
                        switch(aprobado){
                            case 1:
                                retorno = $scope.filters.aprobados;
                                break;
                            case 0:
                                retorno = $scope.filters.rechazados;
                                break;
                            case -1:
                                retorno = $scope.filters.pendientes;
                                break;
                        }
                        return retorno;
                    });
            };


            $scope.$watch('filters', $scope.filter , true);

            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Comentario.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.comentarios.indexOf(row);
                        $scope.comentarios.splice(index, 1);
                        data.splice(index, 1);
                    }
                });
            };

            $scope.approve = function(row, isApproved, $event){
                $event.preventDefault();
                $event.stopPropagation();
                $mdDialog.hide();
                console.log("aprobar", row);
                row.aprobado = isApproved ? 1 : 0;
                $scope.filter();
                $scope.submitting = true;
                Comentario.update({id: row.id}, row).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide(row);
                });

            };


            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    templateUrl: 'partials/comentarios/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    controller: ShowComentarioController
                });
            };

            function ShowComentarioController($scope, $mdDialog){
                $scope.comentario = $scope.selectedItem;
                console.log("INIT", $scope.comentario);
            }
            ShowComentarioController.$inject = ["$scope", "$mdDialog"];
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';
    angular.module('backendApp.controllers').controller('AddDiscoController', AddDiscoController);
    AddDiscoController.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'Disco', 'Upload']

    function AddDiscoController($rootScope, $scope, $mdToast, $mdDialog, Disco, Upload) {
        var vm = this;
        vm.hide = $mdDialog.hide;
        vm.edit = false;
        vm.disco = null;
        vm.submitting = false;
        vm.attempted = false;
        vm.progress = 0;
        vm.fileChanged = false;

        vm.fileChange = function () {
            vm.fileChanged = true;
        };
        vm.submit = submit;

        activate();

        function activate() {
            if ($scope.selectedItem != undefined) {
                vm.disco = $scope.selectedItem;
                vm.edit = true;
            } else
                vm.disco = new Disco();
        }

        function submit() {
            vm.attempted = true;
            if (!$scope.form.$valid)
                return false;

            vm.submitting=true;
            console.log("fileChanged", vm.fileChanged);
            if (vm.fileChanged)
                uploadAndSave();
            else if (vm.edit)
                update();
            else
                save();
        }

        function save() {
            vm.disco.$save(function (response) {
                $mdDialog.hide(vm.disco);
                vm.submitting = false;
                $mdToast.show($mdToast.simple().content("Nuevo disco guardado"));
            }, function (response) {
                $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                vm.submitting = false;
            });
        }

        function uploadAndSave() {
            vm.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.disco.cover_img
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.disco.cover_img = data.url;
                vm.fileChanged = true;
                vm.progress = 0;
                if (vm.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                vm.submitting = false;
                vm.progress = 0;
            });
        }

        function update() {
            Disco.update({id: vm.disco.id}, vm.disco).$promise.then(function (response) {
                vm.submitting = false;
                $mdDialog.hide(vm.disco);
            });
        }
    };
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('DiscoListController',DiscoListController);
    DiscoListController.$inject = ['$scope', '$rootScope','$state', 'Disco', '$mdDialog','$mdToast', '$stateParams'];
    function DiscoListController($scope,$rootScope, $state, Disco, $mdDialog, $mdToast,$stateParams){
        var vm = this;
        vm.discos = Disco.query();
        vm.options = {
            rowHeight: 50,
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };

        vm.showAdd = showAdd;
        vm.delete = doDelete;
        vm.showEdit = navigateToItem;

        activate();

        /**********************/
        function activate(){
            if($stateParams.id){
                Disco.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };
        function navigateToItem(row){
            $state.go("discos",{id:row.id}, {notify:false});
            showEdit(row);
        };


        function showAdd(ev) {
            $mdDialog.show({
                controller: 'AddDiscoController',
                controllerAs: 'vm',
                templateUrl: 'partials/discos/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (newEvent) {
                if (newEvent !== undefined)
                    vm.discos.push(newEvent);
            });
        }

        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Noticia.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.discos.indexOf(row);
                        vm.discos.splice(index, 1);
                    }
                });
            });

        };


        function showEdit(row) {
            $scope.selectedItem = row;
            var index = vm.discos.indexOf(row);
            $mdDialog.show({
                controller: 'AddDiscoController',
                controllerAs: 'vm',
                templateUrl: 'partials/discos/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function(edited){
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.discos, edited, index);
                $state.go("discos",{id:''}, {notify:false});
            });
        }
    };
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('EventoListController',['$scope', 'Evento', '$mdDialog','$mdToast',
        function($scope, Evento, $mdDialog, $mdToast){
            $scope.eventos = Evento.query();
            $scope.options = {
                rowHeight: 50,
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };
            $scope.showAdd = function(ev){
                $mdDialog.show({
                    controller: 'AddEventoController',
                    templateUrl: 'partials/eventos/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined) {
                        newEvent.fecha = new Date(newEvent.fecha);
                        $scope.eventos.push(newEvent);
                    }
                })
            };

            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Evento.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.eventos.indexOf(row);
                        $scope.eventos.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddEventoController',
                    templateUrl: 'partials/eventos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddEventoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Evento','Upload',
        function($rootScope, $scope,$mdToast, $mdDialog, Evento, Upload){
            if($scope.selectedItem!= undefined) {
                $scope.evento = $scope.selectedItem;
                $scope.evento.fecha = new Date($scope.evento.fecha);
                $scope.edit = true;
            }else
                $scope.evento = new Evento();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submitting = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if($scope.fileChanged)
                    uploadAndSave();
                else if($scope.edit)
                    update();
                else
                    save();
            };

            function save() {
                $scope.evento.$save(function (response) {
                    $mdDialog.hide($scope.evento);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nuevo evento guardado"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                    $scope.submitting = false;
                });
            }
            $scope.progress = 0;
            $scope.fileChanged = false;
            $scope.fileChange = function(){
                $scope.fileChanged = true;
            };
            function uploadAndSave() {
                $scope.submitting = true;
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.evento.imagen
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.evento.imagen = data.url;
                    $scope.fileChanged = true;
                    $scope.progress = 0;
                    if($scope.edit)
                        update();
                    else
                        save();
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    $scope.submitting = false;
                    $scope.progress = 0;
                });

            }
            function update() {
                Evento.update({id: $scope.evento.id}, $scope.evento).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.evento);
                });
            }
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('EventoListController',['$scope', 'Evento', '$mdDialog','$mdToast',
        function($scope, Evento, $mdDialog, $mdToast){
            $scope.eventos = Evento.query();
            $scope.options = {
                rowHeight: 50,
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };
            $scope.showAdd = function(ev){
                $mdDialog.show({
                    controller: 'AddEventoController',
                    templateUrl: 'partials/eventos/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined) {
                        newEvent.fecha = new Date(newEvent.fecha);
                        $scope.eventos.push(newEvent);
                    }
                })
            };

            $scope.delete = doDelete;
            function doDelete(row, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var confirm = $mdDialog.confirm()
                    .content('Esta seguro que desea borrar este elemento')
                    .ok('Borrar')
                    .cancel('Cancelar')
                    .targetEvent($event);

                $mdDialog.show(confirm).then(function(){
                    Evento.delete({id:row.id}).$promise.then(function(response){
                        if(response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.eventos.indexOf(row);
                            $scope.eventos.splice(index, 1);
                        }
                    });
                });

            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddEventoController',
                    templateUrl: 'partials/eventos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddEventoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Evento','Upload',
        function($rootScope, $scope,$mdToast, $mdDialog, Evento, Upload){
            if($scope.selectedItem!= undefined) {
                $scope.evento = $scope.selectedItem;
                $scope.evento.fecha = new Date($scope.evento.fecha);
                $scope.edit = true;
            }else
                $scope.evento = new Evento();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submitting = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if($scope.fileChanged)
                    uploadAndSave();
                else if($scope.edit)
                    update();
                else
                    save();
            };

            function save() {
                $scope.evento.$save(function (response) {
                    $mdDialog.hide($scope.evento);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nuevo evento guardado"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                    $scope.submitting = false;
                });
            }
            $scope.progress = 0;
            $scope.fileChanged = false;
            $scope.fileChange = function(){
                $scope.fileChanged = true;
            };
            function uploadAndSave() {
                $scope.submitting = true;
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.evento.imagen
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.evento.imagen = data.url;
                    $scope.fileChanged = true;
                    $scope.progress = 0;
                    if($scope.edit)
                        update();
                    else
                        save();
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    $scope.submitting = false;
                    $scope.progress = 0;
                });

            }
            function update() {
                Evento.update({id: $scope.evento.id}, $scope.evento).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.evento);
                });
            }
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AddIntegranteController', AddIntegranteController);

    AddIntegranteController.$inject = ['$scope','$rootScope','$mdToast', '$mdDialog', 'Integrante', 'Disco', 'Upload'];

    function AddIntegranteController($scope, $rootScope,$mdToast, $mdDialog, Integrante, Disco, Upload){
        var vm = this;
        vm.edit = false;
        vm.discos = Disco.query();
        vm.progress = 0;
        vm.submitting = false;
        vm.fileChanged = false;
        vm.attempted = false;

        vm.submit = submit;
        vm.fileChange = fileChange;
        vm.hide = $mdDialog.hide;

        if($scope.selectedItem != undefined) {
            vm.integrante = $scope.selectedItem;
            vm.edit = true;
        }else
            vm.integrante = new Integrante();

        /*******functions*******/
        function submit(){
            vm.attempted = true;
            vm.submitting = true;
            if(!$scope.form.$valid)
                return false;

            if(vm.fileChanged)
                uploadAndSave();
            else if(vm.edit)
                update();
            else
                save();
        };


        function fileChange(){
            vm.fileChanged = true;
        };

        function uploadAndSave() {
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.integrante.imagen
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.integrante.imagen = data.url;
                vm.fileChanged = true;
                vm.progress=0;
                if(vm.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                vm.submitting = false;
                vm.progress = 0;
            });
        }

        function save() {
            Integrante.save(vm.integrante).$promise.then(function (response, algo, algo2) {
                console.log(algo);
                console.log(algo2);
                if (response.error) {
                    $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                } else {
                    $mdDialog.hide(response);
                    $mdToast.show($mdToast.simple().content("Nueva integrante guardado"));
                }
                vm.submitting = false;
            });
        }

        function update() {
            Integrante.update({id: vm.integrante.id}, vm.integrante).$promise.then(function(response){
                vm.submitting = false;
                $mdDialog.hide(vm.integrante);
            });
        }
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('IntegranteListController',IntegranteListController);

    IntegranteListController.$inject = ['$rootScope','$scope', 'Integrante', '$mdDialog','$mdToast', '$stateParams', '$state' ];
    function IntegranteListController($rootScope, $scope, Integrante, $mdDialog, $mdToast, $stateParams, $state){
        var vm = this;
        vm.integrantes = Integrante.query();
        vm.options = {
            rowHeight: 50,
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };

        vm.showAdd = showAdd;
        vm.delete = doDelete;
        vm.showEdit = navigateToItem;
        vm.hide = $mdDialog.cancel;

        activate();

        /**********************/
        function activate(){
            if($stateParams.id){
                Integrante.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };

        function showAdd(ev){
            $mdDialog.show({
                controller: 'AddIntegranteController',
                controllerAs: 'vm',
                templateUrl: 'partials/integrantes/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function(newModel){
                if(newModel!= true)
                    $rootScope.addOrUpdateList(vm.integrantes, newModel)
            });
        };

        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Integrante.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.integrantes.indexOf(row);
                        vm.integrantes.splice(index, 1);
                    }
                });
            });

        };

        function navigateToItem(row){
            $state.go("integrantes",{id:row.id}, {notify:false});
            showEdit(row);
        };

        function showEdit(row){
            $scope.selectedItem = angular.copy(row);
            var index = vm.integrantes.indexOf(row);
            $mdDialog.show({
                controller: 'AddIntegranteController',
                controllerAs: 'vm',
                templateUrl: 'partials/integrantes/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function(edited){
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.integrantes, edited, index);
                $state.go("integrantes",{id:''}, {notify:false});
            });
        };
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AddNoticiaController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Noticia','Categoria','Video','Cancion','Ad', 'Upload','Tag',
        function($rootScope,$scope,$mdToast, $mdDialog, Noticia, Categoria, Video, Cancion, Ad, Upload, Tag){
            if($scope.selectedItem!= undefined) {
                $scope.noticia = $scope.selectedItem;
                $scope.noticia.fecha = new Date($scope.noticia.fecha);
                if($scope.noticia.categorias && $scope.noticia.categorias.length!=0)
                    $scope.noticia.categoria_id = $scope.noticia.categorias[0].id;
                if($scope.noticia.video)
                    $scope.noticia.video_id = $scope.noticia.video.id;
                if($scope.noticia.cancion)
                    $scope.noticia.cancion_id = $scope.noticia.cancion.id;
                $scope.edit = true;
                if(!$scope.noticia.noticiaads[0])
                    $scope.noticia.noticiaads[0] = {ad_id:0};
                if(!$scope.noticia.noticiaads[1])
                    $scope.noticia.noticiaads[1] = {ad_id:0};
            }else {
                $scope.noticia = new Noticia();
                $scope.noticia.tags = [];
                $scope.noticia.noticiaads = [];
                $scope.noticia.noticiaads[0] = {ad_id:0};
                $scope.noticia.noticiaads[1] = {ad_id:0};
            }



            console.log($scope.noticia);

            $scope.categorias = Categoria.query();
            $scope.videos = Video.query();
            $scope.canciones = Cancion.query();
            $scope.ads = Ad.query();
            $scope.tags = Tag.query();

            $scope.posiciones = new Array(6);

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.filterSize = function(item){
                var wantedSize = ["970x90", "728x90"];
                var matches = wantedSize.indexOf(item.size)>-1;
                //console.log(item.size, wantedSize, matches);
                return matches;
            }

            $scope.submitting = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if($scope.fileChanged)
                    uploadAndSave();
                else if($scope.edit)
                    update();
                else
                    save();
            };

            function save() {
                $scope.noticia.$save(function (response) {
                    $mdDialog.hide($scope.noticia);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nueva noticia guardada"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                    $scope.submitting = false;
                });
            }
            $scope.progress = 0;
            $scope.fileChanged = false;
            $scope.fileChange = function(){
                $scope.fileChanged = true;
            };
            function uploadAndSave() {
                $scope.submitting = true;
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.noticia.imagen
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.noticia.imagen= data.url;
                    $scope.fileChanged = true;
                    $scope.progress = 0;
                    if($scope.edit)
                        update();
                    else
                        save();
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    $scope.submitting = false;
                    $scope.progress = 0;
                });
            }

            function update() {
                Noticia.update({id: $scope.noticia.id}, $scope.noticia).$promise.then(function(response){
                    $scope.submitting = false;
                    $scope.noticia = response;
                    $scope.noticia.fecha = new Date($scope.noticia.fecha);
                    if($scope.noticia.categorias && $scope.noticia.categorias.length > 0)
                        $scope.noticia.categoria_id = $scope.noticia.categorias[0].id;
                    if($scope.noticia.video)
                        $scope.noticia.video_id = $scope.noticia.video.id;
                    if($scope.noticia.cancion)
                        $scope.noticia.cancion_id = $scope.noticia.cancion.id;
                    $mdDialog.hide(response);
                });
            }


            /****TAGS CHIPS **********/

            $scope.searchText = null;
            $scope.querySearch = querySearch;
            $scope.tags = loadTags();
            $scope.selectedTags = [];
            $scope.numberChips = [];
            $scope.numberChips2 = [];
            $scope.numberBuffer = '';
            /**
             * Search for tags.
             */
            function querySearch (query) {
                var results = query ? $scope.tags.then(function(data){
                    return data.filter(createFilterFor(query));
                }): [];
                return results;
            }

            /*
             * Add new tag if it doesnt exist
             */
            $scope.newTag =  function (chip){
                if(!chip.nombre) {
                    var newTag = {
                        nombre: chip
                    }
                    return newTag;
                }else
                    return chip;

            }

            /**
             * Create filter function for a query string
             */
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(tag) {
                    return (tag.nombre.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            }
            function loadTags() {
                return Tag.query().$promise.then(function(data){
                    return data;
                });
            }
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('NoticiaListController',['$rootScope','$scope', 'Noticia', '$mdDialog', '$mdToast','$state','$stateParams',
        function($rootScope, $scope, Noticia, $mdDialog, $mdToast, $state, $stateParams){
            $scope.noticias = Noticia.query();
            $scope.options = {
                rowHeight: 50,
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };

            activate();

            /**********************/
            function activate(){
                if($stateParams.id){
                    Noticia.get({id:$stateParams.id}).$promise.then(function(response){
                        showEdit(response);
                    });
                }
            };
            $scope.showAdd = function(ev){
                $mdDialog.show({
                    controller: 'AddNoticiaController',
                    templateUrl: 'partials/noticias/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newModel){
                    if(newModel!= true)
                        $rootScope.addOrUpdateList($scope.noticias, newModel);
                });
            };
            $scope.delete = doDelete;
            function doDelete(row, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var confirm = $mdDialog.confirm()
                    .content('Esta seguro que desea borrar este elemento')
                    .ok('Borrar')
                    .cancel('Cancelar')
                    .targetEvent($event);

                $mdDialog.show(confirm).then(function(){
                    Noticia.delete({id:row.id}).$promise.then(function(response){
                        if(response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.noticias.indexOf(row);
                            $scope.noticias.splice(index, 1);
                        }
                    });
                });

            };

            $scope.showEdit = navigateToItem;
            function navigateToItem(row){
                $state.go("noticias",{id:row.id}, {notify:false});
                showEdit(row);
            };

            function showEdit(row) {
                $scope.selectedItem = angular.copy(row);
                ;
                var index = $scope.noticias.indexOf(row);
                $mdDialog.show({
                    controller: 'AddNoticiaController',
                    templateUrl: 'partials/noticias/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                }).then(function (edited) {
                    if (edited != true)
                        $rootScope.addOrUpdateList($scope.noticias, edited, index);
                    $state.go("noticias", {id: ''}, {notify: false});
                });
            }
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AddAdController',AddAdController);

    AddAdController.$inject = ['$rootScope','$scope','$mdToast', '$mdDialog', 'Ad', 'Upload'];
    function AddAdController($rootScope, $scope, $mdToast, $mdDialog, Ad, Upload) {
        var vm = this;

        vm.edit = false;
        vm.submitting = false;
        vm.attempted = false;
        vm.progress = 0;
        vm.fileChanged = false;
        vm.sizes = [ "300x50","300x250", "300x600", "970x90","728x90",  "810x550"];
        vm.posiciones = [1, 2, 3];
        vm.posiciones_tamano = ['(728x90)', '(300x250)', '(728x90)'];

        if ($scope.selectedItem != undefined) {
            vm.ad = $scope.selectedItem;
            vm.edit = true;
        } else
            vm.ad = new Ad;


        vm.hide = $mdDialog.hide;

        vm.submit = function () {
            vm.attempted = true;

            if (!$scope.adForm.$valid)
                return false;

            vm.submitting = true;

            if (vm.fileChanged)
                uploadAndSave();
            else if (vm.edit)
                update();
            else
                save();
        };

        vm.fileChange = function () {
            vm.fileChanged = true;
        };

        function save() {
            vm.ad.$save(function (response) {
                $mdDialog.hide(vm.ad);
                vm.submitting = false;
                $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
            }, function (response) {
                $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                vm.submitting = false;
            });
        }


        function update() {
            Ad.update({id: vm.ad.id}, vm.ad).$promise.then(function (response) {
                console.log("finished", response);
                vm.submitting = false;
                $mdDialog.hide(vm.ad);
            });
        }




        function uploadAndSave() {
            vm.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.ad.source
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.ad.source = data.url;
                vm.ad.type = data.type;
                vm.fileChanged = false;
                vm.progress = 0;
                if (vm.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                vm.submitting = false;
                vm.progress = 0;
            });

        }

    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AdListController',AdListController);
    AdListController.$inject = ['$rootScope','$scope','Ad', '$mdDialog', '$mdToast', '$state', '$stateParams'];
    function AdListController($rootScope, $scope, Ad, $mdDialog, $mdToast, $state, $stateParams) {
        var vm = this;

        vm.ads = Ad.query();
        vm.showEdit = navigateToItem;

        vm.options = {
            rowHeight: "auto",
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };

        vm.showAdd = function (ev) {
            $mdDialog.show({
                controller: 'AddAdController',
                controllerAs: 'vm',
                templateUrl: 'partials/promos/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (newObj) {
                if (newObj!==true)
                    vm.ads.push(newObj);
            });
        };

        activate();

        /**********************/
        function activate(){
            if($stateParams.id){
                console.log($stateParams);
                Ad.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };

        vm.delete = doDelete;
        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Ad.delete({id: row.id}).$promise.then(function (response) {
                    if (response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.ads.indexOf(row);
                        vm.ads.splice(index, 1);
                    }
                });
            });

        };


        function navigateToItem(row){
            $state.go("ads",{id:row.id}, {notify:false});
            showEdit(row);
        };
        function showEdit(row) {
            var index = vm.ads.indexOf(row);
            row = Ad.get({id:row.id}, function(){
                vm.ads[index] = row;
                $scope.selectedItem = angular.copy(row);
                $mdDialog.show({
                    controller: 'AddAdController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/promos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                }).then(function(edited){
                    if(edited!= true)
                        $rootScope.addOrUpdateList(vm.ads, edited, index);
                    $state.go("ads",{id:''}, {notify:false});
                });
            });
        };

    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('SiteUserController',SiteUserController);
    SiteUserController.$inject = ['$rootScope','$scope','$mdToast', '$mdDialog', 'SiteUser','Upload','USER_ROLES'];

    function SiteUserController($rootScope, $scope,$mdToast, $mdDialog, SiteUser, Upload, USER_ROLES){
        var vm = this;
        if($scope.selectedItem!= undefined) {
            vm.user = $scope.selectedItem;
            vm.edit = true;
        }else
            vm.user = new SiteUser();

        vm.submitting = false;
        vm.attempted = false;
        vm.progress = 0;
        vm.filechanged = false;


        vm.roles = {};
        vm.roles[USER_ROLES.admin ]= "Administrador";
        vm.roles[USER_ROLES.editor]= "Editor";
        vm.roles[USER_ROLES.editorPlus]="Editor Plus";
        vm.roles[USER_ROLES.analista]="Analista";
        vm.roles[USER_ROLES.lector]="Lector";


        vm.hide = $mdDialog.hide;
        vm.submit = submit;
        vm.fileChange = fileChange;


        function fileChange() {
            console.log("fileChange");
            vm.filechanged = true;
        }

        function submit() {
            vm.attempted = true;
            if (!$scope.form.$valid)
                return false;
            vm.submitting = true;
            if (vm.filechanged)
                uploadAndSave();
            else if (vm.edit)
                update();
            else
                save();
        }


        function save() {
            SiteUser.save(vm.user,function (data) {
                if (data.error) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    vm.submitting = false;
                } else {
                    $mdDialog.hide(vm.user);
                    $mdToast.show($mdToast.simple().content("Nuevo usuario guardado"));
                }

            });
        }



        function uploadAndSave() {
            vm.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.user.imagen
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.user.imagen = data.url;
                vm.filechanged = true;
                vm.progress = 0;
                if(vm.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                vm.submitting = false;
                vm.progress = 0;
            });

        }
        function update() {
            SiteUser.update({id: vm.user.id}, vm.user).$promise.then(function(response){
                vm.submitting = false;
                $mdDialog.hide(vm.user);
            });
        }
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';
    angular.module('backendApp.controllers').controller('SiteUserListController', ['$rootScope', '$scope', 'SiteUser', '$mdDialog', 'USER_ROLES', '$mdToast', '$state',
        function ($rootScope, $scope, SiteUser, $mdDialog, USER_ROLES, $mdToast, $state) {
            $scope.siteusers = SiteUser.query();

            $scope.options = {
                rowHeight: 50,
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };

            $scope.showAdd = function (ev) {
                $mdDialog.show({
                    controller: 'SiteUserController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/siteUsers/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function (newEvent) {
                    if (newEvent !== undefined)
                        $scope.siteusers.push(newEvent);
                });
            };

            $scope.delete = doDelete;
            function doDelete(row, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var confirm = $mdDialog.confirm()
                    .content('Esta seguro que desea borrar este elemento')
                    .ok('Borrar')
                    .cancel('Cancelar')
                    .targetEvent($event);

                $mdDialog.show(confirm).then(function(){
                    SiteUser.delete({id:row.id}).$promise.then(function(response){
                        if(response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.siteusers.indexOf(row);
                            $scope.siteusers.splice(index, 1);
                        }
                    });
                });

            };

            $scope.showEdit = function (row) {
                $scope.selectedItem = angular.copy(row);
                var index = $scope.siteusers.indexOf(row);
                $mdDialog.show({
                    controller: 'SiteUserController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/siteUsers/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                }).then(function (edited) {
                    if (edited != true)
                        $rootScope.addOrUpdateList($scope.siteusers, edited, index);
                    $state.go("siteusers", {id: ''}, {notify: false});
                });

            };
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('UserController',UserController);
    UserController.$inject = ['$rootScope','$scope','$mdToast', '$mdDialog', 'User','Upload','USER_ROLES'];
    function UserController($rootScope, $scope,$mdToast, $mdDialog, User, Upload, USER_ROLES){
        var vm = this;
        if($scope.selectedItem!= undefined) {
            vm.user = $scope.selectedItem;
            vm.edit = true;
        }else
            vm.user = new User();

        vm.submitting = false;
        vm.attempted = false;
        vm.progress = 0;
        vm.filechanged = false;


        vm.roles = {};
        vm.roles[USER_ROLES.admin ]= "Administrador";
        vm.roles[USER_ROLES.editor]= "Editor";
        vm.roles[USER_ROLES.editorPlus]="Editor Plus";
        vm.roles[USER_ROLES.analista]="Analista";
        vm.roles[USER_ROLES.lector]="Lector";


        vm.hide = $mdDialog.hide;
        vm.submit = submit;
        vm.fileChange = fileChange;


        function fileChange() {
            console.log("fileChange");
            vm.filechanged = true;
        }

        function submit() {
            vm.attempted = true;
            if (!$scope.form.$valid)
                return false;
            vm.submitting = true;
            if (vm.filechanged)
                uploadAndSave();
            else if (vm.edit)
                update();
            else
                save();
        }


        function save() {
            User.save(vm.user,function (data) {
                if (data.error) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    vm.submitting = false;
                } else {
                    $mdDialog.hide(vm.user);
                    $mdToast.show($mdToast.simple().content("Nuevo usuario guardado"));
                }

            });
        }



        function uploadAndSave() {
            vm.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.user.imagen
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.user.imagen = data.url;
                vm.filechanged = true;
                vm.progress = 0;
                if(vm.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                vm.submitting = false;
                vm.progress = 0;
            });

        }
        function update() {
            User.update({id: vm.user.id}, vm.user).$promise.then(function(response){
                vm.submitting = false;
                $mdDialog.hide(vm.user);
            });
        }
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';
    angular.module('backendApp.controllers').controller('UserListController', ['$rootScope', '$scope', 'User', '$mdDialog', 'USER_ROLES', '$mdToast', '$state',
        function ($rootScope, $scope, User, $mdDialog, USER_ROLES, $mdToast, $state) {
            $scope.users = User.query();

            $scope.roles = {};
            $scope.roles[USER_ROLES.admin] = "Administrador";
            $scope.roles[USER_ROLES.editor] = "Editor";
            $scope.roles[USER_ROLES.editorPlus] = "Editor Plus";
            $scope.roles[USER_ROLES.analista] = "Analista";
            $scope.roles[USER_ROLES.lector] = "Lector";

            $scope.options = {
                rowHeight: 50,
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };

            $scope.showAdd = function (ev) {
                $mdDialog.show({
                    controller: 'UserController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/users/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function (newEvent) {
                    if (newEvent !== undefined)
                        $scope.users.push(newEvent);
                });
            };

            $scope.delete = function (row, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                User.delete({id: row.id}).$promise.then(function (response) {
                    if (response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.users.indexOf(row);
                        $scope.users.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function (row) {
                $scope.selectedItem = angular.copy(row);
                var index = $scope.users.indexOf(row);
                $mdDialog.show({
                    controller: 'UserController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/users/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                }).then(function (edited) {
                    if (edited != true)
                        $rootScope.addOrUpdateList($scope.users, edited, index);
                    $state.go("users", {id: ''}, {notify: false});
                });

            };
        }
    ]);
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';

    angular.module('backendApp.controllers').controller('AddVideoController', AddVideoController);
    AddVideoController.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'Video', 'Ad', 'Upload', '$sce', '$http'];
    function AddVideoController($rootScope, $scope, $mdToast, $mdDialog, Video, Ad, Upload, $sce, $http) {
        $scope.submitting = false;
        $scope.attempted = false;
        $scope.progress = 0;
        $scope.fileChanged = false;
        $scope.isLink = false;
        $scope.youtubeId = '';
        $scope.ads = Ad.query();

        if ($scope.selectedItem != undefined) {
            $scope.video = $scope.selectedItem;
            if($scope.video.ad)
                $scope.video.ad_id = $scope.video.ad.id;
            $scope.edit = true;
            if ($scope.video.type == 'youtube') {
                $scope.isLink = true;
                $scope.youtubeId = $scope.video.source;
            } else if ($scope.video.type == ' video') {

            }
        } else
            $scope.video = new Video;

        $scope.submit = function () {
            $scope.attempted = true;
            if (!$scope.form.$valid)
                return false;

            if ($scope.fileChanged && !$scope.isLink)
                uploadAndSave();
            else if ($scope.edit)
                update();
            else
                save();
        };

        $scope.hide = $mdDialog.hide;
        function save() {
            $scope.video.$save(function (response) {
                $mdDialog.hide(response);
                $scope.submitting = false;
                $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
            }, function (response) {
                $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                $scope.submitting = false;
            });
        }


        $scope.fileChange = function () {
            $scope.fileChanged = true;
            $scope.isLink = false;
        };

        $scope.linkChanged = function () {
            $scope.isLink = true;
            $http.post($rootScope.server_url + "/api/utils/youtube", {url: $scope.video.source}).success(function (response) {
                $scope.youtubeId = '';
                if (response.id !== false) {
                    $scope.youtubeId = response.id;
                    $scope.video.type = 'youtube';
                }
            });
        };

        $scope.getYt = function (videoId) {
            return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
        };
        function uploadAndSave() {
            $scope.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: $scope.video.source
            }).progress(function (evt) {
                $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                $scope.video.source = data.url;
                $scope.video.type = data.type;
                $scope.fileChanged = true;
                $scope.progress = 0;
                if ($scope.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                $scope.submitting = false;
                $scope.progress = 0;
            });

        }

        function update() {
            Video.update({id: $scope.video.id}, $scope.video).$promise.then(function (response) {
                $scope.submitting = false;
                $mdDialog.hide($scope.video);
            });
        }
    }
})();
/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('VideoListController',VideoListController);
    VideoListController.$inject= ['$rootScope','$scope', 'Video', '$mdDialog', '$mdToast','$state'];

    function VideoListController($rootScope,$scope, Video, $mdDialog, $mdToast, $state){
        $scope.videos = Video.query();
        $scope.options = {
            rowHeight: 50,
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };
        $scope.showAdd = function(ev){
            $mdDialog.show({
                controller: 'AddVideoController',
                templateUrl: 'partials/videos/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function(newEvent){
                if(newEvent!== undefined)
                    $scope.videos.push(newEvent);
            });
        };

        $scope.delete = doDelete;
        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Video.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.videos.indexOf(row);
                        $scope.videos.splice(index, 1);
                    }
                });
            });

        };

        $scope.showEdit = function(row){
            $scope.selectedItem = angular.copy(row);
            var index = $scope.videos.indexOf(row);
            $mdDialog.show({
                controller: 'AddVideoController',
                templateUrl: 'partials/videos/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function (edited) {
                if (edited != true)
                    $rootScope.addOrUpdateList($scope.videos, edited, index);
                $state.go("videos", {id: ''}, {notify: false});
            });
        };
    }

})();
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFwcC5qcyIsImFwcC5yb3V0ZXMuanMiLCJzZXJ2aWNlcy5qcyIsImNvbnRyb2xsZXJzL2FuYWx5dGljc0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9oZWFkZXJDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbG9naW5Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbWFpbkNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9tZW51Q29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2NhbmNpb25lcy9hZGRDYW5jaW9uQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2NhbmNpb25lcy9saXN0Q2FuY2lvbmVzQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2NhdGVnb3JpYXMvYWRkQ2F0ZWdvcmlhQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2NhdGVnb3JpYXMvbGlzdENhdGVnb3JpYXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvY3VlbnRvcy9hZGRDdWVudG9Db250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvY29tZW50YXJpb3MvbGlzdENvbWVudGFyaW9DdHJsLmpzIiwiY29udHJvbGxlcnMvZGlzY29zL2FkZERpc2NvQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2Rpc2Nvcy9saXN0RGlzY29zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2V2ZW50b3MvYWRkRXZlbnRvQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL2V2ZW50b3MvbGlzdEV2ZW50b3NDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvaW50ZWdyYW50ZXMvYWRkSW50ZWdyYW50ZUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9pbnRlZ3JhbnRlcy9saXN0SW50ZWdyYW50ZXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvbm90aWNpYXMvYWRkTm90aWNpYUNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy9ub3RpY2lhcy9saXN0Tm90aWNpYXNDb250cm9sbGVyLmpzIiwiY29udHJvbGxlcnMvcHJvbW9zL2FkZFByb21vQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3Byb21vcy9saXN0UHJvbW9zQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NpdGVVc2VyL2FkZFNpdGVVc2VyQ29udHJvbGxlci5qcyIsImNvbnRyb2xsZXJzL3NpdGVVc2VyL2xpc3RTaXRlVXNlckNvbnRyb2xsZXJzLmpzIiwiY29udHJvbGxlcnMvdXNlcnMvYWRkVXNlckNvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy91c2Vycy9saXN0VXNlcnNDb250cm9sbGVycy5qcyIsImNvbnRyb2xsZXJzL3ZpZGVvcy9hZGRWaWRlb0NvbnRyb2xsZXIuanMiLCJjb250cm9sbGVycy92aWRlb3MvbGlzdFZpZGVvc0NvbnRyb2xsZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsQ0FBQSxVQUFBO0lBQ0E7OztJQUdBLElBQUEsa0JBQUEsWUFBQTtRQUNBLE9BQUE7WUFDQSxVQUFBO1lBQ0EsU0FBQTtZQUNBLE1BQUEsVUFBQSxPQUFBLE1BQUEsT0FBQSxTQUFBO2dCQUNBLElBQUEsQ0FBQSxTQUFBOzs7Z0JBR0EsTUFBQSxPQUFBLE1BQUEsU0FBQSxZQUFBO29CQUNBOzs7O2dCQUlBLE1BQUEsU0FBQSxVQUFBLFVBQUEsS0FBQTtvQkFDQTs7O2dCQUdBLElBQUEsV0FBQSxZQUFBOztvQkFFQSxJQUFBLE9BQUEsUUFBQTtvQkFDQSxJQUFBLE9BQUEsTUFBQTs7b0JBRUEsUUFBQSxhQUFBLFVBQUEsQ0FBQSxRQUFBLENBQUEsUUFBQSxTQUFBOzs7OztJQUtBLElBQUEsbUJBQUEsWUFBQTtRQUNBLE9BQUEsVUFBQSxPQUFBLEtBQUE7WUFDQSxPQUFBLENBQUEsQ0FBQSxDQUFBLFNBQUEsTUFBQSxRQUFBLHVCQUFBLFVBQUEsS0FBQTtnQkFDQSxPQUFBLElBQUEsT0FBQSxHQUFBLGdCQUFBLElBQUEsT0FBQSxHQUFBO2lCQUNBOzs7SUFHQSxRQUFBLE9BQUEsY0FBQSxFQUFBLFdBQUEsV0FBQSxrQkFBQSxnQkFBQSxjQUFBLGNBQUEsYUFBQSxjQUFBLFlBQUEsMEJBQUE7U0FDQSxPQUFBO1NBQ0EsU0FBQSxjQUFBO1lBQ0EsT0FBQTtZQUNBLFFBQUE7WUFDQSxZQUFBO1lBQ0EsVUFBQTtZQUNBLFFBQUE7O1NBRUEsSUFBQTtTQUNBLE9BQUEsY0FBQTtTQUNBLFVBQUEsVUFBQTs7SUFFQSxRQUFBLE9BQUEseUJBQUE7SUFDQSxRQUFBLE9BQUEsc0JBQUE7O0lBRUEsU0FBQSxPQUFBLFFBQUEsWUFBQSxhQUFBLGFBQUE7UUFDQSxPQUFBLE9BQUEsU0FBQTtZQUNBLEtBQUE7Z0JBQ0EsV0FBQSxhQUFBO2dCQUNBO1lBQ0EsS0FBQTtZQUNBLEtBQUE7Z0JBQ0EsV0FBQSxhQUFBO2dCQUNBO1lBQ0EsS0FBQTtZQUNBLEtBQUE7Z0JBQ0EsV0FBQSxhQUFBO2dCQUNBOztRQUVBLFdBQUEsYUFBQSxXQUFBLGFBQUE7O1FBRUEsV0FBQSxTQUFBLFVBQUEsTUFBQSxTQUFBLE1BQUE7O1lBRUEsSUFBQSxTQUFBO1lBQ0EsSUFBQSxXQUFBO2dCQUNBLFNBQUE7aUJBQ0EsSUFBQSxRQUFBLEtBQUEsUUFBQTtnQkFDQSxTQUFBLEtBQUEsS0FBQSxRQUFBLFFBQUEsQ0FBQTs7WUFFQSxPQUFBOzs7UUFHQSxJQUFBLENBQUEsWUFBQTtZQUNBLE9BQUEsR0FBQTthQUNBO1lBQ0EsWUFBQSxVQUFBLEtBQUEsU0FBQSxTQUFBOzs7UUFHQSxXQUFBLElBQUEscUJBQUEsVUFBQSxPQUFBLE1BQUE7WUFDQSxJQUFBLEtBQUE7Z0JBQ0EsSUFBQSxrQkFBQSxLQUFBLEtBQUE7WUFDQSxJQUFBLG1CQUFBLENBQUEsWUFBQSxhQUFBLGtCQUFBO2dCQUNBLE1BQUE7Z0JBQ0EsV0FBQSxXQUFBOzs7OzRFQUdBOztJQUVBLFNBQUEsWUFBQSxvQkFBQTtRQUNBLElBQUEsZ0JBQUEsbUJBQUEsY0FBQSxjQUFBO1lBQ0Esd0JBQUE7WUFDQSxzQkFBQSxDQUFBO1lBQ0EsTUFBQTs7UUFFQSxtQkFBQSxjQUFBLGNBQUE7UUFDQSxtQkFBQSxNQUFBLFdBQUEsZUFBQSxjQUFBO1lBQ0EsV0FBQTtZQUNBLFNBQUE7V0FDQSxjQUFBO1FBQ0EsbUJBQUEsTUFBQSxTQUFBLFdBQUEsZUFBQTs7aURBQ0E7O0FDN0dBLENBQUEsWUFBQTtJQUNBO0lBQ0EsUUFBQSxPQUFBLGNBQUEsT0FBQTs7SUFFQSxhQUFBLFVBQUEsQ0FBQSxrQkFBQSxjQUFBLGlCQUFBO0lBQ0EsU0FBQSxhQUFBLGdCQUFBLFlBQUEsZUFBQSxVQUFBOztRQUVBLGNBQUEsYUFBQSxLQUFBOztRQUVBLGVBQUEsTUFBQSxPQUFBO1lBQ0EsS0FBQTtZQUNBLFlBQUE7WUFDQSxjQUFBO1lBQ0EsYUFBQTtZQUNBLE1BQUE7Z0JBQ0EsaUJBQUEsQ0FBQSxXQUFBLE9BQUEsV0FBQTs7V0FFQSxNQUFBLGFBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLGNBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLFdBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLGVBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLFVBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLFdBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLFlBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLFVBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUEsT0FBQSxXQUFBLFFBQUEsV0FBQTs7V0FFQSxNQUFBLFNBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1lBQ0EsTUFBQTtnQkFDQSxpQkFBQSxDQUFBLFdBQUE7O1dBRUEsTUFBQSxhQUFBO1lBQ0EsS0FBQTtZQUNBLFlBQUE7WUFDQSxjQUFBO1lBQ0EsYUFBQTtZQUNBLE1BQUE7Z0JBQ0EsaUJBQUEsQ0FBQSxXQUFBOztXQUVBLE1BQUEsZUFBQTtZQUNBLEtBQUE7WUFDQSxZQUFBO1lBQ0EsY0FBQTtZQUNBLGFBQUE7WUFDQSxNQUFBO2dCQUNBLGlCQUFBLENBQUEsV0FBQTs7V0FFQSxNQUFBLFNBQUE7WUFDQSxLQUFBO1lBQ0EsWUFBQTtZQUNBLGNBQUE7WUFDQSxhQUFBO1dBQ0EsTUFBQSxhQUFBO1lBQ0EsS0FBQTtZQUNBLFlBQUE7WUFDQSxjQUFBO1lBQ0EsYUFBQTs7Ozs7Ozs7OztBQ2xIQSxDQUFBLFVBQUE7SUFDQTs7Ozs7Ozs7Ozs7SUFXQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSxrQ0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsZ0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSx1Q0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsc0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSx5Q0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsdUJBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSwwQ0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsd0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSxzQ0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsb0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSxxQ0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsbUJBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSxzQ0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsb0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSwwQ0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsd0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSxvQ0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsa0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSx3Q0FBQSxTQUFBLFdBQUEsV0FBQTtRQUNBLE9BQUEsVUFBQSxXQUFBLFlBQUEsc0JBQUEsTUFBQSxDQUFBLFNBQUEsQ0FBQSxRQUFBOzs7SUFHQSxRQUFBLE9BQUEsdUJBQUEsUUFBQSx1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Q0EsT0FBQTtvQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsT0FBQSxDQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUEsV0FBQTs7Z0JBRUE7b0JBQ0EsT0FBQTtvQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsT0FBQSxDQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUEsV0FBQTs7Z0JBRUE7b0JBQ0EsT0FBQTtvQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsT0FBQSxDQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUEsV0FBQTs7Z0JBRUE7b0JBQ0EsT0FBQTtvQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsT0FBQSxDQUFBLFdBQUE7O2dCQUVBO29CQUNBLE9BQUE7b0JBQ0EsT0FBQTtvQkFDQSxNQUFBO29CQUNBLE9BQUEsQ0FBQSxXQUFBLE9BQUEsV0FBQTs7Z0JBRUE7b0JBQ0EsT0FBQTtvQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsT0FBQSxDQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUEsV0FBQTs7Z0JBRUE7b0JBQ0EsT0FBQTtvQkFDQSxPQUFBO29CQUNBLE1BQUE7b0JBQ0EsT0FBQSxDQUFBLFdBQUEsTUFBQSxXQUFBLFFBQUEsV0FBQTtrQkFDQTtvQkFDQSxPQUFBO29CQUNBLE9BQUE7b0JBQ0EsTUFBQTtvQkFDQSxPQUFBLENBQUEsV0FBQTtrQkFDQTtvQkFDQSxPQUFBO29CQUNBLE9BQUE7b0JBQ0EsTUFBQTtvQkFDQSxPQUFBLENBQUEsV0FBQTs7Ozs7Ozs7Ozs7O0FDaEZBLENBQUEsV0FBQTtJQUNBO0lBQ0EsUUFBQSxPQUFBLDBCQUFBLFdBQUEsd0JBQUE7O0lBRUEscUJBQUEsVUFBQSxDQUFBLFNBQUEsYUFBQSxZQUFBLGFBQUEsV0FBQSxTQUFBOztJQUVBLFNBQUEscUJBQUEsUUFBQSxXQUFBLFVBQUEsV0FBQSxTQUFBLE9BQUEsT0FBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsT0FBQTtRQUNBLEdBQUEsU0FBQSxNQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxhQUFBO1FBQ0EsR0FBQSxjQUFBO1FBQ0EsR0FBQSxZQUFBOztRQUVBLEdBQUEsU0FBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsT0FBQSxVQUFBOztRQUVBLEdBQUEsT0FBQSxnQkFBQSxXQUFBO1lBQ0EsR0FBQSxVQUFBLE9BQUE7WUFDQSxHQUFBLEdBQUEsUUFBQTtnQkFDQSxHQUFBLFFBQUEsV0FBQSxHQUFBLFFBQUEsTUFBQTtZQUNBLEdBQUEsT0FBQTs7WUFFQSxHQUFBLFVBQUEsSUFBQTs7O1FBR0EsU0FBQSxRQUFBO1lBQ0EsR0FBQSxZQUFBOztZQUVBLEdBQUEsQ0FBQSxPQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7Z0JBRUEsUUFBQSxJQUFBOztZQUVBLEdBQUEsYUFBQTs7WUFFQSxRQUFBLElBQUEsR0FBQTtZQUNBLEdBQUEsR0FBQTtnQkFDQTtpQkFDQSxHQUFBLEdBQUE7Z0JBQ0E7O2dCQUVBO1NBQ0E7OztRQUdBLFNBQUEsWUFBQTtZQUNBLEdBQUEsY0FBQTtTQUNBOztRQUVBLFNBQUEsZ0JBQUE7WUFDQSxRQUFBLElBQUE7WUFDQSxPQUFBLE9BQUE7Z0JBQ0EsS0FBQSxXQUFBO2dCQUNBLE1BQUEsR0FBQSxRQUFBO2VBQ0EsU0FBQSxVQUFBLEtBQUE7Z0JBQ0EsR0FBQSxXQUFBLFNBQUEsUUFBQSxJQUFBLFNBQUEsSUFBQTtlQUNBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsUUFBQSxlQUFBLEtBQUE7Z0JBQ0EsR0FBQSxjQUFBO2dCQUNBLEdBQUEsU0FBQTtnQkFDQSxHQUFBLEdBQUE7b0JBQ0E7O29CQUVBO2VBQ0EsTUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7Z0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLEtBQUEsT0FBQSxNQUFBO2dCQUNBLEdBQUEsYUFBQTtnQkFDQSxHQUFBLFdBQUE7Ozs7UUFJQSxTQUFBLE9BQUE7WUFDQSxRQUFBLEtBQUEsR0FBQSxTQUFBLFNBQUEsS0FBQSxVQUFBLFVBQUEsTUFBQSxPQUFBO2dCQUNBLFFBQUEsSUFBQTtnQkFDQSxRQUFBLElBQUE7Z0JBQ0EsSUFBQSxTQUFBLE9BQUE7b0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFNBQUEsT0FBQSxNQUFBO3VCQUNBO29CQUNBLFVBQUEsS0FBQTtvQkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7O2dCQUVBLEdBQUEsYUFBQTs7OztRQUlBLFNBQUEsU0FBQTtZQUNBLFFBQUEsT0FBQSxDQUFBLElBQUEsR0FBQSxRQUFBLEtBQUEsR0FBQSxTQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxhQUFBO2dCQUNBLFVBQUEsS0FBQSxHQUFBOzs7Ozs7OztBQzNGQSxDQUFBLFdBQUE7SUFDQTtJQUNBLFFBQUEsT0FBQSwwQkFBQSxXQUFBLHdCQUFBOztJQUVBLHNCQUFBLFVBQUEsQ0FBQSxhQUFBLFVBQUEsV0FBQSxZQUFBLFlBQUEsZ0JBQUE7SUFDQSxTQUFBLHNCQUFBLFlBQUEsUUFBQSxTQUFBLFdBQUEsVUFBQSxjQUFBLE9BQUE7UUFDQSxJQUFBLEtBQUE7UUFDQSxHQUFBLFlBQUEsUUFBQTtRQUNBLEdBQUEsVUFBQTtZQUNBLFdBQUE7WUFDQSxjQUFBO1lBQ0EsY0FBQTtZQUNBLFlBQUE7WUFDQSxZQUFBO1lBQ0EsWUFBQTs7O1FBR0EsR0FBQSxVQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxXQUFBO1FBQ0EsR0FBQSxPQUFBLFVBQUE7O1FBRUE7OztRQUdBLFNBQUEsVUFBQTtZQUNBLEdBQUEsYUFBQSxHQUFBO2dCQUNBLFFBQUEsSUFBQSxDQUFBLEdBQUEsYUFBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7b0JBQ0EsU0FBQTs7O1NBR0E7O1FBRUEsU0FBQSxRQUFBLEdBQUE7WUFDQSxVQUFBLEtBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQTtnQkFDQSxhQUFBO2VBQ0EsS0FBQSxTQUFBLFNBQUE7Z0JBQ0EsR0FBQSxXQUFBO29CQUNBLFdBQUEsZ0JBQUEsR0FBQSxXQUFBOztTQUVBOzs7UUFHQSxTQUFBLFNBQUEsS0FBQSxRQUFBO1lBQ0EsT0FBQTtZQUNBLE9BQUE7WUFDQSxJQUFBLFVBQUEsVUFBQTtpQkFDQSxRQUFBO2lCQUNBLEdBQUE7aUJBQ0EsT0FBQTtpQkFDQSxZQUFBOztZQUVBLFVBQUEsS0FBQSxTQUFBLEtBQUEsVUFBQTtnQkFDQSxRQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsVUFBQSxVQUFBO29CQUNBLElBQUEsU0FBQTt3QkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7eUJBQ0E7d0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFNBQUE7d0JBQ0EsSUFBQSxRQUFBLEdBQUEsVUFBQSxRQUFBO3dCQUNBLEdBQUEsVUFBQSxPQUFBLE9BQUE7Ozs7O1NBS0E7O1FBRUEsU0FBQSxlQUFBLElBQUE7WUFDQSxPQUFBLEdBQUEsWUFBQSxDQUFBLEdBQUEsSUFBQSxLQUFBLENBQUEsT0FBQTtZQUNBLFNBQUE7U0FDQTs7UUFFQSxTQUFBLFNBQUEsSUFBQTtZQUNBLE9BQUEsZUFBQSxRQUFBLEtBQUE7WUFDQSxJQUFBLFFBQUEsR0FBQSxVQUFBLFFBQUE7WUFDQSxVQUFBLEtBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxjQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQTtnQkFDQSxPQUFBLE9BQUE7ZUFDQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxHQUFBLFNBQUE7b0JBQ0EsV0FBQSxnQkFBQSxHQUFBLFdBQUEsUUFBQTtnQkFDQSxPQUFBLEdBQUEsWUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLE9BQUE7O1NBRUE7Ozs7Ozs7O0FDekZBLENBQUEsV0FBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSwwQkFBQSxXQUFBLHlCQUFBO0lBQ0EsdUJBQUEsVUFBQSxDQUFBLFNBQUEsWUFBQSxhQUFBO0lBQ0EsU0FBQSx1QkFBQSxRQUFBLFVBQUEsV0FBQSxXQUFBO1FBQ0EsSUFBQSxLQUFBOztRQUVBLEdBQUEsWUFBQTtRQUNBLEdBQUEsT0FBQTs7UUFFQSxHQUFBLE9BQUEsVUFBQTtRQUNBLEdBQUEsYUFBQTtRQUNBLEdBQUEsWUFBQTtRQUNBLEdBQUEsU0FBQTs7UUFFQTs7OztRQUlBLFNBQUEsVUFBQTtZQUNBLElBQUEsT0FBQSxnQkFBQSxXQUFBO2dCQUNBLEdBQUEsWUFBQSxPQUFBO2dCQUNBLEdBQUEsT0FBQTs7Z0JBRUEsR0FBQSxZQUFBLElBQUE7OztRQUdBLFNBQUEsU0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLElBQUEsQ0FBQSxPQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxJQUFBLEdBQUE7Z0JBQ0E7O2dCQUVBOzs7UUFHQSxTQUFBLE9BQUE7WUFDQSxVQUFBLEtBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQSxVQUFBLFVBQUE7Z0JBQ0EsSUFBQSxTQUFBLE9BQUE7b0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFNBQUEsT0FBQSxNQUFBO3VCQUNBO29CQUNBLFVBQUEsS0FBQTtvQkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7O2dCQUVBLEdBQUEsYUFBQTs7OztRQUlBLFNBQUEsU0FBQTtZQUNBLFVBQUEsT0FBQSxDQUFBLElBQUEsR0FBQSxVQUFBLEtBQUEsR0FBQSxXQUFBLFNBQUEsS0FBQSxVQUFBLFVBQUE7Z0JBQ0EsR0FBQSxhQUFBO2dCQUNBLFVBQUEsS0FBQSxHQUFBOzs7Ozs7OztBQ3REQSxDQUFBLFdBQUE7SUFDQTtJQUNBLFFBQUEsT0FBQSwwQkFBQSxXQUFBLDJCQUFBO0lBQ0Esd0JBQUEsVUFBQSxDQUFBLGFBQUEsYUFBQSxTQUFBLGFBQUEsWUFBQSxVQUFBOztJQUVBLFNBQUEsd0JBQUEsVUFBQSxZQUFBLFFBQUEsV0FBQSxVQUFBLFFBQUEsYUFBQTtRQUNBLElBQUEsS0FBQTtRQUNBLEdBQUEsYUFBQSxVQUFBO1FBQ0EsR0FBQSxVQUFBO1lBQ0EsV0FBQTtZQUNBLGNBQUE7WUFDQSxjQUFBO1lBQ0EsWUFBQTtZQUNBLFlBQUE7WUFDQSxZQUFBOztRQUVBLEdBQUEsVUFBQTtRQUNBLEdBQUEsU0FBQTtRQUNBLEdBQUEsV0FBQTs7UUFFQTs7O1FBR0EsU0FBQSxVQUFBO1lBQ0EsR0FBQSxhQUFBLEdBQUE7Z0JBQ0EsVUFBQSxJQUFBLENBQUEsR0FBQSxhQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsU0FBQTtvQkFDQSxTQUFBOzs7U0FHQTs7UUFFQSxTQUFBLGVBQUEsSUFBQTtZQUNBLE9BQUEsR0FBQSxhQUFBLENBQUEsR0FBQSxJQUFBLEtBQUEsQ0FBQSxPQUFBO1lBQ0EsU0FBQTtTQUNBOztRQUVBLFNBQUEsUUFBQSxJQUFBO1lBQ0EsVUFBQSxLQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxhQUFBO2dCQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUE7Z0JBQ0EsYUFBQTtlQUNBLEtBQUEsVUFBQSxVQUFBO2dCQUNBLElBQUEsYUFBQTtvQkFDQSxHQUFBLFdBQUEsS0FBQTs7Ozs7UUFLQSxTQUFBLFNBQUEsS0FBQSxRQUFBO1lBQ0EsT0FBQTtZQUNBLE9BQUE7WUFDQSxJQUFBLFVBQUEsVUFBQTtpQkFDQSxRQUFBO2lCQUNBLEdBQUE7aUJBQ0EsT0FBQTtpQkFDQSxZQUFBOztZQUVBLFVBQUEsS0FBQSxTQUFBLEtBQUEsVUFBQTtnQkFDQSxVQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsVUFBQSxVQUFBO29CQUNBLElBQUEsU0FBQTt3QkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7eUJBQ0E7d0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFNBQUE7d0JBQ0EsSUFBQSxRQUFBLEdBQUEsV0FBQSxRQUFBO3dCQUNBLEdBQUEsV0FBQSxPQUFBLE9BQUE7Ozs7U0FJQTs7O1FBR0EsU0FBQSxTQUFBLEtBQUE7WUFDQSxPQUFBLGVBQUE7WUFDQSxJQUFBLFFBQUEsR0FBQSxXQUFBLFFBQUE7WUFDQSxVQUFBLEtBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxhQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQTtnQkFDQSxPQUFBLE9BQUE7ZUFDQSxLQUFBLFNBQUEsT0FBQTtnQkFDQSxRQUFBLElBQUEsUUFBQTtnQkFDQSxHQUFBLFNBQUE7b0JBQ0EsV0FBQSxnQkFBQSxHQUFBLFlBQUEsUUFBQTtnQkFDQSxPQUFBLEdBQUEsYUFBQSxDQUFBLEdBQUEsS0FBQSxDQUFBLE9BQUE7Ozs7Ozs7O0FDdEZBLENBQUEsV0FBQTtJQUNBO0lBQ0EsUUFBQSxPQUFBLDBCQUFBLFdBQUEsbUJBQUEsQ0FBQSxVQUFBLFVBQUEsWUFBQTtRQUNBLFNBQUEsUUFBQSxRQUFBLFdBQUEsU0FBQTtZQUNBLElBQUE7O1lBRUEsT0FBQSxRQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7Z0JBQ0EsT0FBQSxVQUFBLE9BQUE7Z0JBQ0EsUUFBQSxJQUFBLE9BQUE7O1lBRUEsT0FBQSxPQUFBLFVBQUE7O1lBRUEsT0FBQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxjQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBOzs7WUFHQSxPQUFBLFVBQUE7Z0JBQ0EsV0FBQTtnQkFDQSxZQUFBO2dCQUNBLFlBQUE7OztZQUdBLE9BQUEsU0FBQSxTQUFBLFFBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLEdBQUEsQ0FBQSxLQUFBO2dCQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxDQUFBLE9BQUEsUUFBQSxjQUFBLENBQUEsT0FBQSxRQUFBO29CQUNBLE9BQUEsVUFBQTs7b0JBRUEsT0FBQSxVQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUE7d0JBQ0EsSUFBQSxXQUFBLEVBQUE7O3dCQUVBLE9BQUE7NEJBQ0EsS0FBQTtnQ0FDQSxJQUFBLFVBQUEsT0FBQSxRQUFBO2dDQUNBOzRCQUNBLEtBQUE7Z0NBQ0EsSUFBQSxVQUFBLE9BQUEsUUFBQTtnQ0FDQTs0QkFDQSxLQUFBLENBQUE7Z0NBQ0EsSUFBQSxVQUFBLE9BQUEsUUFBQTtnQ0FDQTs7d0JBRUEsT0FBQTs7Z0JBRUEsUUFBQSxJQUFBLE9BQUE7OztZQUdBLE9BQUEsT0FBQSxXQUFBLE9BQUEsU0FBQTtZQUNBLE9BQUEsU0FBQTtZQUNBLFNBQUEsU0FBQSxLQUFBLFFBQUE7Z0JBQ0EsT0FBQTtnQkFDQSxPQUFBO2dCQUNBLElBQUEsVUFBQSxVQUFBO3FCQUNBLFFBQUE7cUJBQ0EsR0FBQTtxQkFDQSxPQUFBO3FCQUNBLFlBQUE7O2dCQUVBLFVBQUEsS0FBQSxTQUFBLEtBQUEsVUFBQTtvQkFDQSxPQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsVUFBQSxVQUFBO3dCQUNBLElBQUEsU0FBQTs0QkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7NkJBQ0E7NEJBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFNBQUE7NEJBQ0EsSUFBQSxRQUFBLE9BQUEsUUFBQSxRQUFBOzRCQUNBLE9BQUEsUUFBQSxPQUFBLE9BQUE7Ozs7YUFJQTs7WUFFQSxPQUFBLFVBQUEsU0FBQSxLQUFBLFlBQUEsT0FBQTtnQkFDQSxPQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsVUFBQTtnQkFDQSxRQUFBLElBQUEsV0FBQTtnQkFDQSxJQUFBLFdBQUEsYUFBQSxJQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsT0FBQSxhQUFBO2dCQUNBLE9BQUEsT0FBQSxDQUFBLElBQUEsSUFBQSxLQUFBLEtBQUEsU0FBQSxLQUFBLFNBQUEsU0FBQTtvQkFDQSxPQUFBLGFBQUE7b0JBQ0EsVUFBQSxLQUFBOzs7Ozs7WUFNQSxPQUFBLFdBQUEsU0FBQSxJQUFBO2dCQUNBLE9BQUEsZUFBQTtnQkFDQSxVQUFBLEtBQUE7b0JBQ0EsYUFBQTtvQkFDQSxRQUFBLFFBQUEsUUFBQSxTQUFBO29CQUNBLE9BQUEsT0FBQTtvQkFDQSxZQUFBOzs7O1lBSUEsU0FBQSxxQkFBQSxRQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBO2dCQUNBLE9BQUEsU0FBQSxPQUFBOzs7Ozs7Ozs7QUN4R0EsQ0FBQSxXQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsMEJBQUEsV0FBQSx1QkFBQSxDQUFBLFVBQUEsY0FBQSxZQUFBO1FBQ0EsU0FBQSxRQUFBLFlBQUEsV0FBQSxTQUFBO1lBQ0EsSUFBQTs7WUFFQSxXQUFBLFFBQUEsU0FBQSxLQUFBLFNBQUEsU0FBQSxDQUFBLE9BQUEsY0FBQSxPQUFBLFNBQUEsT0FBQTtZQUNBLE9BQUEsT0FBQSxVQUFBOztZQUVBLE9BQUEsVUFBQTtnQkFDQSxXQUFBO2dCQUNBLGNBQUE7Z0JBQ0EsY0FBQTtnQkFDQSxZQUFBO2dCQUNBLFlBQUE7Z0JBQ0EsWUFBQTs7O1lBR0EsT0FBQSxVQUFBO2dCQUNBLFdBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxZQUFBOzs7WUFHQSxPQUFBLFNBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsQ0FBQSxLQUFBO2dCQUNBLEdBQUEsQ0FBQSxPQUFBLFFBQUEsWUFBQSxDQUFBLE9BQUEsUUFBQSxjQUFBLENBQUEsT0FBQSxRQUFBO29CQUNBLE9BQUEsY0FBQTs7b0JBRUEsT0FBQSxjQUFBLEtBQUEsT0FBQSxTQUFBLEdBQUE7d0JBQ0EsSUFBQSxXQUFBLEVBQUE7d0JBQ0EsSUFBQSxVQUFBO3dCQUNBLE9BQUE7NEJBQ0EsS0FBQTtnQ0FDQSxVQUFBLE9BQUEsUUFBQTtnQ0FDQTs0QkFDQSxLQUFBO2dDQUNBLFVBQUEsT0FBQSxRQUFBO2dDQUNBOzRCQUNBLEtBQUEsQ0FBQTtnQ0FDQSxVQUFBLE9BQUEsUUFBQTtnQ0FDQTs7d0JBRUEsT0FBQTs7Ozs7WUFLQSxPQUFBLE9BQUEsV0FBQSxPQUFBLFNBQUE7O1lBRUEsT0FBQSxTQUFBLFNBQUEsS0FBQSxPQUFBO2dCQUNBLE9BQUE7Z0JBQ0EsT0FBQTtnQkFDQSxXQUFBLE9BQUEsQ0FBQSxHQUFBLElBQUEsS0FBQSxTQUFBLEtBQUEsU0FBQSxTQUFBO29CQUNBLEdBQUEsU0FBQTt3QkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsU0FBQSxPQUFBLE1BQUE7eUJBQ0E7d0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFNBQUE7d0JBQ0EsSUFBQSxRQUFBLE9BQUEsWUFBQSxRQUFBO3dCQUNBLE9BQUEsWUFBQSxPQUFBLE9BQUE7d0JBQ0EsS0FBQSxPQUFBLE9BQUE7Ozs7O1lBS0EsT0FBQSxVQUFBLFNBQUEsS0FBQSxZQUFBLE9BQUE7Z0JBQ0EsT0FBQTtnQkFDQSxPQUFBO2dCQUNBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBLFdBQUE7Z0JBQ0EsSUFBQSxXQUFBLGFBQUEsSUFBQTtnQkFDQSxPQUFBO2dCQUNBLE9BQUEsYUFBQTtnQkFDQSxXQUFBLE9BQUEsQ0FBQSxJQUFBLElBQUEsS0FBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7b0JBQ0EsT0FBQSxhQUFBO29CQUNBLFVBQUEsS0FBQTs7Ozs7O1lBTUEsT0FBQSxXQUFBLFNBQUEsSUFBQTtnQkFDQSxPQUFBLGVBQUE7Z0JBQ0EsVUFBQSxLQUFBO29CQUNBLGFBQUE7b0JBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQTtvQkFDQSxPQUFBLE9BQUE7b0JBQ0EsWUFBQTs7OztZQUlBLFNBQUEseUJBQUEsUUFBQSxVQUFBO2dCQUNBLE9BQUEsYUFBQSxPQUFBO2dCQUNBLFFBQUEsSUFBQSxRQUFBLE9BQUE7Ozs7Ozs7OztBQzdGQSxDQUFBLFlBQUE7SUFDQTtJQUNBLFFBQUEsT0FBQSwwQkFBQSxXQUFBLHNCQUFBO0lBQ0EsbUJBQUEsVUFBQSxDQUFBLGNBQUEsVUFBQSxZQUFBLGFBQUEsU0FBQTs7SUFFQSxTQUFBLG1CQUFBLFlBQUEsUUFBQSxVQUFBLFdBQUEsT0FBQSxRQUFBO1FBQ0EsSUFBQSxLQUFBO1FBQ0EsR0FBQSxPQUFBLFVBQUE7UUFDQSxHQUFBLE9BQUE7UUFDQSxHQUFBLFFBQUE7UUFDQSxHQUFBLGFBQUE7UUFDQSxHQUFBLFlBQUE7UUFDQSxHQUFBLFdBQUE7UUFDQSxHQUFBLGNBQUE7O1FBRUEsR0FBQSxhQUFBLFlBQUE7WUFDQSxHQUFBLGNBQUE7O1FBRUEsR0FBQSxTQUFBOztRQUVBOztRQUVBLFNBQUEsV0FBQTtZQUNBLElBQUEsT0FBQSxnQkFBQSxXQUFBO2dCQUNBLEdBQUEsUUFBQSxPQUFBO2dCQUNBLEdBQUEsT0FBQTs7Z0JBRUEsR0FBQSxRQUFBLElBQUE7OztRQUdBLFNBQUEsU0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLElBQUEsQ0FBQSxPQUFBLEtBQUE7Z0JBQ0EsT0FBQTs7WUFFQSxHQUFBLFdBQUE7WUFDQSxRQUFBLElBQUEsZUFBQSxHQUFBO1lBQ0EsSUFBQSxHQUFBO2dCQUNBO2lCQUNBLElBQUEsR0FBQTtnQkFDQTs7Z0JBRUE7OztRQUdBLFNBQUEsT0FBQTtZQUNBLEdBQUEsTUFBQSxNQUFBLFVBQUEsVUFBQTtnQkFDQSxVQUFBLEtBQUEsR0FBQTtnQkFDQSxHQUFBLGFBQUE7Z0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBO2VBQ0EsVUFBQSxVQUFBO2dCQUNBLFNBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQSxTQUFBLEtBQUEsT0FBQSxNQUFBO2dCQUNBLEdBQUEsYUFBQTs7OztRQUlBLFNBQUEsZ0JBQUE7WUFDQSxHQUFBLGFBQUE7WUFDQSxPQUFBLE9BQUE7Z0JBQ0EsS0FBQSxXQUFBO2dCQUNBLE1BQUEsR0FBQSxNQUFBO2VBQ0EsU0FBQSxVQUFBLEtBQUE7Z0JBQ0EsR0FBQSxXQUFBLFNBQUEsUUFBQSxJQUFBLFNBQUEsSUFBQTtlQUNBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBO2dCQUNBLEdBQUEsTUFBQSxZQUFBLEtBQUE7Z0JBQ0EsR0FBQSxjQUFBO2dCQUNBLEdBQUEsV0FBQTtnQkFDQSxJQUFBLEdBQUE7b0JBQ0E7O29CQUVBO2VBQ0EsTUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7Z0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLEtBQUEsT0FBQSxNQUFBO2dCQUNBLEdBQUEsYUFBQTtnQkFDQSxHQUFBLFdBQUE7Ozs7UUFJQSxTQUFBLFNBQUE7WUFDQSxNQUFBLE9BQUEsQ0FBQSxJQUFBLEdBQUEsTUFBQSxLQUFBLEdBQUEsT0FBQSxTQUFBLEtBQUEsVUFBQSxVQUFBO2dCQUNBLEdBQUEsYUFBQTtnQkFDQSxVQUFBLEtBQUEsR0FB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T0FBQSxXQUFBO2dCQUNBLFVBQUE7OztZQUdBLE9BQUEsYUFBQTtZQUNBLE9BQUEsWUFBQTs7WUFFQSxPQUFBLFNBQUEsVUFBQTtnQkFDQSxPQUFBLFlBQUE7Z0JBQ0EsR0FBQSxDQUFBLE9BQUEsS0FBQTtvQkFDQSxPQUFBOztnQkFFQSxHQUFBLE9BQUE7b0JBQ0E7cUJBQ0EsR0FBQSxPQUFBO29CQUNBOztvQkFFQTs7O1lBR0EsU0FBQSxPQUFBO2dCQUNBLE9BQUEsT0FBQSxNQUFBLFVBQUEsVUFBQTtvQkFDQSxVQUFBLEtBQUEsT0FBQTtvQkFDQSxPQUFBLGFBQUE7b0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBO21CQUNBLFVBQUEsVUFBQTtvQkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsU0FBQSxLQUFBLE9BQUEsTUFBQTtvQkFDQSxPQUFBLGFBQUE7OztZQUdBLE9BQUEsV0FBQTtZQUNBLE9BQUEsY0FBQTtZQUNBLE9BQUEsYUFBQSxVQUFBO2dCQUNBLE9BQUEsY0FBQTs7WUFFQSxTQUFBLGdCQUFBO2dCQUNBLE9BQUEsYUFBQTtnQkFDQSxPQUFBLE9BQUE7b0JBQ0EsS0FBQSxXQUFBO29CQUNBLE1BQUEsT0FBQSxPQUFBO21CQUNBLFNBQUEsVUFBQSxLQUFBO29CQUNBLE9BQUEsV0FBQSxTQUFBLFFBQUEsSUFBQSxTQUFBLElBQUE7bUJBQ0EsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7b0JBQ0EsT0FBQSxPQUFBLFNBQUEsS0FBQTtvQkFDQSxPQUFBLGNBQUE7b0JBQ0EsT0FBQSxXQUFBO29CQUNBLEdBQUEsT0FBQTt3QkFDQTs7d0JBRUE7bUJBQ0EsTUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7b0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLEtBQUEsT0FBQSxNQUFBO29CQUNBLE9BQUEsYUFBQTtvQkFDQSxPQUFBLFdBQUE7Ozs7WUFJQSxTQUFBLFNBQUE7Z0JBQ0EsT0FBQSxPQUFBLENBQUEsSUFBQSxPQUFBLE9BQUEsS0FBQSxPQUFBLFFBQUEs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T0FBQSxHQUFBLGNBQUEsQ0FBQSxHQUFBLEtBQUEsQ0FBQSxPQUFBOztTQUVBOzs7Ozs7QUN4RkEsQ0FBQSxXQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsMEJBQUEsV0FBQSx1QkFBQSxDQUFBLGFBQUEsU0FBQSxZQUFBLGFBQUEsVUFBQSxZQUFBLFFBQUEsVUFBQSxNQUFBLFNBQUE7UUFDQSxTQUFBLFdBQUEsT0FBQSxVQUFBLFdBQUEsU0FBQSxXQUFBLE9BQUEsU0FBQSxJQUFBLFFBQUEsSUFBQTtZQUNBLEdBQUEsT0FBQSxlQUFBLFdBQUE7Z0JBQ0EsT0FBQSxVQUFBLE9BQUE7Z0JBQ0EsT0FBQSxRQUFBLFFBQUEsSUFBQSxLQUFBLE9BQUEsUUFBQTtnQkFDQSxPQUFBLFFBQUEsZUFBQSxPQUFBLFFBQUEsV0FBQSxHQUFBO2dCQUNBLE9BQUEsUUFBQSxXQUFBLE9BQUEsUUFBQSxNQUFBO2dCQUNBLE9BQUEsUUFBQSxhQUFBLE9BQUEsUUFBQSxRQUFBO2dCQUNBLE9BQUEsT0FBQTtnQkFDQSxHQUFBLENBQUEsT0FBQSxRQUFBLFdBQUE7b0JBQ0EsT0FBQSxRQUFBLFdBQUEsS0FBQSxDQUFBLE1BQUE7Z0JBQ0EsR0FBQSxDQUFBLE9BQUEsUUFBQSxXQUFBO29CQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsQ0FBQSxNQUFBO2tCQUNBO2dCQUNBLE9BQUEsVUFBQSxJQUFBO2dCQUNBLE9BQUEsUUFBQSxPQUFBO2dCQUNBLE9BQUEsUUFBQSxhQUFBO2dCQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsQ0FBQSxNQUFBO2dCQUNBLE9BQUEsUUFBQSxXQUFBLEtBQUEsQ0FBQSxNQUFBOzs7OztZQUtBLFFBQUEsSUFBQSxPQUFBOztZQUVBLE9BQUEsYUFBQSxVQUFBO1lBQ0EsT0FBQSxTQUFBLE1BQUE7WUFDQSxPQUFBLFlBQUEsUUFBQTtZQUNBLE9BQUEsTUFBQSxHQUFBO1lBQ0EsT0FBQSxPQUFBLElBQUE7O1lBRUEsT0FBQSxhQUFBLElBQUEsTUFBQTs7WUFFQSxPQUFBLE9BQUEsV0FBQTtnQkFDQSxVQUFBOzs7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QSxJQUFBLENBQUEsT0FBQSxPQUFBO2dCQUNBLE9BQUE7O1lBRUEsR0FBQSxhQUFBOztZQUVBLElBQUEsR0FBQTtnQkFDQTtpQkFDQSxJQUFBLEdBQUE7Z0JBQ0E7O2dCQUVBOzs7UUFHQSxHQUFBLGFBQUEsWUFBQTtZQUNBLEdBQUEsY0FBQTs7O1FBR0EsU0FBQSxPQUFBO1lBQ0EsR0FBQSxHQUFBLE1BQUEsVUFBQSxVQUFBO2dCQUNBLFVBQUEsS0FBQSxHQUFBO2dCQUNBLEdBQUEsYUFBQTtnQkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7ZUFDQSxVQUFBLFVBQUE7Z0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLFNBQUEsS0FBQSxPQUFBLE1BQUE7Z0JBQ0EsR0FBQSxhQUFBOzs7OztRQUtBLFNBQUEsU0FBQTtZQUNBLEdBQUEsT0FBQSxDQUFBLElBQUEsR0FBQSxHQUFBLEtBQUEsR0FBQSxJQUFBLFNBQUEsS0FBQSxVQUFBLFVBQUE7Z0JBQ0EsUUFBQSxJQUFBLFlBQUE7Z0JBQ0EsR0FBQSxhQUFBO2dCQUNBLFVBQUEsS0FBQSxHQUFBOzs7Ozs7O1FBT0EsU0FBQSxnQkFBQTtZQUNBLEdBQUEsYUFBQTtZQUNBLE9BQUEsT0FBQTtnQkFDQSxLQUFBLFdBQUE7Z0JBQ0EsTUFBQSxHQUFBLEdBQUE7ZUFDQSxTQUFBLFVBQUEsS0FBQTtnQkFDQSxHQUFBLFdBQUEsU0FBQSxRQUFBLElBQUEsU0FBQSxJQUFBO2VBQ0EsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxHQUFBLFNBQUEsS0FBQTtnQkFDQSxHQUFBLEdBQUEsT0FBQSxLQUFBO2dCQUNBLEdBQUEsY0FBQTtnQkFDQSxHQUFBLFdBQUE7Z0JBQ0EsSUFBQSxHQUFBO29CQUNBOztvQkFFQTtlQUNBLE1BQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBO2dCQUNBLFNBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQSxLQUFBLE9BQUEsTUFBQTtnQkFDQSxHQUFBLGFBQUE7Z0JBQ0EsR0FBQSxXQUFBOzs7Ozs7Ozs7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QSxHQUFBLE1BQUEsV0FBQSxZQUFBO1FBQ0EsR0FBQSxNQUFBLFdBQUEsVUFBQTtRQUNBLEdBQUEsTUFBQSxXQUFBLFFBQUE7OztRQUdBLEdBQUEsT0FBQSxVQUFBO1FBQ0EsR0FBQSxTQUFBO1FBQ0EsR0FBQSxhQUFBOzs7UUFHQSxTQUFBLGFBQUE7WUFDQSxRQUFBLElBQUE7WUFDQSxHQUFBLGNBQUE7OztRQUdBLFNBQUEsU0FBQTtZQUNBLEdBQUEsWUFBQTtZQUNBLElBQUEsQ0FBQSxPQUFBLEtBQUE7Z0JBQ0EsT0FBQTtZQUNBLEdBQUEsYUFBQTtZQUNBLElBQUEsR0FBQTtnQkFDQTtpQkFDQSxJQUFBLEdBQUE7Z0JBQ0E7O2dCQUVBOzs7O1FBSUEsU0FBQSxPQUFBO1lBQ0EsU0FBQSxLQUFBLEdBQUEsS0FBQSxVQUFBLE1BQUE7Z0JBQ0EsSUFBQSxLQUFBLE9BQUE7b0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBLEtBQUEsT0FBQSxNQUFBO29CQUNBLEdBQUEsYUFBQTt1QkFDQTtvQkFDQSxVQUFBLEtBQUEsR0FBQTtvQkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUE7Ozs7Ozs7O1FBUUEsU0FBQSxnQkFBQTtZQUNBLEdBQUEsYUFBQTtZQUNBLE9BQUEsT0FBQTtnQkFDQSxLQUFBLFdBQUE7Z0JBQ0EsTUFBQSxHQUFBLEtBQUE7ZUFDQSxTQUFBLFVBQUEsS0FBQTtnQkFDQSxHQUFBLFdBQUEsU0FBQSxRQUFBLElBQUEsU0FBQSxJQUFBO2VBQ0EsUUFBQSxVQUFBLE1BQUEsUUFBQSxTQUFBLFFBQUE7Z0JBQ0EsR0FBQSxLQUFBLFNBQUEsS0FBQTtnQkFDQSxHQUFBLGNBQUE7Z0JBQ0EsR0FBQSxXQUFBO2dCQUNBLEdBQUEsR0FBQTtvQkFDQTs7b0JBRUE7ZUFDQSxNQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQTtnQkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsS0FBQSxPQUFBLE1BQUE7Z0JBQ0EsR0FBQSxhQUFBO2dCQUNBLEdBQUEsV0FBQTs7OztRQUlBLFNBQUEsU0FB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bUJBQ0EsS0FBQSxVQUFBLFFBQUE7b0JBQ0EsSUFBQSxVQUFBO3dCQUNBLFdBQUEsZ0JBQUEsT0FBQSxPQUFBLFFBQUE7b0JBQ0EsT0FBQSxHQUFBLFNBQUEsQ0FBQSxJQUFBLEtBQUEsQ0FBQSxRQUFBOzs7Ozs7Ozs7O0FDN0RBLENBQUEsWUFBQTtJQUNBOztJQUVBLFFBQUEsT0FBQSwwQkFBQSxXQUFBLHNCQUFBO0lBQ0EsbUJBQUEsVUFBQSxDQUFBLGNBQUEsVUFBQSxZQUFBLGFBQUEsU0FBQSxNQUFBLFVBQUEsUUFBQTtJQUNBLFNBQUEsbUJBQUEsWUFBQSxRQUFBLFVBQUEsV0FBQSxPQUFBLElBQUEsUUFBQSxNQUFBLE9BQUE7UUFDQSxPQUFBLGFBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLFdBQUE7UUFDQSxPQUFBLGNBQUE7UUFDQSxPQUFBLFNBQUE7UUFDQSxPQUFBLFlBQUE7UUFDQSxPQUFBLE1BQUEsR0FBQTs7UUFFQSxJQUFBLE9BQUEsZ0JBQUEsV0FBQTtZQUNBLE9BQUEsUUFBQSxPQUFBO1lBQ0EsR0FBQSxPQUFBLE1BQUE7Z0JBQ0EsT0FBQSxNQUFBLFFBQUEsT0FBQSxNQUFBLEdBQUE7WUFDQSxPQUFBLE9BQUE7WUFDQSxJQUFBLE9BQUEsTUFBQSxRQUFBLFdBQUE7Z0JBQ0EsT0FBQSxTQUFBO2dCQUNBLE9BQUEsWUFBQSxPQUFBLE1BQUE7bUJBQ0EsSUFBQSxPQUFBLE1BQUEsUUFBQSxVQUFBOzs7O1lBSUEsT0FBQSxRQUFBLElBQUE7O1FBRUEsT0FBQSxTQUFBLFlBQUE7WUFDQSxPQUFBLFlBQUE7WUFDQSxJQUFBLENBQUEsT0FBQSxLQUFBO2dCQUNBLE9BQUE7O1lBRUEsSUFBQSxPQUFBLGVBQUEsQ0FBQSxPQUFBO2dCQUNBO2lCQUNBLElBQUEsT0FBQTtnQkFDQTs7Z0JBRUE7OztRQUdBLE9BQUEsT0FBQSxVQUFBO1FBQ0EsU0FBQSxPQUFBO1lBQ0EsT0FBQSxNQUFBLE1BQUEsVUFBQSxVQUFBO2dCQUNBLFVBQUEsS0FBQTtnQkFDQSxPQUFBLGFBQUE7Z0JBQ0EsU0FBQSxLQUFBLFNBQUEsU0FBQSxRQUFBO2VBQ0EsVUFBQSxVQUFBO2dCQUNBLFNBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQSxTQUFBLEtBQUEsT0FBQSxNQUFBO2dCQUNBLE9BQUEsYUFBQTs7Ozs7UUFLQSxPQUFBLGFBQUEsWUFBQTtZQUNBLE9BQUEsY0FBQTtZQUNBLE9BQUEsU0FBQTs7O1FBR0EsT0FBQSxjQUFBLFlBQUE7WUFDQSxPQUFBLFNBQUE7WUFDQSxNQUFBLEtBQUEsV0FBQSxhQUFBLHNCQUFBLENBQUEsS0FBQSxPQUFBLE1BQUEsU0FBQSxRQUFBLFVBQUEsVUFBQTtnQkFDQSxPQUFBLFlBQUE7Z0JBQ0EsSUFBQSxTQUFBLE9BQUEsT0FBQTtvQkFDQSxPQUFBLFlBQUEsU0FBQTtvQkFDQSxPQUFBLE1BQUEsT0FBQTs7Ozs7UUFLQSxPQUFBLFFBQUEsVUFBQSxTQUFBO1lBQ0EsT0FBQSxLQUFBLG1CQUFBLG1DQUFBOztRQUVBLFNBQUEsZ0JBQUE7WUFDQSxPQUFBLGFBQUE7WUFDQSxPQUFBLE9BQUE7Z0JBQ0EsS0FBQSxXQUFBO2dCQUNBLE1BQUEsT0FBQSxNQUFBO2VBQ0EsU0FBQSxVQUFBLEtBQUE7Z0JBQ0EsT0FBQSxXQUFBLFNBQUEsUUFBQSxJQUFBLFNBQUEsSUFBQTtlQUNBLFFBQUEsVUFBQSxNQUFBLFFBQUEsU0FBQSxRQUFBO2dCQUNBLE9BQUEsTUFBQSxTQUFBLEtBQUE7Z0JBQ0EsT0FBQSxNQUFBLE9BQUEsS0FBQTtnQkFDQSxPQUFBLGNBQUE7Z0JBQ0EsT0FBQSxXQUFBO2dCQUNBLElBQUEsT0FBQTtvQkFDQTs7b0JBRUE7ZUFDQSxNQUFBLFVBQUEsTUFBQSxRQUFBLFNBQUEsUUFBQTtnQkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsS0FBQSxPQUFBLE1BQUE7Z0JBQ0EsT0FBQSxhQUFBO2dCQUNBLE9BQUEsV0FBQTs7Ozs7UUFLQSxTQUFBLFNBQUE7WUFDQSxNQUFBLE9BQUEsQ0FBQSxJQUFBLE9BQUEsTUFBQSxLQUFBLE9BQUEsT0FBQSxTQUFBLEtBQUEsVUFBQSxVQUFBO2dCQUNBLE9BQUEsYUFBQTtnQkFDQSxVQUFBLEtBQUEsT0FBQTs7Ozs7Ozs7QUNwR0EsQ0FBQSxXQUFBO0lBQ0E7SUFDQSxRQUFBLE9BQUEsMEJBQUEsV0FBQSxzQkFBQTtJQUNBLG9CQUFBLFNBQUEsQ0FBQSxhQUFBLFVBQUEsU0FBQSxhQUFBLFdBQUE7O0lBRUEsU0FBQSxvQkFBQSxXQUFBLFFBQUEsT0FBQSxXQUFBLFVBQUEsT0FBQTtRQUNBLE9BQUEsU0FBQSxNQUFBO1FBQ0EsT0FBQSxVQUFBO1lBQ0EsV0FBQTtZQUNBLGNBQUE7WUFDQSxjQUFBO1lBQ0EsWUFBQTtZQUNBLFlBQUE7WUFDQSxZQUFBOztRQUVBLE9BQUEsVUFBQSxTQUFBLEdBQUE7WUFDQSxVQUFBLEtBQUE7Z0JBQ0EsWUFBQTtnQkFDQSxhQUFBO2dCQUNBLFFBQUEsUUFBQSxRQUFBLFNBQUE7Z0JBQ0EsYUFBQTtlQUNBLEtBQUEsU0FBQSxTQUFBO2dCQUNBLEdBQUEsWUFBQTtvQkFDQSxPQUFBLE9BQUEsS0FBQTs7OztRQUlBLE9BQUEsU0FBQTtRQUNBLFNBQUEsU0FBQSxLQUFBLFFBQUE7WUFDQSxPQUFBO1lBQ0EsT0FBQTtZQUNBLElBQUEsVUFBQSxVQUFBO2lCQUNBLFFBQUE7aUJBQ0EsR0FBQTtpQkFDQSxPQUFBO2lCQUNBLFlBQUE7O1lBRUEsVUFBQSxLQUFBLFNBQUEsS0FBQSxVQUFBO2dCQUNBLE1BQUEsT0FBQSxDQUFBLEdBQUEsSUFBQSxLQUFBLFNBQUEsS0FBQSxTQUFBLFNBQUE7b0JBQ0EsR0FBQSxTQUFBO3dCQUNBLFNBQUEsS0FBQSxTQUFBLFNBQUEsUUFBQSxTQUFBLE9BQUEsTUFBQTt5QkFDQTt3QkFDQSxTQUFBLEtBQUEsU0FBQSxTQUFBLFFBQUEsU0FBQTt3QkFDQSxJQUFBLFFBQUEsT0FBQSxPQUFBLFFBQUE7d0JBQ0EsT0FBQSxPQUFBLE9BQUEsT0FBQTs7Ozs7U0FLQTs7UUFFQSxPQUFBLFdBQUEsU0FBQSxJQUFBO1lBQ0EsT0FBQSxlQUFBLFFBQUEsS0FBQTtZQUNBLElBQUEsUUFBQSxPQUFBLE9BQUEsUUFBQTtZQUNBLFVBQUEsS0FBQTtnQkFDQSxZQUFBO2dCQUNBLGFBQUE7Z0JBQ0EsUUFBQSxRQUFBLFFBQUEsU0FBQTtnQkFDQSxPQUFBLE9BQUE7ZUFDQSxLQUFBLFVBQUEsUUFBQTtnQkFDQSxJQUFBLFVBQUE7b0JBQ0EsV0FBQSxnQkFBQSxPQUFBLFFBQUEsUUFBQTtnQkFDQSxPQUFBLEdBQUEsVUFBQSxDQUFBLElBQUEsS0FBQSxDQUFBLFFBQUE7Ozs7O0tBS0EiLCJmaWxlIjoiYXBwLmNvbmNhdC5qcyIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbigpe1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuXHJcbiAgICB2YXIgZXF1YWxzRGlyZWN0aXZlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIHJlc3RyaWN0OiAnQScsIC8vIG9ubHkgYWN0aXZhdGUgb24gZWxlbWVudCBhdHRyaWJ1dGVcclxuICAgICAgICAgICAgcmVxdWlyZTogJz9uZ01vZGVsJywgLy8gZ2V0IGEgaG9sZCBvZiBOZ01vZGVsQ29udHJvbGxlclxyXG4gICAgICAgICAgICBsaW5rOiBmdW5jdGlvbiAoc2NvcGUsIGVsZW0sIGF0dHJzLCBuZ01vZGVsKSB7XHJcbiAgICAgICAgICAgICAgICBpZiAoIW5nTW9kZWwpIHJldHVybjsgLy8gZG8gbm90aGluZyBpZiBubyBuZy1tb2RlbFxyXG5cclxuICAgICAgICAgICAgICAgIC8vIHdhdGNoIG93biB2YWx1ZSBhbmQgcmUtdmFsaWRhdGUgb24gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBzY29wZS4kd2F0Y2goYXR0cnMubmdNb2RlbCwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICAvLyBvYnNlcnZlIHRoZSBvdGhlciB2YWx1ZSBhbmQgcmUtdmFsaWRhdGUgb24gY2hhbmdlXHJcbiAgICAgICAgICAgICAgICBhdHRycy4kb2JzZXJ2ZSgnZXF1YWxzJywgZnVuY3Rpb24gKHZhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhbGlkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICB2YXIgdmFsaWRhdGUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gdmFsdWVzXHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDEgPSBuZ01vZGVsLiR2aWV3VmFsdWU7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHZhbDIgPSBhdHRycy5lcXVhbHM7XHJcbiAgICAgICAgICAgICAgICAgICAgLy8gc2V0IHZhbGlkaXR5XHJcbiAgICAgICAgICAgICAgICAgICAgbmdNb2RlbC4kc2V0VmFsaWRpdHkoJ2VxdWFscycsICF2YWwxIHx8ICF2YWwyIHx8IHZhbDEgPT09IHZhbDIpO1xyXG4gICAgICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIH07XHJcbiAgICB2YXIgY2FwaXRhbGl6ZUZpbHRlciA9IGZ1bmN0aW9uICgpIHtcclxuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKGlucHV0LCBhbGwpIHtcclxuICAgICAgICAgICAgcmV0dXJuICghIWlucHV0KSA/IGlucHV0LnJlcGxhY2UoLyhbXlxcV19dK1teXFxzLV0qKSAqL2csIGZ1bmN0aW9uICh0eHQpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiB0eHQuY2hhckF0KDApLnRvVXBwZXJDYXNlKCkgKyB0eHQuc3Vic3RyKDEpLnRvTG93ZXJDYXNlKCk7XHJcbiAgICAgICAgICAgIH0pIDogJyc7XHJcbiAgICAgICAgfVxyXG4gICAgfTtcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwJywgWywnY2hhcnQuanMnLCdjaGFydC5qcycsJ2FuZ3VsYXItc3RvcmFnZScsJ25nRmlsZVVwbG9hZCcsICduZ01hdGVyaWFsJywgJ2RhdGEtdGFibGUnLCAnbmdSZXNvdXJjZScsJ25nTWVzc2FnZXMnLCAndWkucm91dGVyJywnYmFja2VuZEFwcC5jb250cm9sbGVycycsICdiYWNrZW5kQXBwLnNlcnZpY2VzJ10pXHJcbiAgICAgICAgLmNvbmZpZyh0aGVtZUNvbmZpZylcclxuICAgICAgICAuY29uc3RhbnQoJ1VTRVJfUk9MRVMnLCB7XHJcbiAgICAgICAgICAgIGFkbWluOiAnYWRtaW4nLFxyXG4gICAgICAgICAgICBlZGl0b3I6ICdlZGl0b3InLFxyXG4gICAgICAgICAgICBlZGl0b3JQbHVzOiAnZWRpdG9yUGx1cycsXHJcbiAgICAgICAgICAgIGFuYWxpc3RhOiAnYW5hbGlzdGEnLFxyXG4gICAgICAgICAgICBsZWN0b3I6ICdsZWN0b3InXHJcbiAgICAgICAgfSlcclxuICAgICAgICAucnVuKGFwcFJ1bilcclxuICAgICAgICAuZmlsdGVyKCdjYXBpdGFsaXplJywgY2FwaXRhbGl6ZUZpbHRlcilcclxuICAgICAgICAuZGlyZWN0aXZlKCdlcXVhbHMnLCBlcXVhbHNEaXJlY3RpdmUpO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJyxbXSk7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5zZXJ2aWNlcycsW10pO1xyXG5cclxuICAgIGZ1bmN0aW9uIGFwcFJ1bigkc3RhdGUsICRyb290U2NvcGUsIFVzZXJTZXJ2aWNlLCBBdXRoU2VydmljZSkge1xyXG4gICAgICAgIHN3aXRjaCh3aW5kb3cubG9jYXRpb24ub3JpZ2luKXtcclxuICAgICAgICAgICAgY2FzZSAnaHR0cDovL3N0ZzEuand0ZGlnaXRhbHByLmNvbSc6XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNlcnZlcl91cmwgPSAnaHR0cDovL3N0ZzEuand0ZGlnaXRhbHByLmNvbS9tcHRvJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdodHRwOi8vMTkyLjE2OC4yMzUuMTUzJzpcclxuICAgICAgICAgICAgY2FzZSAnaHR0cDovL2xvY2FsaG9zdDo2MzM0Mic6XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNlcnZlcl91cmwgPSAnaHR0cDovLzE5Mi4xNjguMjM1LjE1My9tdXNpY2FfcGFyYV90dXNfb2lkb3MvcHVibGljJztcclxuICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICBjYXNlICdodHRwOi8vd3d3Lm11c2ljYXBhcmF0dXNvaWRvc3ByLmNvbSc6XHJcbiAgICAgICAgICAgIGNhc2UgJ2h0dHA6Ly93d3cubXB0b3ByLmNvbSc6XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLnNlcnZlcl91cmwgPSAnaHR0cDovL3d3dy5tdXNpY2FwYXJhdHVzb2lkb3Nwci5jb20nO1xyXG4gICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgfVxyXG4gICAgICAgICRyb290U2NvcGUudXBsb2FkX3VybCA9ICRyb290U2NvcGUuc2VydmVyX3VybCArICcvYXBpL3VwbG9hZCc7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuaXNUeXBlID0gZnVuY3Rpb24gKHR5cGUsIHN0clR5cGUsIGZpbGUpIHtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNBTUJJTyBERSBDT1NPXCIsIHR5cGUsIHN0clR5cGUsIGZpbGUpO1xyXG4gICAgICAgICAgICB2YXIgaXNUeXBlID0gZmFsc2U7XHJcbiAgICAgICAgICAgIGlmIChzdHJUeXBlID09IHR5cGUpXHJcbiAgICAgICAgICAgICAgICBpc1R5cGUgPSB0cnVlO1xyXG4gICAgICAgICAgICBlbHNlIGlmIChmaWxlICYmIGZpbGUudHlwZSAhPSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICBpc1R5cGUgPSBmaWxlLnR5cGUuaW5kZXhPZih0eXBlKSA+IC0xO1xyXG5cclxuICAgICAgICAgICAgcmV0dXJuIGlzVHlwZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAoIUF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpKVxyXG4gICAgICAgICAgICAkc3RhdGUuZ28oJ2xvZ2luJyk7XHJcbiAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgIEF1dGhTZXJ2aWNlLnJlZnJlc2goKS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXt9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCckc3RhdGVDaGFuZ2VTdGFydCcsIGZ1bmN0aW9uIChldmVudCwgbmV4dCkge1xyXG4gICAgICAgICAgICBpZiAobmV4dC5kYXRhKVxyXG4gICAgICAgICAgICAgICAgdmFyIGF1dGhvcml6ZWRSb2xlcyA9IG5leHQuZGF0YS5hdXRob3JpemVkUm9sZXM7XHJcbiAgICAgICAgICAgIGlmIChhdXRob3JpemVkUm9sZXMgJiYgIUF1dGhTZXJ2aWNlLmlzQXV0aG9yaXplZChhdXRob3JpemVkUm9sZXMpKSB7XHJcbiAgICAgICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1bmF1dGhvcml6ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG4gICAgfTtcclxuXHJcbiAgICBmdW5jdGlvbiB0aGVtZUNvbmZpZygkbWRUaGVtaW5nUHJvdmlkZXIpIHtcclxuICAgICAgICB2YXIgY3VzdG9tQmx1ZU1hcCA9ICRtZFRoZW1pbmdQcm92aWRlci5leHRlbmRQYWxldHRlKCdsaWdodC1ibHVlJywge1xyXG4gICAgICAgICAgICAnY29udHJhc3REZWZhdWx0Q29sb3InOiAnbGlnaHQnLFxyXG4gICAgICAgICAgICAnY29udHJhc3REYXJrQ29sb3JzJzogWyc1MCddLFxyXG4gICAgICAgICAgICAnNTAnOiAnZmZmZmZmJ1xyXG4gICAgICAgIH0pO1xyXG4gICAgICAgICRtZFRoZW1pbmdQcm92aWRlci5kZWZpbmVQYWxldHRlKCdjdXN0b21CbHVlJywgY3VzdG9tQmx1ZU1hcCk7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdkZWZhdWx0JykucHJpbWFyeVBhbGV0dGUoJ2N1c3RvbUJsdWUnLCB7XHJcbiAgICAgICAgICAgICdkZWZhdWx0JzogJzUwMCcsXHJcbiAgICAgICAgICAgICdodWUtMSc6ICc1MCdcclxuICAgICAgICB9KS5hY2NlbnRQYWxldHRlKCdwaW5rJyk7XHJcbiAgICAgICAgJG1kVGhlbWluZ1Byb3ZpZGVyLnRoZW1lKCdpbnB1dCcsICdkZWZhdWx0JykucHJpbWFyeVBhbGV0dGUoJ2dyZXknKTtcclxuICAgIH07XHJcbn0pKCk7IiwiKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwJykuY29uZmlnKGNvbmZpZ1JvdXRlcyk7XHJcblxyXG4gICAgY29uZmlnUm91dGVzLiRpbmplY3QgPSBbJyRzdGF0ZVByb3ZpZGVyJywgJ1VTRVJfUk9MRVMnLCAnJGh0dHBQcm92aWRlcicsICckcHJvdmlkZSddO1xyXG4gICAgZnVuY3Rpb24gY29uZmlnUm91dGVzKCRzdGF0ZVByb3ZpZGVyLCBVU0VSX1JPTEVTLCAkaHR0cFByb3ZpZGVyLCAkcHJvdmlkZSkge1xyXG5cclxuICAgICAgICAkaHR0cFByb3ZpZGVyLmludGVyY2VwdG9ycy5wdXNoKCdBUElJbnRlcmNlcHRvcicpO1xyXG5cclxuICAgICAgICAkc3RhdGVQcm92aWRlci5zdGF0ZSgnYWRzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvcHJvbW9zLzppZCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZExpc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb21vcy9saXN0Lmh0bWwnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBhdXRob3JpemVkUm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluLCBVU0VSX1JPTEVTLmVkaXRvclBsdXNdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdGF0ZSgnY2FuY2lvbmVzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvY2FuY2lvbmVzLzppZCcsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdDYW5jaW9uTGlzdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY2FuY2lvbmVzL2xpc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGF1dGhvcml6ZWRSb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sIFVTRVJfUk9MRVMuZWRpdG9yLCBVU0VSX1JPTEVTLmVkaXRvclBsdXNdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdGF0ZSgnY2F0ZWdvcmlhcycsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2NhdGVnb3JpYXMvOmlkJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0NhdGVnb3JpYUxpc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2NhdGVnb3JpYXMvbGlzdC5odG1sJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgYXV0aG9yaXplZFJvbGVzOiBbVVNFUl9ST0xFUy5hZG1pbiwgVVNFUl9ST0xFUy5lZGl0b3IsIFVTRVJfUk9MRVMuZWRpdG9yUGx1c11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLnN0YXRlKCdjdWVudG9zJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvY3VlbnRvcy86aWQnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ3VlbnRvQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9jdWVudG9zL2xpc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGF1dGhvcml6ZWRSb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sIFVTRVJfUk9MRVMuZWRpdG9yLCBVU0VSX1JPTEVTLmVkaXRvclBsdXNdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdGF0ZSgnY29tZW50YXJpb3MnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9jb21lbnRhcmlvcy86aWQnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnQ29tZW50YXJpb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY29tZW50YXJpb3MvbGlzdC5odG1sJyxcclxuICAgICAgICAgICAgZGF0YToge1xyXG4gICAgICAgICAgICAgICAgYXV0aG9yaXplZFJvbGVzOiBbVVNFUl9ST0xFUy5hZG1pbiwgVVNFUl9ST0xFUy5lZGl0b3IsIFVTRVJfUk9MRVMuZWRpdG9yUGx1c11cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pLnN0YXRlKCdkaXNjb3MnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9kaXNjb3MvOmlkJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0Rpc2NvTGlzdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvZGlzY29zL2xpc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGF1dGhvcml6ZWRSb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sIFVTRVJfUk9MRVMuZWRpdG9yLCBVU0VSX1JPTEVTLmVkaXRvclBsdXNdXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdGF0ZSgnZXZlbnRvcycsIHtcclxuICAgICAgICAgICAgdXJsOiAnL2V2ZW50b3MnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnRXZlbnRvTGlzdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvZXZlbnRvcy9saXN0Lmh0bWwnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBhdXRob3JpemVkUm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluLCBVU0VSX1JPTEVTLmVkaXRvciwgVVNFUl9ST0xFUy5lZGl0b3JQbHVzXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuc3RhdGUoJ25vdGljaWFzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvbm90aWNpYXMvOmlkJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ05vdGljaWFMaXN0Q29udHJvbGxlcicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9ub3RpY2lhcy9saXN0Lmh0bWwnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBhdXRob3JpemVkUm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluLCBVU0VSX1JPTEVTLmVkaXRvciwgVVNFUl9ST0xFUy5lZGl0b3JQbHVzXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuc3RhdGUoJ3ZpZGVvcycsIHtcclxuICAgICAgICAgICAgdXJsOiAnL3ZpZGVvcycsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdWaWRlb0xpc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3ZpZGVvcy9saXN0Lmh0bWwnLFxyXG4gICAgICAgICAgICBkYXRhOiB7XHJcbiAgICAgICAgICAgICAgICBhdXRob3JpemVkUm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluLCBVU0VSX1JPTEVTLmVkaXRvciwgVVNFUl9ST0xFUy5lZGl0b3JQbHVzXVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSkuc3RhdGUoJ3VzZXJzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvdXNlcnMnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlckxpc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXJzL2xpc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGF1dGhvcml6ZWRSb2xlczogW1VTRVJfUk9MRVMuYWRtaW5dXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdGF0ZSgnc2l0ZXVzZXJzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvc2l0ZXVzZXJzJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ1NpdGVVc2VyTGlzdENvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvc2l0ZVVzZXJzL2xpc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGF1dGhvcml6ZWRSb2xlczogW1VTRVJfUk9MRVMuYWRtaW5dXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdGF0ZSgnaW50ZWdyYW50ZXMnLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9pbnRlZ3JhbnRlcy86aWQnLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyOiAnSW50ZWdyYW50ZUxpc3RDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2ludGVncmFudGVzL2xpc3QuaHRtbCcsXHJcbiAgICAgICAgICAgIGRhdGE6IHtcclxuICAgICAgICAgICAgICAgIGF1dGhvcml6ZWRSb2xlczogW1VTRVJfUk9MRVMuYWRtaW5dXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9KS5zdGF0ZSgnbG9naW4nLCB7XHJcbiAgICAgICAgICAgIHVybDogJy9sb2dpbicsXHJcbiAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdMb2dpbkNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvbG9naW4uaHRtbCdcclxuICAgICAgICB9KS5zdGF0ZSgnYW5hbHl0aWNzJywge1xyXG4gICAgICAgICAgICB1cmw6ICcvYW5hbHl0aWNzJyxcclxuICAgICAgICAgICAgY29udHJvbGxlcjogJ0FuYWx5dGljc0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvYW5hbHl0aWNzLmh0bWwnXHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIC8qLmh0bWw1TW9kZSh7XHJcbiAgICAgICAgIGVuYWJsZWQ6dHJ1ZSxcclxuICAgICAgICAgcmVxdWlyZUJhc2U6ZmFsc2VcclxuICAgICAgICAgfSk7Ki9cclxuICAgIH1cclxuXHJcbn0pKCk7IiwiKGZ1bmN0aW9uKCl7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICAvKiAgdmFyIGFwaVJlc291cmNlcyA9IFsnQWQnLCAnQ2FuY2lvbicsICdDYXRlZ29yaWEnLCAnQ29tZW50YXJpbycsICdDdWVudG8nLCAnRGlzY28nLCAnRXZlbnRvJywgJ0ludGVncmFudGUnLCAnVXNlcicsICdVc2VyU2l0ZScsICdOb3RpY2lhJywgJ1ZpZGVvJywgJ1RhZyddO1xyXG5cclxuICAgICBmb3IgKHZhciBpID0gMDsgaSA8IGFwaVJlc291cmNlcy5sZW5ndGg7IGkrKykge1xyXG4gICAgIHZhciBzZXJ2aWNlTmFtZSA9IGFwaVJlc291cmNlc1tpXTtcclxuICAgICBjb25zb2xlLmxvZyhcInJlc291cmNlIE5hbWVcIiwgc2VydmljZU5hbWUpO1xyXG4gICAgIGNvbnNvbGUubG9nKFwicmVzb3VyY2UgaWRcIiwgc2VydmljZU5hbWUudG9Mb3dlckNhc2UoKSk7XHJcbiAgICAgYW5ndWxhci5tb2R1bGUoXCJiYWNrZW5kQXBwLnNlcnZpY2VzXCIpLmZhY3Rvcnkoc2VydmljZU5hbWUsIGZ1bmN0aW9uICgkcmVzb3VyY2UsICRyb290U2NvcGUpIHtcclxuICAgICByZXR1cm4gJHJlc291cmNlKCRyb290U2NvcGUuc2VydmVyX3VybCArICcvYXBpL2FkJyArIHNlcnZpY2VOYW1lLnRvTG93ZXJDYXNlKCkgKyAnLzppZCcsIG51bGwsIHsndXBkYXRlJzoge21ldGhvZDogJ1BVVCd9fSk7XHJcbiAgICAgfSk7XHJcbiAgICAgfSovXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImJhY2tlbmRBcHAuc2VydmljZXNcIikuZmFjdG9yeSgnQWQnLCBmdW5jdGlvbigkcmVzb3VyY2UsICRyb290U2NvcGUpe1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoJHJvb3RTY29wZS5zZXJ2ZXJfdXJsKyAnL2FwaS9hZHMvOmlkJywgbnVsbCwgeyd1cGRhdGUnOnttZXRob2Q6ICdQVVQnfX0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJiYWNrZW5kQXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0NhbmNpb24nLCBmdW5jdGlvbigkcmVzb3VyY2UsICRyb290U2NvcGUpe1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoJHJvb3RTY29wZS5zZXJ2ZXJfdXJsKyAnL2FwaS9jYW5jaW9uZXMvOmlkJywgbnVsbCwgeyd1cGRhdGUnOnttZXRob2Q6ICdQVVQnfX0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJiYWNrZW5kQXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0NhdGVnb3JpYScsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJHJvb3RTY29wZSl7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgkcm9vdFNjb3BlLnNlcnZlcl91cmwrICcvYXBpL2NhdGVnb3JpYXMvOmlkJywgbnVsbCwgeyd1cGRhdGUnOnttZXRob2Q6ICdQVVQnfX0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJiYWNrZW5kQXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0NvbWVudGFyaW8nLCBmdW5jdGlvbigkcmVzb3VyY2UsICRyb290U2NvcGUpe1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoJHJvb3RTY29wZS5zZXJ2ZXJfdXJsKyAnL2FwaS9jb21lbnRhcmlvcy86aWQnLCBudWxsLCB7J3VwZGF0ZSc6e21ldGhvZDogJ1BVVCd9fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImJhY2tlbmRBcHAuc2VydmljZXNcIikuZmFjdG9yeSgnQ3VlbnRvJywgZnVuY3Rpb24oJHJlc291cmNlLCAkcm9vdFNjb3BlKXtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKCRyb290U2NvcGUuc2VydmVyX3VybCsgJy9hcGkvY3VlbnRvcy86aWQnLCBudWxsLCB7J3VwZGF0ZSc6e21ldGhvZDogJ1BVVCd9fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImJhY2tlbmRBcHAuc2VydmljZXNcIikuZmFjdG9yeSgnRGlzY28nLCBmdW5jdGlvbigkcmVzb3VyY2UsICRyb290U2NvcGUpe1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoJHJvb3RTY29wZS5zZXJ2ZXJfdXJsKyAnL2FwaS9kaXNjb3MvOmlkJywgbnVsbCwgeyd1cGRhdGUnOnttZXRob2Q6ICdQVVQnfX0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJiYWNrZW5kQXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0V2ZW50bycsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJHJvb3RTY29wZSl7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgkcm9vdFNjb3BlLnNlcnZlcl91cmwrICcvYXBpL2V2ZW50b3MvOmlkJywgbnVsbCwgeyd1cGRhdGUnOnttZXRob2Q6ICdQVVQnfX0pO1xyXG4gICAgfSk7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoXCJiYWNrZW5kQXBwLnNlcnZpY2VzXCIpLmZhY3RvcnkoJ0ludGVncmFudGUnLCBmdW5jdGlvbigkcmVzb3VyY2UsICRyb290U2NvcGUpe1xyXG4gICAgICAgIHJldHVybiAkcmVzb3VyY2UoJHJvb3RTY29wZS5zZXJ2ZXJfdXJsKyAnL2FwaS9pbnRlZ3JhbnRlcy86aWQnLCBudWxsLCB7J3VwZGF0ZSc6e21ldGhvZDogJ1BVVCd9fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImJhY2tlbmRBcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVXNlcicsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJHJvb3RTY29wZSl7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgkcm9vdFNjb3BlLnNlcnZlcl91cmwrICcvYXBpL3VzZXJzLzppZCcsIG51bGwsIHsndXBkYXRlJzp7bWV0aG9kOiAnUFVUJ319KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYmFja2VuZEFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdTaXRlVXNlcicsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJHJvb3RTY29wZSl7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgkcm9vdFNjb3BlLnNlcnZlcl91cmwrICcvYXBpL3NpdGV1c2Vycy86aWQnLCBudWxsLCB7J3VwZGF0ZSc6e21ldGhvZDogJ1BVVCd9fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImJhY2tlbmRBcHAuc2VydmljZXNcIikuZmFjdG9yeSgnTm90aWNpYScsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJHJvb3RTY29wZSl7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgkcm9vdFNjb3BlLnNlcnZlcl91cmwrICcvYXBpL25vdGljaWFzLzppZCcsIG51bGwsIHsndXBkYXRlJzp7bWV0aG9kOiAnUFVUJ319KTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYmFja2VuZEFwcC5zZXJ2aWNlc1wiKS5mYWN0b3J5KCdWaWRlbycsIGZ1bmN0aW9uKCRyZXNvdXJjZSwgJHJvb3RTY29wZSl7XHJcbiAgICAgICAgcmV0dXJuICRyZXNvdXJjZSgkcm9vdFNjb3BlLnNlcnZlcl91cmwrICcvYXBpL3ZpZGVvcy86aWQnLCBudWxsLCB7J3VwZGF0ZSc6e21ldGhvZDogJ1BVVCd9fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImJhY2tlbmRBcHAuc2VydmljZXNcIikuZmFjdG9yeSgnVGFnJywgZnVuY3Rpb24oJHJlc291cmNlLCAkcm9vdFNjb3BlKXtcclxuICAgICAgICByZXR1cm4gJHJlc291cmNlKCRyb290U2NvcGUuc2VydmVyX3VybCsgJy9hcGkvdGFncy86aWQnLCBudWxsLCB7J3VwZGF0ZSc6e21ldGhvZDogJ1BVVCd9fSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZShcImJhY2tlbmRBcHAuc2VydmljZXNcIikuZmFjdG9yeSgnQXV0aFNlcnZpY2UnLCBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJGh0dHAsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIGF1dGhTZXJ2aWNlID0ge307XHJcblxyXG4gICAgICAgIGF1dGhTZXJ2aWNlLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgkcm9vdFNjb3BlLnNlcnZlcl91cmwgKyAnL2FwaS9sb2dpbicsIGNyZWRlbnRpYWxzKTtcclxuXHJcbiAgICAgICAgICAgIHByb21pc2UudGhlbihzdWNjZXNzQXVodGhlbnRpY2F0aW9uLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLiRicm9hZGNhc3QoJ3VuYXV0aG9yaXplZCcpO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIHJldHVybiBwcm9taXNlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGF1dGhTZXJ2aWNlLmxvZ291dCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIHZhciBwcm9taXNlID0gJGh0dHAucG9zdCgkcm9vdFNjb3BlLnNlcnZlcl91cmwgKyAnL2FwaS9sb2dvdXQnKTtcclxuICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1bmF1dGhvcml6ZWQnKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBhdXRoU2VydmljZS5yZWZyZXNoID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgdmFyIHVzZXIgPSBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpO1xyXG4gICAgICAgICAgICBpZih1c2VyKSB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcHJvbWlzZSA9ICRodHRwLnBvc3QoJHJvb3RTY29wZS5zZXJ2ZXJfdXJsICsgJy9hcGkvcmVmcmVzaCcsIHVzZXIuYWNjZXNzX3Rva2VuKTtcclxuXHJcbiAgICAgICAgICAgICAgICBwcm9taXNlLnRoZW4oc3VjY2Vzc0F1aHRoZW50aWNhdGlvbiwgZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgndW5hdXRob3JpemVkJyk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gcHJvbWlzZTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Y2Nlc3NBdWh0aGVudGljYXRpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICB2YXIgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coXCJuZXcgdXNlciBkYXRhXCIsIGRhdGEpO1xyXG4gICAgICAgICAgICBpZiAoZGF0YS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgYWxlcnQoXCJCQUQgTE9HSU5cIik7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZihkYXRhLmFjY2Vzc190b2tlbil7XHJcbiAgICAgICAgICAgICAgICBVc2VyU2VydmljZS5zZXRDdXJyZW50VXNlcihkYXRhKTtcclxuICAgICAgICAgICAgICAgICRyb290U2NvcGUuJGJyb2FkY2FzdCgnYXV0aG9yaXplZCcpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBhdXRoU2VydmljZS5pc0F1dGhlbnRpY2F0ZWQgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIHJldHVybiBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpIT1udWxsO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGF1dGhTZXJ2aWNlLmlzQXV0aG9yaXplZCA9IGZ1bmN0aW9uIChhdXRob3JpemVkUm9sZXMpIHtcclxuICAgICAgICAgICAgaWYgKCFhbmd1bGFyLmlzQXJyYXkoYXV0aG9yaXplZFJvbGVzKSkge1xyXG4gICAgICAgICAgICAgICAgYXV0aG9yaXplZFJvbGVzID0gW2F1dGhvcml6ZWRSb2xlc107XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImF1dGhvcml6ZWQgcm9sZXNcIiwgYXV0aG9yaXplZFJvbGVzLCBcInVzZXIgcm9sZVwiLCBVc2VyU2VydmljZS5nZXRDdXJyZW50VXNlcigpLnJvbGUpO1xyXG4gICAgICAgICAgICByZXR1cm4gKGF1dGhTZXJ2aWNlLmlzQXV0aGVudGljYXRlZCgpICYmXHJcbiAgICAgICAgICAgIGF1dGhvcml6ZWRSb2xlcy5pbmRleE9mKFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCkucm9sZS50b0xvd2VyQ2FzZSgpKSAhPT0gLTEpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiBhdXRoU2VydmljZTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYmFja2VuZEFwcC5zZXJ2aWNlc1wiKS5zZXJ2aWNlKCdVc2VyU2VydmljZScsIGZ1bmN0aW9uKHN0b3JlKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB0aGlzLFxyXG4gICAgICAgICAgICBjdXJyZW50VXNlciA9IG51bGw7XHJcblxyXG4gICAgICAgIHNlcnZpY2Uuc2V0Q3VycmVudFVzZXIgPSBmdW5jdGlvbih1c2VyKSB7XHJcbiAgICAgICAgICAgIGN1cnJlbnRVc2VyID0gdXNlcjtcclxuXHJcbiAgICAgICAgICAgIHN0b3JlLnNldCgndXNlci1iYWNrZW5kJywgdXNlcik7XHJcbiAgICAgICAgICAgIHJldHVybiBjdXJyZW50VXNlcjtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBzZXJ2aWNlLmdldEN1cnJlbnRVc2VyID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIGlmICghY3VycmVudFVzZXIpIHtcclxuICAgICAgICAgICAgICAgIGN1cnJlbnRVc2VyID0gc3RvcmUuZ2V0KCd1c2VyLWJhY2tlbmQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY3VycmVudFVzZXI7XHJcbiAgICAgICAgfTtcclxuICAgIH0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKFwiYmFja2VuZEFwcC5zZXJ2aWNlc1wiKS5zZXJ2aWNlKCdBUElJbnRlcmNlcHRvcicsIGZ1bmN0aW9uKCRyb290U2NvcGUsIFVzZXJTZXJ2aWNlKSB7XHJcbiAgICAgICAgdmFyIHNlcnZpY2UgPSB0aGlzO1xyXG5cclxuICAgICAgICBzZXJ2aWNlLnJlcXVlc3QgPSBmdW5jdGlvbihjb25maWcpIHtcclxuICAgICAgICAgICAgdmFyIGN1cnJlbnRVc2VyID0gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKSxcclxuICAgICAgICAgICAgICAgIGFjY2Vzc190b2tlbiA9IGN1cnJlbnRVc2VyID8gY3VycmVudFVzZXIuYWNjZXNzX3Rva2VuIDogbnVsbDtcclxuICAgICAgICAgICAgaWYgKGFjY2Vzc190b2tlbikge1xyXG4gICAgICAgICAgICAgICAgY29uZmlnLmhlYWRlcnMuQXV0aG9yaXphdGlvbiA9IGFjY2Vzc190b2tlbjtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gY29uZmlnO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHNlcnZpY2UucmVzcG9uc2VFcnJvciA9IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgIGlmIChyZXNwb25zZS5zdGF0dXMgPT09IDQwMSkge1xyXG4gICAgICAgICAgICAgICAgJHJvb3RTY29wZS4kYnJvYWRjYXN0KCd1bmF1dGhvcml6ZWQnKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2U7XHJcbiAgICAgICAgfTtcclxuICAgIH0pXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTWF4aSBvbiA3LzMxLzIwMTUuXHJcbiAqL1xyXG4oZnVuY3Rpb24gKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQW5hbHl0aWNzQ29udHJvbGxlcicsIEFuYWx5dGljc0NvbnRyb2xsZXIpO1xyXG4gICAgQW5hbHl0aWNzQ29udHJvbGxlci4kaW5qZWN0ID0gWydBZCcsICckaHR0cCcsICckcm9vdFNjb3BlJywgJyRzY29wZSddO1xyXG4gICAgZnVuY3Rpb24gQW5hbHl0aWNzQ29udHJvbGxlcihBZCwgJGh0dHAsICRyb290U2NvcGUsICRzY29wZSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmFkcyA9IEFkLnF1ZXJ5KCk7XHJcbiAgICAgICAgdm0ub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgcm93SGVpZ2h0OiBcImF1dG9cIixcclxuICAgICAgICAgICAgZm9vdGVySGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgaGVhZGVySGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyVjogZmFsc2UsXHJcbiAgICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb2x1bW5Nb2RlOiAnZm9yY2UnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAvL1RoaXMgaXMgZWFjaCBkYXkgaW4gZ3JvdXAgYnlcclxuICAgICAgICB2bS5sYWJlbHMgPSBbXTtcclxuICAgICAgICAvL0V2ZXJ5IGRpZmZlcmVudCBzdGF0IChjbGlja3MsIHByaW50cywgZXRjKVxyXG4gICAgICAgIHZtLnNlcmllcyA9IFtdO1xyXG4gICAgICAgIC8vU2hvdyBpdCBvciBub3QgaW4gdGhlIGNoYXJ0XHJcbiAgICAgICAgdm0uc2VyaWVzRW5hYmxlZCA9IFt0cnVlLCB0cnVlXTtcclxuXHJcbiAgICAgICAgLy9EYXRhIGVhY2ggYXJyYXkgY29ycmVzcG9uZHMgdG8gb25lIHNlcmllcyBhbmQgc2hvdWxkIGJvdGggaGF2ZSBhIHZhbHVlIGZvciBlYWNoIGxhYmVsIGluZGV4XHJcbiAgICAgICAgdmFyIGRhdGEgPSBbXTtcclxuICAgICAgICB2bS5kYXRhID0gWyBdO1xyXG5cclxuICAgICAgICB2bS5maWx0ZXIgPSBmdW5jdGlvbihuZXdWYWwpIHtcclxuICAgICAgICAgICAgaWYoZGF0YS5sZW5ndGggPT0gMCApIHJldHVybjtcclxuICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhcImZpbHRlciB3aXRoIGRhdGFcIiwgZGF0YSwgZGF0YS5sZW5ndGgpO1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZmlsdGVyIHdpdGggZW5hYmxlZFwiLCB2bS5zZXJpZXNFbmFibGVkKTtcclxuICAgICAgICAgICAgdm0uZGF0YSA9IFtdO1xyXG4gICAgICAgICAgICB2bS5zZXJpZXMgID0gW107XHJcbiAgICAgICAgICAgIHZtLmxhYmVscyA9IGRhdGEuZmVjaGFzO1xyXG4gICAgICAgICAgICBpZih2bS5zZXJpZXNFbmFibGVkWzBdKXtcclxuICAgICAgICAgICAgICAgIHZtLnNlcmllcy5wdXNoKFwiQ2xpY2tzXCIpO1xyXG4gICAgICAgICAgICAgICAgdm0uZGF0YS5wdXNoKGRhdGEuY2xpY2tzKVxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGlmKHZtLnNlcmllc0VuYWJsZWRbMV0pe1xyXG4gICAgICAgICAgICAgICAgdm0uc2VyaWVzLnB1c2goXCJJbXByZXNpb25lc1wiKTtcclxuICAgICAgICAgICAgICAgIHZtLmRhdGEucHVzaChkYXRhLnByaW50cylcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiZmlsdGVyZWQgZGF0YVwiLCB2bS5kYXRhKTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgJHNjb3BlLiR3YXRjaCgndm0uc2VyaWVzRW5hYmxlZCcsIHZtLmZpbHRlciAsIHRydWUpO1xyXG5cclxuICAgICAgICAvL1NUQVRTIEFQSVxyXG4gICAgICAgICRodHRwLmdldCgkcm9vdFNjb3BlLnNlcnZlcl91cmwgKyBcIi9hcGkvYW5hbHl0aWNzXCIpLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKFwiYXBpIHJlcXVlc3QgZ290XCIgK3Jlc3BvbnNlKTtcclxuICAgICAgICAgICAgZGF0YSA9IHJlc3BvbnNlLmRhdGE7XHJcbiAgICAgICAgICAgIHZtLmZpbHRlcigpO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCl7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0hlYWRlckNvbnRyb2xsZXInLCBbJyRzY29wZScsICckbWRTaWRlbmF2JywnJHJvb3RTY29wZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRzY29wZSwgJG1kU2lkZW5hdiwkcm9vdFNjb3BlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5vcGVuTGVmdE1lbnUgPSBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgICAgICAkbWRTaWRlbmF2KCdzaWRlLW5hdicpLnRvZ2dsZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICAkcm9vdFNjb3BlLiRvbignJHN0YXRlQ2hhbmdlU3VjY2VzcycsXHJcbiAgICAgICAgICAgICAgICBmdW5jdGlvbihldmVudCwgdG9TdGF0ZSwgdG9QYXJhbXMsIGZyb21TdGF0ZSwgZnJvbVBhcmFtcykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdGF0ZSA9IHRvU3RhdGU7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIClcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTWF4aSBvbiA3LzMxLzIwMTUuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0xvZ2luQ29udHJvbGxlcicsIGZ1bmN0aW9uICgkc2NvcGUsICRyb290U2NvcGUsIEF1dGhTZXJ2aWNlLCAkc3RhdGUpIHtcclxuICAgICAgICAkc2NvcGUuY3JlZGVudGlhbHMgPSB7XHJcbiAgICAgICAgICAgIGVtYWlsOiAnJyxcclxuICAgICAgICAgICAgcGFzc3dvcmQ6ICcnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxvZ2luID0gZnVuY3Rpb24gKGNyZWRlbnRpYWxzKSB7XHJcbiAgICAgICAgICAgIEF1dGhTZXJ2aWNlLmxvZ2luKGNyZWRlbnRpYWxzKS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdmFyIGRhdGEgPSByZXNwb25zZS5kYXRhO1xyXG4gICAgICAgICAgICAgICAgaWYoZGF0YS5lcnJvcil7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZvcm0uJGlzVmFsaWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oJ25vdGljaWFzJyk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5yZWdpc3RlciA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgIExvZ2luU2VydmljZS5yZWdpc3Rlcigkc2NvcGUubmV3VXNlcikudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubG9naW4oJHNjb3BlLm5ld1VzZXIpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgICRzY29wZS5uZXdVc2VyID0gbnVsbDtcclxuICAgIH0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ01haW5DdHJsJywgZnVuY3Rpb24gKCRzY29wZSwgJHJvb3RTY29wZSwgJHN0YXRlLCBBdXRoU2VydmljZSwgVXNlclNlcnZpY2UpIHtcclxuICAgICAgICB2YXIgbWFpbiA9IHRoaXM7XHJcblxyXG5cclxuICAgICAgICAkc2NvcGUuaXNBdXRob3JpemVkID0gQXV0aFNlcnZpY2UuaXNBdXRob3JpemVkO1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLiRvbignYXV0aG9yaXplZCcsIGZ1bmN0aW9uICgpIHtcclxuICAgICAgICAgICAgbWFpbi5jdXJyZW50VXNlciA9IFVzZXJTZXJ2aWNlLmdldEN1cnJlbnRVc2VyKCk7XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgICRyb290U2NvcGUuJG9uKCd1bmF1dGhvcml6ZWQnLCBmdW5jdGlvbiAoKSB7XHJcbiAgICAgICAgICAgIG1haW4uY3VycmVudFVzZXIgPSBVc2VyU2VydmljZS5zZXRDdXJyZW50VXNlcihudWxsKTtcclxuICAgICAgICAgICAgJHN0YXRlLmdvKCdsb2dpbicpO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICAkcm9vdFNjb3BlLmFkZE9yVXBkYXRlTGlzdCA9IGFkZE9yVXBkYXRlTGlzdDtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWRkT3JVcGRhdGVMaXN0KGFycmF5LCByb3csIGluZGV4KSB7XHJcbiAgICAgICAgICAgIGlmIChpbmRleCA8IGFycmF5Lmxlbmd0aCAmJiBpbmRleCA+PSAwKVxyXG4gICAgICAgICAgICAgICAgYXJyYXlbaW5kZXhdID0gcm93O1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBhcnJheS5wdXNoKHJvdyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBtYWluLmxvZ291dCA9IEF1dGhTZXJ2aWNlLmxvZ291dDtcclxuICAgICAgICBtYWluLmN1cnJlbnRVc2VyID0gVXNlclNlcnZpY2UuZ2V0Q3VycmVudFVzZXIoKTtcclxuICAgIH0pO1xyXG5cclxuXHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTWF4aSBvbiA3LzMxLzIwMTUuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKXtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignTWVudUNvbnRyb2xsZXInLCBbJyRzY29wZScsICdVU0VSX1JPTEVTJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHNjb3BlLCBVU0VSX1JPTEVTKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5tZW51ID0gW1xyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsgOiAnYWRzJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0FkcycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2FkZF9zaG9wcGluZ19jYXJ0JyxcclxuICAgICAgICAgICAgICAgICAgICByb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sIFVTRVJfUk9MRVMuZWRpdG9yUGx1c11cclxuICAgICAgICAgICAgICAgIH0sXHJcblxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsgOiAnY2FuY2lvbmVzJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0NhbmNpb25lcycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ211c2ljX25vdGUnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbVVNFUl9ST0xFUy5hZG1pbixVU0VSX1JPTEVTLmVkaXRvciwgVVNFUl9ST0xFUy5lZGl0b3JQbHVzXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rIDogJ2NhdGVnb3JpYXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ2F0ZWdvcmlhcycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2ZpbHRlcl9saXN0JyxcclxuICAgICAgICAgICAgICAgICAgICByb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sVVNFUl9ST0xFUy5lZGl0b3IsIFVTRVJfUk9MRVMuZWRpdG9yUGx1c11cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluayA6ICdjb21lbnRhcmlvcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdDb21lbnRhcmlvcycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2Jvb2snLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbVVNFUl9ST0xFUy5hZG1pbixVU0VSX1JPTEVTLmVkaXRvciwgVVNFUl9ST0xFUy5lZGl0b3JQbHVzXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rIDogJ2N1ZW50b3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnQ3VlbnRvcycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2Jvb2snLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbVVNFUl9ST0xFUy5hZG1pbixVU0VSX1JPTEVTLmVkaXRvciwgVVNFUl9ST0xFUy5lZGl0b3JQbHVzXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rIDogJ2Rpc2NvcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdEaXNjb3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdsaWJyYXJ5X211c2ljJyxcclxuICAgICAgICAgICAgICAgICAgICByb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sVVNFUl9ST0xFUy5lZGl0b3IsIFVTRVJfUk9MRVMuZWRpdG9yUGx1c11cclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluayA6ICdldmVudG9zJyxcclxuICAgICAgICAgICAgICAgICAgICB0aXRsZTogJ0V2ZW50b3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdldmVudCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluLFVTRVJfUk9MRVMuZWRpdG9yLCBVU0VSX1JPTEVTLmVkaXRvclBsdXNdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsgOiAnaW50ZWdyYW50ZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnSW50ZWdyYW50ZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdhY2NvdW50X2NpcmNsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rIDogJ2FuYWx5dGljcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdNZXRyaWNhcycsXHJcbiAgICAgICAgICAgICAgICAgICAgaWNvbjogJ2FkZF9zaG9wcGluZ19jYXJ0JyxcclxuICAgICAgICAgICAgICAgICAgICByb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sIFVTRVJfUk9MRVMuYW5hbGlzdGFdXHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsgOiAnbm90aWNpYXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnTm90aWNpYXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICduZXdfcmVsZWFzZXMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHJvbGVzOiBbVVNFUl9ST0xFUy5hZG1pbixVU0VSX1JPTEVTLmVkaXRvciwgVVNFUl9ST0xFUy5lZGl0b3JQbHVzXVxyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICAgICAgICBsaW5rIDogJ3ZpZGVvcycsXHJcbiAgICAgICAgICAgICAgICAgICAgdGl0bGU6ICdWaWRlb3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICd2aWRlb19saWJyYXJ5JyxcclxuICAgICAgICAgICAgICAgICAgICByb2xlczogW1VTRVJfUk9MRVMuYWRtaW4sVVNFUl9ST0xFUy5lZGl0b3IsIFVTRVJfUk9MRVMuZWRpdG9yUGx1c11cclxuICAgICAgICAgICAgICAgIH0se1xyXG4gICAgICAgICAgICAgICAgICAgIGxpbmsgOiAndXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVXN1YXJpb3MnLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdhY2NvdW50X2NpcmNsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluXVxyXG4gICAgICAgICAgICAgICAgfSx7XHJcbiAgICAgICAgICAgICAgICAgICAgbGluayA6ICdzaXRldXNlcnMnLFxyXG4gICAgICAgICAgICAgICAgICAgIHRpdGxlOiAnVXN1YXJpb3Mgc2l0aW8nLFxyXG4gICAgICAgICAgICAgICAgICAgIGljb246ICdhY2NvdW50X2NpcmNsZScsXHJcbiAgICAgICAgICAgICAgICAgICAgcm9sZXM6IFtVU0VSX1JPTEVTLmFkbWluXVxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBdO1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG5cclxuXHJcblxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRDYW5jaW9uQ29udHJvbGxlcicsIEFkZENhbmNpb25Db250cm9sbGVyKTtcclxuXHJcbiAgICBBZGRDYW5jaW9uQ29udHJvbGxlci4kaW5qZWN0ID0gWyckc2NvcGUnLCckcm9vdFNjb3BlJywnJG1kVG9hc3QnLCAnJG1kRGlhbG9nJywgJ0NhbmNpb24nLCAnRGlzY28nLCAnVXBsb2FkJ107XHJcblxyXG4gICAgZnVuY3Rpb24gQWRkQ2FuY2lvbkNvbnRyb2xsZXIoJHNjb3BlLCAkcm9vdFNjb3BlLCRtZFRvYXN0LCAkbWREaWFsb2csIENhbmNpb24sIERpc2NvLCBVcGxvYWQpe1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uZWRpdCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmRpc2NvcyA9IERpc2NvLnF1ZXJ5KCk7XHJcbiAgICAgICAgdm0ucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICB2bS5maWxlQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmF0dGVtcHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB2bS5zdWJtaXQgPSBzdWJtaXQ7XHJcbiAgICAgICAgdm0uZmlsZUNoYW5nZSA9IGZpbGVDaGFuZ2U7XHJcbiAgICAgICAgdm0uaGlkZSA9ICRtZERpYWxvZy5oaWRlO1xyXG5cclxuICAgICAgICBpZigkc2NvcGUuc2VsZWN0ZWRJdGVtICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2bS5jYW5jaW9uID0gJHNjb3BlLnNlbGVjdGVkSXRlbTtcclxuICAgICAgICAgICAgaWYodm0uY2FuY2lvbi5kaXNjbylcclxuICAgICAgICAgICAgICAgIHZtLmNhbmNpb24uZGlzY29faWQgPSB2bS5jYW5jaW9uLmRpc2NvLmlkO1xyXG4gICAgICAgICAgICB2bS5lZGl0ID0gdHJ1ZTtcclxuICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICB2bS5jYW5jaW9uID0gbmV3IENhbmNpb24oKTtcclxuXHJcbiAgICAgICAgLyoqKioqKipmdW5jdGlvbnMqKioqKioqL1xyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpe1xyXG4gICAgICAgICAgICB2bS5hdHRlbXB0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYoISRzY29wZS5mb3JtLiR2YWxpZClcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJpc1ZhbGlkXCIpO1xyXG5cclxuICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IHRydWU7XHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyh2bS5maWxlQ2hhbmdlZCk7XHJcbiAgICAgICAgICAgIGlmKHZtLmZpbGVDaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgdXBsb2FkQW5kU2F2ZSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmKHZtLmVkaXQpXHJcbiAgICAgICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaWxlQ2hhbmdlKCl7XHJcbiAgICAgICAgICAgIHZtLmZpbGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRBbmRTYXZlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcInVwbG9hZFwiKTtcclxuICAgICAgICAgICAgVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICRyb290U2NvcGUudXBsb2FkX3VybCxcclxuICAgICAgICAgICAgICAgIGZpbGU6IHZtLmNhbmNpb24uYXVkaW9fc291cmNlXHJcbiAgICAgICAgICAgIH0pLnByb2dyZXNzKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgICAgIHZtLnByb2dyZXNzID0gcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKTtcclxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIHZtLmNhbmNpb24uYXVkaW9fc291cmNlID0gZGF0YS51cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5maWxlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcz0wO1xyXG4gICAgICAgICAgICAgICAgaWYodm0uZWRpdClcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KGRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdm0ucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICAgICAgICAgIENhbmNpb24uc2F2ZSh2bS5jYW5jaW9uKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSwgYWxnbywgYWxnbzIpIHtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFsZ28pO1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coYWxnbzIpO1xyXG4gICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChcIk51ZXZhIGNhbmNpb24gZ3VhcmRhZG9cIikpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgQ2FuY2lvbi51cGRhdGUoe2lkOiB2bS5jYW5jaW9uLmlkfSwgdm0uY2FuY2lvbikuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSh2bS5jYW5jaW9uKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDYW5jaW9uTGlzdENvbnRyb2xsZXInLENhbmNpb25MaXN0Q29udHJvbGxlcik7XHJcblxyXG4gICAgQ2FuY2lvbkxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCckc2NvcGUnLCAnQ2FuY2lvbicsICckbWREaWFsb2cnLCckbWRUb2FzdCcsICckc3RhdGVQYXJhbXMnLCAnJHN0YXRlJyBdO1xyXG4gICAgZnVuY3Rpb24gQ2FuY2lvbkxpc3RDb250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgQ2FuY2lvbiwgJG1kRGlhbG9nLCAkbWRUb2FzdCwgJHN0YXRlUGFyYW1zLCAkc3RhdGUpe1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uY2FuY2lvbmVzID0gQ2FuY2lvbi5xdWVyeSgpO1xyXG4gICAgICAgIHZtLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHJvd0hlaWdodDogNTAsXHJcbiAgICAgICAgICAgIGZvb3RlckhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclY6IGZhbHNlLFxyXG4gICAgICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLnNob3dBZGQgPSBzaG93QWRkO1xyXG4gICAgICAgIHZtLmRlbGV0ZSA9IGRvRGVsZXRlO1xyXG4gICAgICAgIHZtLnNob3dFZGl0ID0gbmF2aWdhdGVUb0l0ZW07XHJcbiAgICAgICAgdm0uaGlkZSA9ICRtZERpYWxvZy5jYW5jZWw7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XHJcbiAgICAgICAgICAgIGlmKCRzdGF0ZVBhcmFtcy5pZCl7XHJcbiAgICAgICAgICAgICAgICBDYW5jaW9uLmdldCh7aWQ6JHN0YXRlUGFyYW1zLmlkfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0VkaXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93QWRkKGV2KXtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZENhbmNpb25Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY2FuY2lvbmVzL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2XHJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24obmV3TW9kZWwpe1xyXG4gICAgICAgICAgICAgICAgaWYobmV3TW9kZWwhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYWRkT3JVcGRhdGVMaXN0KHZtLmNhbmNpb25lcywgbmV3TW9kZWwpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZG9EZWxldGUocm93LCAkZXZlbnQpIHtcclxuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAuY29udGVudCgnRXN0YSBzZWd1cm8gcXVlIGRlc2VhIGJvcnJhciBlc3RlIGVsZW1lbnRvJylcclxuICAgICAgICAgICAgICAgIC5vaygnQm9ycmFyJylcclxuICAgICAgICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbGFyJylcclxuICAgICAgICAgICAgICAgIC50YXJnZXRFdmVudCgkZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgQ2FuY2lvbi5kZWxldGUoe2lkOiByb3cuaWR9KS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gdm0uY2FuY2lvbmVzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY2FuY2lvbmVzLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBuYXZpZ2F0ZVRvSXRlbShyb3cpe1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJjYW5jaW9uZXNcIix7aWQ6cm93LmlkfSwge25vdGlmeTpmYWxzZX0pO1xyXG4gICAgICAgICAgICBzaG93RWRpdChyb3cpO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dFZGl0KHJvdyl7XHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEl0ZW0gPSBhbmd1bGFyLmNvcHkocm93KTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gdm0uY2FuY2lvbmVzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZENhbmNpb25Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY2FuY2lvbmVzL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihlZGl0ZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWRpdGVkIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkZE9yVXBkYXRlTGlzdCh2bS5jYW5jaW9uZXMsIGVkaXRlZCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiY2FuY2lvbmVzXCIse2lkOicnfSwge25vdGlmeTpmYWxzZX0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTWF4aSBvbiA3LzMxLzIwMTUuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRDYXRlZ29yaWFDb250cm9sbGVyJyxBZGRDYXRlZ29yaWFDb250cm9sbGVyKTtcclxuICAgIEFkZENhdGVnb3JpYUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJG1kVG9hc3QnLCAnJG1kRGlhbG9nJywgJ0NhdGVnb3JpYSddO1xyXG4gICAgZnVuY3Rpb24gQWRkQ2F0ZWdvcmlhQ29udHJvbGxlcigkc2NvcGUsICRtZFRvYXN0LCAkbWREaWFsb2csIENhdGVnb3JpYSkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmNhdGVnb3JpYSA9IG51bGw7XHJcbiAgICAgICAgdm0uZWRpdCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB2bS5oaWRlID0gJG1kRGlhbG9nLmhpZGU7XHJcbiAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmF0dGVtcHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuXHJcbiAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgLyoqKioqKioqKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gYWN0aXZhdGUoKXtcclxuICAgICAgICAgICAgaWYgKCRzY29wZS5zZWxlY3RlZEl0ZW0gIT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5jYXRlZ29yaWEgPSAkc2NvcGUuc2VsZWN0ZWRJdGVtO1xyXG4gICAgICAgICAgICAgICAgdm0uZWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICAgICAgdm0uY2F0ZWdvcmlhID0gbmV3IENhdGVnb3JpYSgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3VibWl0KCkge1xyXG4gICAgICAgICAgICB2bS5hdHRlbXB0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoISRzY29wZS5mb3JtLiR2YWxpZClcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIGlmICh2bS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICAgICAgICAgIENhdGVnb3JpYS5zYXZlKHZtLmNhdGVnb3JpYSkuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoXCJOdWV2byBhZCBndWFyZGFkb1wiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgICAgICBDYXRlZ29yaWEudXBkYXRlKHtpZDogdm0uY2F0ZWdvcmlhLmlkfSwgdm0uY2F0ZWdvcmlhKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUodm0uY2F0ZWdvcmlhKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdDYXRlZ29yaWFMaXN0Q29udHJvbGxlcicsIENhdGVnb3JpYUxpc3RDb250cm9sbGVyKTtcclxuICAgIENhdGVnb3JpYUxpc3RDb250cm9sbGVyLiRpbmplY3QgPSBbJ0NhdGVnb3JpYScsICckcm9vdFNjb3BlJywnJHNjb3BlJywnJG1kRGlhbG9nJywgJyRtZFRvYXN0JywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBDYXRlZ29yaWFMaXN0Q29udHJvbGxlcihDYXRlZ29yaWEsJHJvb3RTY29wZSwgJHNjb3BlLCAkbWREaWFsb2csICRtZFRvYXN0LCAkc3RhdGUsICRzdGF0ZVBhcmFtcyl7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5jYXRlZ29yaWFzID0gQ2F0ZWdvcmlhLnF1ZXJ5KCk7XHJcbiAgICAgICAgdm0ub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgcm93SGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgZm9vdGVySGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgaGVhZGVySGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyVjogZmFsc2UsXHJcbiAgICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb2x1bW5Nb2RlOiAnZm9yY2UnXHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5zaG93QWRkID0gc2hvd0FkZDtcclxuICAgICAgICB2bS5kZWxldGUgPSBkb0RlbGV0ZTtcclxuICAgICAgICB2bS5zaG93RWRpdCA9IG5hdmlnYXRlVG9JdGVtO1xyXG5cclxuICAgICAgICBhY3RpdmF0ZSgpO1xyXG5cclxuICAgICAgICAvKioqKioqKioqKioqKioqKioqKioqKi9cclxuICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xyXG4gICAgICAgICAgICBpZigkc3RhdGVQYXJhbXMuaWQpe1xyXG4gICAgICAgICAgICAgICAgQ2F0ZWdvcmlhLmdldCh7aWQ6JHN0YXRlUGFyYW1zLmlkfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0VkaXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBuYXZpZ2F0ZVRvSXRlbShyb3cpe1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJjYXRlZ29yaWFzXCIse2lkOnJvdy5pZH0sIHtub3RpZnk6ZmFsc2V9KTtcclxuICAgICAgICAgICAgc2hvd0VkaXQocm93KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93QWRkKGV2KSB7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRDYXRlZ29yaWFDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY2F0ZWdvcmlhcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldlxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChuZXdFdmVudCkge1xyXG4gICAgICAgICAgICAgICAgaWYgKG5ld0V2ZW50ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgdm0uY2F0ZWdvcmlhcy5wdXNoKG5ld0V2ZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gZG9EZWxldGUocm93LCAkZXZlbnQpIHtcclxuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAuY29udGVudCgnRXN0YSBzZWd1cm8gcXVlIGRlc2VhIGJvcnJhciBlc3RlIGVsZW1lbnRvJylcclxuICAgICAgICAgICAgICAgIC5vaygnQm9ycmFyJylcclxuICAgICAgICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbGFyJylcclxuICAgICAgICAgICAgICAgIC50YXJnZXRFdmVudCgkZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgQ2F0ZWdvcmlhLmRlbGV0ZSh7aWQ6IHJvdy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB2bS5jYXRlZ29yaWFzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uY2F0ZWdvcmlhcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd0VkaXQocm93KSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEl0ZW0gPSByb3c7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZtLmNhdGVnb3JpYXMuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkQ2F0ZWdvcmlhQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6J3ZtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvY2F0ZWdvcmlhcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24oZWRpdGVkKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYmFja1wiLCBlZGl0ZWQpO1xyXG4gICAgICAgICAgICAgICAgaWYoZWRpdGVkIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkZE9yVXBkYXRlTGlzdCh2bS5jYXRlZ29yaWFzLCBlZGl0ZWQsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImNhdGVnb3JpYXNcIix7aWQ6Jyd9LCB7bm90aWZ5OmZhbHNlfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQ3VlbnRvQ29udHJvbGxlcicsWyckc2NvcGUnLCAnQ3VlbnRvJywgJyRtZERpYWxvZycsJyRtZFRvYXN0JyxcclxuICAgICAgICBmdW5jdGlvbigkc2NvcGUsIEN1ZW50bywgJG1kRGlhbG9nLCAkbWRUb2FzdCl7XHJcbiAgICAgICAgICAgIHZhciBkYXRhO1xyXG5cclxuICAgICAgICAgICAgQ3VlbnRvLnF1ZXJ5KCkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuY3VlbnRvcyA9IGRhdGEgPSByZXNwb25zZTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jdWVudG9zKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlID0gJG1kRGlhbG9nLmhpZGU7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgICAgIHJvd0hlaWdodDogJ2F1dG8nLFxyXG4gICAgICAgICAgICAgICAgZm9vdGVySGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXJWOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlcnMgPSB7XHJcbiAgICAgICAgICAgICAgICBhcHJvYmFkb3M6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgcGVuZGllbnRlczogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICByZWNoYXphZG9zOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlciA9IGZ1bmN0aW9uKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgY29uc29sZS5sb2coXCJmaWx0ZXJpbmdcIik7XHJcbiAgICAgICAgICAgICAgICBpZighZGF0YSlyZXR1cm47XHJcbiAgICAgICAgICAgICAgICBpZighJHNjb3BlLmZpbHRlcnMuYXByb2JhZG9zICYmISRzY29wZS5maWx0ZXJzLnBlbmRpZW50ZXMgJiYgISRzY29wZS5maWx0ZXJzLnJlY2hhemFkb3MpXHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmN1ZW50b3MgPSBkYXRhO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jdWVudG9zID0gZGF0YS5maWx0ZXIoZnVuY3Rpb24oZCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgYXByb2JhZG8gPSBkLmFwcm9iYWRvO1xyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKGFwcm9iYWRvKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0b3JubyA9ICRzY29wZS5maWx0ZXJzLmFwcm9iYWRvcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YXIgcmV0b3JubyA9ICRzY29wZS5maWx0ZXJzLnJlY2hhemFkb3M7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjYXNlIC0xOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciByZXRvcm5vID0gJHNjb3BlLmZpbHRlcnMucGVuZGllbnRlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0b3JubztcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKCRzY29wZS5jdWVudG9zKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS4kd2F0Y2goJ2ZpbHRlcnMnLCAkc2NvcGUuZmlsdGVyICwgdHJ1ZSk7XHJcbiAgICAgICAgICAgICRzY29wZS5kZWxldGUgPSBkb0RlbGV0ZTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gZG9EZWxldGUocm93LCAkZXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNvbnRlbnQoJ0VzdGEgc2VndXJvIHF1ZSBkZXNlYSBib3JyYXIgZXN0ZSBlbGVtZW50bycpXHJcbiAgICAgICAgICAgICAgICAgICAgLm9rKCdCb3JyYXInKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbGFyJylcclxuICAgICAgICAgICAgICAgICAgICAudGFyZ2V0RXZlbnQoJGV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAgICAgQ3VlbnRvLmRlbGV0ZSh7aWQ6IHJvdy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICRzY29wZS5jdWVudG9zLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5jdWVudG9zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmFwcHJvdmUgPSBmdW5jdGlvbihyb3csIGlzQXBwcm92ZWQsICRldmVudCl7XHJcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImFwcm9iYXJcIiwgcm93KTtcclxuICAgICAgICAgICAgICAgIHJvdy5hcHJvYmFkbyA9IGlzQXBwcm92ZWQgPyAxIDogMDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5maWx0ZXIoKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIEN1ZW50by51cGRhdGUoe2lkOiByb3cuaWR9LCByb3cpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUocm93KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd0VkaXQgPSBmdW5jdGlvbihyb3cpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkSXRlbSA9IHJvdztcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2N1ZW50b3MvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6IFNob3dDdWVudG9Db250cm9sbGVyXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIFNob3dDdWVudG9Db250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKXtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU5JVFwiKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jdWVudG8gPSAkc2NvcGUuc2VsZWN0ZWRJdGVtO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgXSk7XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTWF4aSBvbiA3LzMxLzIwMTUuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0NvbWVudGFyaW9Db250cm9sbGVyJyxbJyRzY29wZScsICdDb21lbnRhcmlvJywgJyRtZERpYWxvZycsJyRtZFRvYXN0JyxcclxuICAgICAgICBmdW5jdGlvbigkc2NvcGUsIENvbWVudGFyaW8sICRtZERpYWxvZywgJG1kVG9hc3Qpe1xyXG4gICAgICAgICAgICB2YXIgZGF0YTtcclxuXHJcbiAgICAgICAgICAgIENvbWVudGFyaW8ucXVlcnkoKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXskc2NvcGUuY29tZW50YXJpb3MgPSBkYXRhID0gcmVzcG9uc2U7JHNjb3BlLmZpbHRlcigpO30pO1xyXG4gICAgICAgICAgICAkc2NvcGUuaGlkZSA9ICRtZERpYWxvZy5oaWRlO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICByb3dIZWlnaHQ6ICdhdXRvJyxcclxuICAgICAgICAgICAgICAgIGZvb3RlckhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyVjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbHVtbk1vZGU6ICdmb3JjZSdcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5maWx0ZXJzID0ge1xyXG4gICAgICAgICAgICAgICAgYXByb2JhZG9zOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHBlbmRpZW50ZXM6IHRydWUsXHJcbiAgICAgICAgICAgICAgICByZWNoYXphZG9zOiBmYWxzZVxyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlciA9IGZ1bmN0aW9uKG5ld1ZhbCkge1xyXG4gICAgICAgICAgICAgICAgaWYoIWRhdGEpcmV0dXJuO1xyXG4gICAgICAgICAgICAgICAgaWYoISRzY29wZS5maWx0ZXJzLmFwcm9iYWRvcyAmJiEkc2NvcGUuZmlsdGVycy5wZW5kaWVudGVzICYmICEkc2NvcGUuZmlsdGVycy5yZWNoYXphZG9zKVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21lbnRhcmlvcyA9IFtdO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5jb21lbnRhcmlvcyA9IGRhdGEuZmlsdGVyKGZ1bmN0aW9uKGQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFwcm9iYWRvID0gZC5hcHJvYmFkbztcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIHJldG9ybm8gPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgc3dpdGNoKGFwcm9iYWRvKXtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNhc2UgMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRvcm5vID0gJHNjb3BlLmZpbHRlcnMuYXByb2JhZG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAwOlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHJldG9ybm8gPSAkc2NvcGUuZmlsdGVycy5yZWNoYXphZG9zO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2FzZSAtMTpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICByZXRvcm5vID0gJHNjb3BlLmZpbHRlcnMucGVuZGllbnRlcztcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcclxuICAgICAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gcmV0b3JubztcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuJHdhdGNoKCdmaWx0ZXJzJywgJHNjb3BlLmZpbHRlciAsIHRydWUpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uKHJvdywgJGV2ZW50KXtcclxuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgQ29tZW50YXJpby5kZWxldGUoe2lkOnJvdy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkc2NvcGUuY29tZW50YXJpb3MuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuY29tZW50YXJpb3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuYXBwcm92ZSA9IGZ1bmN0aW9uKHJvdywgaXNBcHByb3ZlZCwgJGV2ZW50KXtcclxuICAgICAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiYXByb2JhclwiLCByb3cpO1xyXG4gICAgICAgICAgICAgICAgcm93LmFwcm9iYWRvID0gaXNBcHByb3ZlZCA/IDEgOiAwO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZpbHRlcigpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgQ29tZW50YXJpby51cGRhdGUoe2lkOiByb3cuaWR9LCByb3cpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUocm93KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd0VkaXQgPSBmdW5jdGlvbihyb3cpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkSXRlbSA9IHJvdztcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2NvbWVudGFyaW9zL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKSxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiBTaG93Q29tZW50YXJpb0NvbnRyb2xsZXJcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gU2hvd0NvbWVudGFyaW9Db250cm9sbGVyKCRzY29wZSwgJG1kRGlhbG9nKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5jb21lbnRhcmlvID0gJHNjb3BlLnNlbGVjdGVkSXRlbTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiSU5JVFwiLCAkc2NvcGUuY29tZW50YXJpbyk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZERpc2NvQ29udHJvbGxlcicsIEFkZERpc2NvQ29udHJvbGxlcik7XHJcbiAgICBBZGREaXNjb0NvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsICckc2NvcGUnLCAnJG1kVG9hc3QnLCAnJG1kRGlhbG9nJywgJ0Rpc2NvJywgJ1VwbG9hZCddXHJcblxyXG4gICAgZnVuY3Rpb24gQWRkRGlzY29Db250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgJG1kVG9hc3QsICRtZERpYWxvZywgRGlzY28sIFVwbG9hZCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgdm0uaGlkZSA9ICRtZERpYWxvZy5oaWRlO1xyXG4gICAgICAgIHZtLmVkaXQgPSBmYWxzZTtcclxuICAgICAgICB2bS5kaXNjbyA9IG51bGw7XHJcbiAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgIHZtLmF0dGVtcHRlZCA9IGZhbHNlO1xyXG4gICAgICAgIHZtLnByb2dyZXNzID0gMDtcclxuICAgICAgICB2bS5maWxlQ2hhbmdlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICB2bS5maWxlQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5maWxlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuICAgICAgICB2bS5zdWJtaXQgPSBzdWJtaXQ7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCkge1xyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLnNlbGVjdGVkSXRlbSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgIHZtLmRpc2NvID0gJHNjb3BlLnNlbGVjdGVkSXRlbTtcclxuICAgICAgICAgICAgICAgIHZtLmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgICAgIHZtLmRpc2NvID0gbmV3IERpc2NvKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzdWJtaXQoKSB7XHJcbiAgICAgICAgICAgIHZtLmF0dGVtcHRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICghJHNjb3BlLmZvcm0uJHZhbGlkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgdm0uc3VibWl0dGluZz10cnVlO1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbGVDaGFuZ2VkXCIsIHZtLmZpbGVDaGFuZ2VkKTtcclxuICAgICAgICAgICAgaWYgKHZtLmZpbGVDaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgdXBsb2FkQW5kU2F2ZSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh2bS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICAgICAgICAgIHZtLmRpc2NvLiRzYXZlKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUodm0uZGlzY28pO1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KFwiTnVldm8gZGlzY28gZ3VhcmRhZG9cIikpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5kYXRhLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRBbmRTYXZlKCkge1xyXG4gICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICRyb290U2NvcGUudXBsb2FkX3VybCxcclxuICAgICAgICAgICAgICAgIGZpbGU6IHZtLmRpc2NvLmNvdmVyX2ltZ1xyXG4gICAgICAgICAgICB9KS5wcm9ncmVzcyhmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcyA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XHJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5kaXNjby5jb3Zlcl9pbWcgPSBkYXRhLnVybDtcclxuICAgICAgICAgICAgICAgIHZtLmZpbGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIHZtLnByb2dyZXNzID0gMDtcclxuICAgICAgICAgICAgICAgIGlmICh2bS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoZGF0YS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgICAgICBEaXNjby51cGRhdGUoe2lkOiB2bS5kaXNjby5pZH0sIHZtLmRpc2NvKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUodm0uZGlzY28pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdEaXNjb0xpc3RDb250cm9sbGVyJyxEaXNjb0xpc3RDb250cm9sbGVyKTtcclxuICAgIERpc2NvTGlzdENvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywgJyRyb290U2NvcGUnLCckc3RhdGUnLCAnRGlzY28nLCAnJG1kRGlhbG9nJywnJG1kVG9hc3QnLCAnJHN0YXRlUGFyYW1zJ107XHJcbiAgICBmdW5jdGlvbiBEaXNjb0xpc3RDb250cm9sbGVyKCRzY29wZSwkcm9vdFNjb3BlLCAkc3RhdGUsIERpc2NvLCAkbWREaWFsb2csICRtZFRvYXN0LCRzdGF0ZVBhcmFtcyl7XHJcbiAgICAgICAgdmFyIHZtID0gdGhpcztcclxuICAgICAgICB2bS5kaXNjb3MgPSBEaXNjby5xdWVyeSgpO1xyXG4gICAgICAgIHZtLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHJvd0hlaWdodDogNTAsXHJcbiAgICAgICAgICAgIGZvb3RlckhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclY6IGZhbHNlLFxyXG4gICAgICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLnNob3dBZGQgPSBzaG93QWRkO1xyXG4gICAgICAgIHZtLmRlbGV0ZSA9IGRvRGVsZXRlO1xyXG4gICAgICAgIHZtLnNob3dFZGl0ID0gbmF2aWdhdGVUb0l0ZW07XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XHJcbiAgICAgICAgICAgIGlmKCRzdGF0ZVBhcmFtcy5pZCl7XHJcbiAgICAgICAgICAgICAgICBEaXNjby5nZXQoe2lkOiRzdGF0ZVBhcmFtcy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgIHNob3dFZGl0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfTtcclxuICAgICAgICBmdW5jdGlvbiBuYXZpZ2F0ZVRvSXRlbShyb3cpe1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJkaXNjb3NcIix7aWQ6cm93LmlkfSwge25vdGlmeTpmYWxzZX0pO1xyXG4gICAgICAgICAgICBzaG93RWRpdChyb3cpO1xyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93QWRkKGV2KSB7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGREaXNjb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9kaXNjb3MvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXZcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobmV3RXZlbnQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdFdmVudCAhPT0gdW5kZWZpbmVkKVxyXG4gICAgICAgICAgICAgICAgICAgIHZtLmRpc2Nvcy5wdXNoKG5ld0V2ZW50KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBkb0RlbGV0ZShyb3csICRldmVudCkge1xyXG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcclxuICAgICAgICAgICAgICAgIC5jb250ZW50KCdFc3RhIHNlZ3VybyBxdWUgZGVzZWEgYm9ycmFyIGVzdGUgZWxlbWVudG8nKVxyXG4gICAgICAgICAgICAgICAgLm9rKCdCb3JyYXInKVxyXG4gICAgICAgICAgICAgICAgLmNhbmNlbCgnQ2FuY2VsYXInKVxyXG4gICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KCRldmVudCk7XHJcblxyXG4gICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBOb3RpY2lhLmRlbGV0ZSh7aWQ6cm93LmlkfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5tZXNzYWdlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHZtLmRpc2Nvcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZtLmRpc2Nvcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNob3dFZGl0KHJvdykge1xyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRJdGVtID0gcm93O1xyXG4gICAgICAgICAgICB2YXIgaW5kZXggPSB2bS5kaXNjb3MuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnQWRkRGlzY29Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvZGlzY29zL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihlZGl0ZWQpe1xyXG4gICAgICAgICAgICAgICAgaWYoZWRpdGVkIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkZE9yVXBkYXRlTGlzdCh2bS5kaXNjb3MsIGVkaXRlZCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiZGlzY29zXCIse2lkOicnfSwge25vdGlmeTpmYWxzZX0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcbiAgICB9O1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudG9MaXN0Q29udHJvbGxlcicsWyckc2NvcGUnLCAnRXZlbnRvJywgJyRtZERpYWxvZycsJyRtZFRvYXN0JyxcclxuICAgICAgICBmdW5jdGlvbigkc2NvcGUsIEV2ZW50bywgJG1kRGlhbG9nLCAkbWRUb2FzdCl7XHJcbiAgICAgICAgICAgICRzY29wZS5ldmVudG9zID0gRXZlbnRvLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgICRzY29wZS5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgcm93SGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgICAgIGZvb3RlckhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyVjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbHVtbk1vZGU6ICdmb3JjZSdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dBZGQgPSBmdW5jdGlvbihldil7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEV2ZW50b0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvZXZlbnRvcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2XHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKG5ld0V2ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICBpZihuZXdFdmVudCE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuZmVjaGEgPSBuZXcgRGF0ZShuZXdFdmVudC5mZWNoYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ldmVudG9zLnB1c2gobmV3RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZGVsZXRlID0gZnVuY3Rpb24ocm93LCAkZXZlbnQpe1xyXG4gICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBFdmVudG8uZGVsZXRlKHtpZDpyb3cuaWR9KS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJHNjb3BlLmV2ZW50b3MuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZXZlbnRvcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNob3dFZGl0ID0gZnVuY3Rpb24ocm93KXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEl0ZW0gPSByb3c7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEV2ZW50b0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvZXZlbnRvcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG5cclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkRXZlbnRvQ29udHJvbGxlcicsWyckcm9vdFNjb3BlJywnJHNjb3BlJywnJG1kVG9hc3QnLCAnJG1kRGlhbG9nJywgJ0V2ZW50bycsJ1VwbG9hZCcsXHJcbiAgICAgICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCRtZFRvYXN0LCAkbWREaWFsb2csIEV2ZW50bywgVXBsb2FkKXtcclxuICAgICAgICAgICAgaWYoJHNjb3BlLnNlbGVjdGVkSXRlbSE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmV2ZW50byA9ICRzY29wZS5zZWxlY3RlZEl0ZW07XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXZlbnRvLmZlY2hhID0gbmV3IERhdGUoJHNjb3BlLmV2ZW50by5mZWNoYSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXZlbnRvID0gbmV3IEV2ZW50bygpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmhpZGUgPSBmdW5jdGlvbigpIHtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYXR0ZW1wdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hdHRlbXB0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYoISRzY29wZS5mb3JtLiR2YWxpZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLmZpbGVDaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEFuZFNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoJHNjb3BlLmVkaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ldmVudG8uJHNhdmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoJHNjb3BlLmV2ZW50byk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoXCJOdWV2byBldmVudG8gZ3VhcmRhZG9cIikpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICAkc2NvcGUuZmlsZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHNjb3BlLmZpbGVDaGFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBsb2FkQW5kU2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJHJvb3RTY29wZS51cGxvYWRfdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGU6ICRzY29wZS5ldmVudG8uaW1hZ2VuXHJcbiAgICAgICAgICAgICAgICB9KS5wcm9ncmVzcyhmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKTtcclxuICAgICAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmV2ZW50by5pbWFnZW4gPSBkYXRhLnVybDtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLmVkaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KGRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gMDtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgICAgICBFdmVudG8udXBkYXRlKHtpZDogJHNjb3BlLmV2ZW50by5pZH0sICRzY29wZS5ldmVudG8pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUoJHNjb3BlLmV2ZW50byk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdFdmVudG9MaXN0Q29udHJvbGxlcicsWyckc2NvcGUnLCAnRXZlbnRvJywgJyRtZERpYWxvZycsJyRtZFRvYXN0JyxcclxuICAgICAgICBmdW5jdGlvbigkc2NvcGUsIEV2ZW50bywgJG1kRGlhbG9nLCAkbWRUb2FzdCl7XHJcbiAgICAgICAgICAgICRzY29wZS5ldmVudG9zID0gRXZlbnRvLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgICRzY29wZS5vcHRpb25zID0ge1xyXG4gICAgICAgICAgICAgICAgcm93SGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgICAgIGZvb3RlckhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBoZWFkZXJIZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICAgICAgc2Nyb2xsYmFyVjogZmFsc2UsXHJcbiAgICAgICAgICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGNvbHVtbk1vZGU6ICdmb3JjZSdcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dBZGQgPSBmdW5jdGlvbihldil7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEV2ZW50b0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvZXZlbnRvcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICAgICAgdGFyZ2V0RXZlbnQ6IGV2XHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKG5ld0V2ZW50KXtcclxuICAgICAgICAgICAgICAgICAgICBpZihuZXdFdmVudCE9PSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbmV3RXZlbnQuZmVjaGEgPSBuZXcgRGF0ZShuZXdFdmVudC5mZWNoYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ldmVudG9zLnB1c2gobmV3RXZlbnQpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuZGVsZXRlID0gZG9EZWxldGU7XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGRvRGVsZXRlKHJvdywgJGV2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxyXG4gICAgICAgICAgICAgICAgICAgIC5jb250ZW50KCdFc3RhIHNlZ3VybyBxdWUgZGVzZWEgYm9ycmFyIGVzdGUgZWxlbWVudG8nKVxyXG4gICAgICAgICAgICAgICAgICAgIC5vaygnQm9ycmFyJylcclxuICAgICAgICAgICAgICAgICAgICAuY2FuY2VsKCdDYW5jZWxhcicpXHJcbiAgICAgICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KCRldmVudCk7XHJcblxyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgICAgIEV2ZW50by5kZWxldGUoe2lkOnJvdy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICRzY29wZS5ldmVudG9zLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ldmVudG9zLnNwbGljZShpbmRleCwgMSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zaG93RWRpdCA9IGZ1bmN0aW9uKHJvdyl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRJdGVtID0gcm93O1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRFdmVudG9Db250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL2V2ZW50b3MvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxuXHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkZEV2ZW50b0NvbnRyb2xsZXInLFsnJHJvb3RTY29wZScsJyRzY29wZScsJyRtZFRvYXN0JywgJyRtZERpYWxvZycsICdFdmVudG8nLCdVcGxvYWQnLFxyXG4gICAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsICRzY29wZSwkbWRUb2FzdCwgJG1kRGlhbG9nLCBFdmVudG8sIFVwbG9hZCl7XHJcbiAgICAgICAgICAgIGlmKCRzY29wZS5zZWxlY3RlZEl0ZW0hPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ldmVudG8gPSAkc2NvcGUuc2VsZWN0ZWRJdGVtO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmV2ZW50by5mZWNoYSA9IG5ldyBEYXRlKCRzY29wZS5ldmVudG8uZmVjaGEpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmVkaXQgPSB0cnVlO1xyXG4gICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmV2ZW50byA9IG5ldyBFdmVudG8oKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHNjb3BlLmF0dGVtcHRlZCA9IGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdCA9IGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuYXR0ZW1wdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmKCEkc2NvcGUuZm9ybS4kdmFsaWQpXHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgICAgIGlmKCRzY29wZS5maWxlQ2hhbmdlZClcclxuICAgICAgICAgICAgICAgICAgICB1cGxvYWRBbmRTYXZlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlIGlmKCRzY29wZS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZXZlbnRvLiRzYXZlKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCRzY29wZS5ldmVudG8pO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KFwiTnVldm8gZXZlbnRvIGd1YXJkYWRvXCIpKTtcclxuICAgICAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5kYXRhLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gMDtcclxuICAgICAgICAgICAgJHNjb3BlLmZpbGVDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgICAgICRzY29wZS5maWxlQ2hhbmdlID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5maWxlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIH07XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIHVwbG9hZEFuZFNhdmUoKSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgICAgICB1cmw6ICRyb290U2NvcGUudXBsb2FkX3VybCxcclxuICAgICAgICAgICAgICAgICAgICBmaWxlOiAkc2NvcGUuZXZlbnRvLmltYWdlblxyXG4gICAgICAgICAgICAgICAgfSkucHJvZ3Jlc3MoZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ldmVudG8uaW1hZ2VuID0gZGF0YS51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzY29wZS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChkYXRhLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgICAgICAgICAgRXZlbnRvLnVwZGF0ZSh7aWQ6ICRzY29wZS5ldmVudG8uaWR9LCAkc2NvcGUuZXZlbnRvKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCRzY29wZS5ldmVudG8pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkSW50ZWdyYW50ZUNvbnRyb2xsZXInLCBBZGRJbnRlZ3JhbnRlQ29udHJvbGxlcik7XHJcblxyXG4gICAgQWRkSW50ZWdyYW50ZUNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHNjb3BlJywnJHJvb3RTY29wZScsJyRtZFRvYXN0JywgJyRtZERpYWxvZycsICdJbnRlZ3JhbnRlJywgJ0Rpc2NvJywgJ1VwbG9hZCddO1xyXG5cclxuICAgIGZ1bmN0aW9uIEFkZEludGVncmFudGVDb250cm9sbGVyKCRzY29wZSwgJHJvb3RTY29wZSwkbWRUb2FzdCwgJG1kRGlhbG9nLCBJbnRlZ3JhbnRlLCBEaXNjbywgVXBsb2FkKXtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmVkaXQgPSBmYWxzZTtcclxuICAgICAgICB2bS5kaXNjb3MgPSBEaXNjby5xdWVyeSgpO1xyXG4gICAgICAgIHZtLnByb2dyZXNzID0gMDtcclxuICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdm0uZmlsZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICB2bS5hdHRlbXB0ZWQgPSBmYWxzZTtcclxuXHJcbiAgICAgICAgdm0uc3VibWl0ID0gc3VibWl0O1xyXG4gICAgICAgIHZtLmZpbGVDaGFuZ2UgPSBmaWxlQ2hhbmdlO1xyXG4gICAgICAgIHZtLmhpZGUgPSAkbWREaWFsb2cuaGlkZTtcclxuXHJcbiAgICAgICAgaWYoJHNjb3BlLnNlbGVjdGVkSXRlbSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgdm0uaW50ZWdyYW50ZSA9ICRzY29wZS5zZWxlY3RlZEl0ZW07XHJcbiAgICAgICAgICAgIHZtLmVkaXQgPSB0cnVlO1xyXG4gICAgICAgIH1lbHNlXHJcbiAgICAgICAgICAgIHZtLmludGVncmFudGUgPSBuZXcgSW50ZWdyYW50ZSgpO1xyXG5cclxuICAgICAgICAvKioqKioqKmZ1bmN0aW9ucyoqKioqKiovXHJcbiAgICAgICAgZnVuY3Rpb24gc3VibWl0KCl7XHJcbiAgICAgICAgICAgIHZtLmF0dGVtcHRlZCA9IHRydWU7XHJcbiAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZighJHNjb3BlLmZvcm0uJHZhbGlkKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xyXG5cclxuICAgICAgICAgICAgaWYodm0uZmlsZUNoYW5nZWQpXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRBbmRTYXZlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYodm0uZWRpdClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbGVDaGFuZ2UoKXtcclxuICAgICAgICAgICAgdm0uZmlsZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwbG9hZEFuZFNhdmUoKSB7XHJcbiAgICAgICAgICAgIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAkcm9vdFNjb3BlLnVwbG9hZF91cmwsXHJcbiAgICAgICAgICAgICAgICBmaWxlOiB2bS5pbnRlZ3JhbnRlLmltYWdlblxyXG4gICAgICAgICAgICB9KS5wcm9ncmVzcyhmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcyA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XHJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5pbnRlZ3JhbnRlLmltYWdlbiA9IGRhdGEudXJsO1xyXG4gICAgICAgICAgICAgICAgdm0uZmlsZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdm0ucHJvZ3Jlc3M9MDtcclxuICAgICAgICAgICAgICAgIGlmKHZtLmVkaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChkYXRhLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHZtLnByb2dyZXNzID0gMDtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiBzYXZlKCkge1xyXG4gICAgICAgICAgICBJbnRlZ3JhbnRlLnNhdmUodm0uaW50ZWdyYW50ZSkuJHByb21pc2UudGhlbihmdW5jdGlvbiAocmVzcG9uc2UsIGFsZ28sIGFsZ28yKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhhbGdvKTtcclxuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKGFsZ28yKTtcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5lcnJvcikge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICB9IGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoXCJOdWV2YSBpbnRlZ3JhbnRlIGd1YXJkYWRvXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgIEludGVncmFudGUudXBkYXRlKHtpZDogdm0uaW50ZWdyYW50ZS5pZH0sIHZtLmludGVncmFudGUpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUodm0uaW50ZWdyYW50ZSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignSW50ZWdyYW50ZUxpc3RDb250cm9sbGVyJyxJbnRlZ3JhbnRlTGlzdENvbnRyb2xsZXIpO1xyXG5cclxuICAgIEludGVncmFudGVMaXN0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywnJHNjb3BlJywgJ0ludGVncmFudGUnLCAnJG1kRGlhbG9nJywnJG1kVG9hc3QnLCAnJHN0YXRlUGFyYW1zJywgJyRzdGF0ZScgXTtcclxuICAgIGZ1bmN0aW9uIEludGVncmFudGVMaXN0Q29udHJvbGxlcigkcm9vdFNjb3BlLCAkc2NvcGUsIEludGVncmFudGUsICRtZERpYWxvZywgJG1kVG9hc3QsICRzdGF0ZVBhcmFtcywgJHN0YXRlKXtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG4gICAgICAgIHZtLmludGVncmFudGVzID0gSW50ZWdyYW50ZS5xdWVyeSgpO1xyXG4gICAgICAgIHZtLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHJvd0hlaWdodDogNTAsXHJcbiAgICAgICAgICAgIGZvb3RlckhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclY6IGZhbHNlLFxyXG4gICAgICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLnNob3dBZGQgPSBzaG93QWRkO1xyXG4gICAgICAgIHZtLmRlbGV0ZSA9IGRvRGVsZXRlO1xyXG4gICAgICAgIHZtLnNob3dFZGl0ID0gbmF2aWdhdGVUb0l0ZW07XHJcbiAgICAgICAgdm0uaGlkZSA9ICRtZERpYWxvZy5jYW5jZWw7XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XHJcbiAgICAgICAgICAgIGlmKCRzdGF0ZVBhcmFtcy5pZCl7XHJcbiAgICAgICAgICAgICAgICBJbnRlZ3JhbnRlLmdldCh7aWQ6JHN0YXRlUGFyYW1zLmlkfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgc2hvd0VkaXQocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93QWRkKGV2KXtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEludGVncmFudGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaW50ZWdyYW50ZXMvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXZcclxuICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihuZXdNb2RlbCl7XHJcbiAgICAgICAgICAgICAgICBpZihuZXdNb2RlbCE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hZGRPclVwZGF0ZUxpc3Qodm0uaW50ZWdyYW50ZXMsIG5ld01vZGVsKVxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBkb0RlbGV0ZShyb3csICRldmVudCkge1xyXG4gICAgICAgICAgICAkZXZlbnQucHJldmVudERlZmF1bHQoKTtcclxuICAgICAgICAgICAgJGV2ZW50LnN0b3BQcm9wYWdhdGlvbigpO1xyXG4gICAgICAgICAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcclxuICAgICAgICAgICAgICAgIC5jb250ZW50KCdFc3RhIHNlZ3VybyBxdWUgZGVzZWEgYm9ycmFyIGVzdGUgZWxlbWVudG8nKVxyXG4gICAgICAgICAgICAgICAgLm9rKCdCb3JyYXInKVxyXG4gICAgICAgICAgICAgICAgLmNhbmNlbCgnQ2FuY2VsYXInKVxyXG4gICAgICAgICAgICAgICAgLnRhcmdldEV2ZW50KCRldmVudCk7XHJcblxyXG4gICAgICAgICAgICAkbWREaWFsb2cuc2hvdyhjb25maXJtKS50aGVuKGZ1bmN0aW9uKCl7XHJcbiAgICAgICAgICAgICAgICBJbnRlZ3JhbnRlLmRlbGV0ZSh7aWQ6cm93LmlkfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYocmVzcG9uc2UuZXJyb3IpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5tZXNzYWdlKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9IHZtLmludGVncmFudGVzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdm0uaW50ZWdyYW50ZXMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIG5hdmlnYXRlVG9JdGVtKHJvdyl7XHJcbiAgICAgICAgICAgICRzdGF0ZS5nbyhcImludGVncmFudGVzXCIse2lkOnJvdy5pZH0sIHtub3RpZnk6ZmFsc2V9KTtcclxuICAgICAgICAgICAgc2hvd0VkaXQocm93KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBmdW5jdGlvbiBzaG93RWRpdChyb3cpe1xyXG4gICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRJdGVtID0gYW5ndWxhci5jb3B5KHJvdyk7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZtLmludGVncmFudGVzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEludGVncmFudGVDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvaW50ZWdyYW50ZXMvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKGVkaXRlZCl7XHJcbiAgICAgICAgICAgICAgICBpZihlZGl0ZWQhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYWRkT3JVcGRhdGVMaXN0KHZtLmludGVncmFudGVzLCBlZGl0ZWQsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcImludGVncmFudGVzXCIse2lkOicnfSwge25vdGlmeTpmYWxzZX0pO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGROb3RpY2lhQ29udHJvbGxlcicsWyckcm9vdFNjb3BlJywnJHNjb3BlJywnJG1kVG9hc3QnLCAnJG1kRGlhbG9nJywgJ05vdGljaWEnLCdDYXRlZ29yaWEnLCdWaWRlbycsJ0NhbmNpb24nLCdBZCcsICdVcGxvYWQnLCdUYWcnLFxyXG4gICAgICAgIGZ1bmN0aW9uKCRyb290U2NvcGUsJHNjb3BlLCRtZFRvYXN0LCAkbWREaWFsb2csIE5vdGljaWEsIENhdGVnb3JpYSwgVmlkZW8sIENhbmNpb24sIEFkLCBVcGxvYWQsIFRhZyl7XHJcbiAgICAgICAgICAgIGlmKCRzY29wZS5zZWxlY3RlZEl0ZW0hPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhID0gJHNjb3BlLnNlbGVjdGVkSXRlbTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhLmZlY2hhID0gbmV3IERhdGUoJHNjb3BlLm5vdGljaWEuZmVjaGEpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5vdGljaWEuY2F0ZWdvcmlhX2lkID0gJHNjb3BlLm5vdGljaWEuY2F0ZWdvcmlhc1swXS5pZDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhLnZpZGVvX2lkID0gJHNjb3BlLm5vdGljaWEudmlkZW8uaWQ7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubm90aWNpYS5jYW5jaW9uX2lkID0gJHNjb3BlLm5vdGljaWEuY2FuY2lvbi5pZDtcclxuICAgICAgICAgICAgICAgICRzY29wZS5lZGl0ID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIGlmKCEkc2NvcGUubm90aWNpYS5ub3RpY2lhYWRzWzBdKVxyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhLm5vdGljaWFhZHNbMF0gPSB7YWRfaWQ6MH07XHJcbiAgICAgICAgICAgICAgICBpZighJHNjb3BlLm5vdGljaWEubm90aWNpYWFkc1sxXSlcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUubm90aWNpYS5ub3RpY2lhYWRzWzFdID0ge2FkX2lkOjB9O1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubm90aWNpYSA9IG5ldyBOb3RpY2lhKCk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubm90aWNpYS50YWdzID0gW107XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubm90aWNpYS5ub3RpY2lhYWRzID0gW107XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUubm90aWNpYS5ub3RpY2lhYWRzWzBdID0ge2FkX2lkOjB9O1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLm5vdGljaWEubm90aWNpYWFkc1sxXSA9IHthZF9pZDowfTtcclxuICAgICAgICAgICAgfVxyXG5cclxuXHJcblxyXG4gICAgICAgICAgICBjb25zb2xlLmxvZygkc2NvcGUubm90aWNpYSk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuY2F0ZWdvcmlhcyA9IENhdGVnb3JpYS5xdWVyeSgpO1xyXG4gICAgICAgICAgICAkc2NvcGUudmlkZW9zID0gVmlkZW8ucXVlcnkoKTtcclxuICAgICAgICAgICAgJHNjb3BlLmNhbmNpb25lcyA9IENhbmNpb24ucXVlcnkoKTtcclxuICAgICAgICAgICAgJHNjb3BlLmFkcyA9IEFkLnF1ZXJ5KCk7XHJcbiAgICAgICAgICAgICRzY29wZS50YWdzID0gVGFnLnF1ZXJ5KCk7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUucG9zaWNpb25lcyA9IG5ldyBBcnJheSg2KTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5oaWRlID0gZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmZpbHRlclNpemUgPSBmdW5jdGlvbihpdGVtKXtcclxuICAgICAgICAgICAgICAgIHZhciB3YW50ZWRTaXplID0gW1wiOTcweDkwXCIsIFwiNzI4eDkwXCJdO1xyXG4gICAgICAgICAgICAgICAgdmFyIG1hdGNoZXMgPSB3YW50ZWRTaXplLmluZGV4T2YoaXRlbS5zaXplKT4tMTtcclxuICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coaXRlbS5zaXplLCB3YW50ZWRTaXplLCBtYXRjaGVzKTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBtYXRjaGVzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAkc2NvcGUuYXR0ZW1wdGVkID0gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICRzY29wZS5hdHRlbXB0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgaWYoISRzY29wZS5mb3JtLiR2YWxpZClcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgaWYoJHNjb3BlLmZpbGVDaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgICAgIHVwbG9hZEFuZFNhdmUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2UgaWYoJHNjb3BlLmVkaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gc2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhLiRzYXZlKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCRzY29wZS5ub3RpY2lhKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChcIk51ZXZhIG5vdGljaWEgZ3VhcmRhZGFcIikpO1xyXG4gICAgICAgICAgICAgICAgfSwgZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICAkc2NvcGUuZmlsZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICAgICAgJHNjb3BlLmZpbGVDaGFuZ2UgPSBmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBsb2FkQW5kU2F2ZSgpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogJHJvb3RTY29wZS51cGxvYWRfdXJsLFxyXG4gICAgICAgICAgICAgICAgICAgIGZpbGU6ICRzY29wZS5ub3RpY2lhLmltYWdlblxyXG4gICAgICAgICAgICAgICAgfSkucHJvZ3Jlc3MoZnVuY3Rpb24gKGV2dCkge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XHJcbiAgICAgICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhLmltYWdlbj0gZGF0YS51cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLmZpbGVDaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKCRzY29wZS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChkYXRhLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgICAgICAgICAgTm90aWNpYS51cGRhdGUoe2lkOiAkc2NvcGUubm90aWNpYS5pZH0sICRzY29wZS5ub3RpY2lhKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhID0gcmVzcG9uc2U7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5vdGljaWEuZmVjaGEgPSBuZXcgRGF0ZSgkc2NvcGUubm90aWNpYS5mZWNoYSk7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLm5vdGljaWEuY2F0ZWdvcmlhcyAmJiAkc2NvcGUubm90aWNpYS5jYXRlZ29yaWFzLmxlbmd0aCA+IDApXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhLmNhdGVnb3JpYV9pZCA9ICRzY29wZS5ub3RpY2lhLmNhdGVnb3JpYXNbMF0uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLm5vdGljaWEudmlkZW8pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhLnZpZGVvX2lkID0gJHNjb3BlLm5vdGljaWEudmlkZW8uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYoJHNjb3BlLm5vdGljaWEuY2FuY2lvbilcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLm5vdGljaWEuY2FuY2lvbl9pZCA9ICRzY29wZS5ub3RpY2lhLmNhbmNpb24uaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUocmVzcG9uc2UpO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICAgICAvKioqKlRBR1MgQ0hJUFMgKioqKioqKioqKi9cclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zZWFyY2hUZXh0ID0gbnVsbDtcclxuICAgICAgICAgICAgJHNjb3BlLnF1ZXJ5U2VhcmNoID0gcXVlcnlTZWFyY2g7XHJcbiAgICAgICAgICAgICRzY29wZS50YWdzID0gbG9hZFRhZ3MoKTtcclxuICAgICAgICAgICAgJHNjb3BlLnNlbGVjdGVkVGFncyA9IFtdO1xyXG4gICAgICAgICAgICAkc2NvcGUubnVtYmVyQ2hpcHMgPSBbXTtcclxuICAgICAgICAgICAgJHNjb3BlLm51bWJlckNoaXBzMiA9IFtdO1xyXG4gICAgICAgICAgICAkc2NvcGUubnVtYmVyQnVmZmVyID0gJyc7XHJcbiAgICAgICAgICAgIC8qKlxyXG4gICAgICAgICAgICAgKiBTZWFyY2ggZm9yIHRhZ3MuXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBxdWVyeVNlYXJjaCAocXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciByZXN1bHRzID0gcXVlcnkgPyAkc2NvcGUudGFncy50aGVuKGZ1bmN0aW9uKGRhdGEpe1xyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhLmZpbHRlcihjcmVhdGVGaWx0ZXJGb3IocXVlcnkpKTtcclxuICAgICAgICAgICAgICAgIH0pOiBbXTtcclxuICAgICAgICAgICAgICAgIHJldHVybiByZXN1bHRzO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICAvKlxyXG4gICAgICAgICAgICAgKiBBZGQgbmV3IHRhZyBpZiBpdCBkb2VzbnQgZXhpc3RcclxuICAgICAgICAgICAgICovXHJcbiAgICAgICAgICAgICRzY29wZS5uZXdUYWcgPSAgZnVuY3Rpb24gKGNoaXApe1xyXG4gICAgICAgICAgICAgICAgaWYoIWNoaXAubm9tYnJlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld1RhZyA9IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgbm9tYnJlOiBjaGlwXHJcbiAgICAgICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBuZXdUYWc7XHJcbiAgICAgICAgICAgICAgICB9ZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBjaGlwO1xyXG5cclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLyoqXHJcbiAgICAgICAgICAgICAqIENyZWF0ZSBmaWx0ZXIgZnVuY3Rpb24gZm9yIGEgcXVlcnkgc3RyaW5nXHJcbiAgICAgICAgICAgICAqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBjcmVhdGVGaWx0ZXJGb3IocXVlcnkpIHtcclxuICAgICAgICAgICAgICAgIHZhciBsb3dlcmNhc2VRdWVyeSA9IGFuZ3VsYXIubG93ZXJjYXNlKHF1ZXJ5KTtcclxuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbiBmaWx0ZXJGbih0YWcpIHtcclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKHRhZy5ub21icmUudG9Mb3dlckNhc2UoKS5pbmRleE9mKGxvd2VyY2FzZVF1ZXJ5KSA9PT0gMCk7XHJcbiAgICAgICAgICAgICAgICB9O1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIGZ1bmN0aW9uIGxvYWRUYWdzKCkge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIFRhZy5xdWVyeSgpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24oZGF0YSl7XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGRhdGE7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgIF0pO1xyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdOb3RpY2lhTGlzdENvbnRyb2xsZXInLFsnJHJvb3RTY29wZScsJyRzY29wZScsICdOb3RpY2lhJywgJyRtZERpYWxvZycsICckbWRUb2FzdCcsJyRzdGF0ZScsJyRzdGF0ZVBhcmFtcycsXHJcbiAgICAgICAgZnVuY3Rpb24oJHJvb3RTY29wZSwgJHNjb3BlLCBOb3RpY2lhLCAkbWREaWFsb2csICRtZFRvYXN0LCAkc3RhdGUsICRzdGF0ZVBhcmFtcyl7XHJcbiAgICAgICAgICAgICRzY29wZS5ub3RpY2lhcyA9IE5vdGljaWEucXVlcnkoKTtcclxuICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICAgICAgZm9vdGVySGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXJWOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgYWN0aXZhdGUoKTtcclxuXHJcbiAgICAgICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBhY3RpdmF0ZSgpe1xyXG4gICAgICAgICAgICAgICAgaWYoJHN0YXRlUGFyYW1zLmlkKXtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpY2lhLmdldCh7aWQ6JHN0YXRlUGFyYW1zLmlkfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNob3dFZGl0KHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHNjb3BlLnNob3dBZGQgPSBmdW5jdGlvbihldil7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZE5vdGljaWFDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL25vdGljaWFzL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXZcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24obmV3TW9kZWwpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKG5ld01vZGVsIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hZGRPclVwZGF0ZUxpc3QoJHNjb3BlLm5vdGljaWFzLCBuZXdNb2RlbCk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZSA9IGRvRGVsZXRlO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBkb0RlbGV0ZShyb3csICRldmVudCkge1xyXG4gICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcclxuICAgICAgICAgICAgICAgICAgICAuY29udGVudCgnRXN0YSBzZWd1cm8gcXVlIGRlc2VhIGJvcnJhciBlc3RlIGVsZW1lbnRvJylcclxuICAgICAgICAgICAgICAgICAgICAub2soJ0JvcnJhcicpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhbmNlbCgnQ2FuY2VsYXInKVxyXG4gICAgICAgICAgICAgICAgICAgIC50YXJnZXRFdmVudCgkZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBOb3RpY2lhLmRlbGV0ZSh7aWQ6cm93LmlkfSkuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHJlc3BvbnNlLmVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJHNjb3BlLm5vdGljaWFzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS5ub3RpY2lhcy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd0VkaXQgPSBuYXZpZ2F0ZVRvSXRlbTtcclxuICAgICAgICAgICAgZnVuY3Rpb24gbmF2aWdhdGVUb0l0ZW0ocm93KXtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm5vdGljaWFzXCIse2lkOnJvdy5pZH0sIHtub3RpZnk6ZmFsc2V9KTtcclxuICAgICAgICAgICAgICAgIHNob3dFZGl0KHJvdyk7XHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICBmdW5jdGlvbiBzaG93RWRpdChyb3cpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEl0ZW0gPSBhbmd1bGFyLmNvcHkocm93KTtcclxuICAgICAgICAgICAgICAgIDtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICRzY29wZS5ub3RpY2lhcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZE5vdGljaWFDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL25vdGljaWFzL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAoZWRpdGVkKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKGVkaXRlZCAhPSB0cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkZE9yVXBkYXRlTGlzdCgkc2NvcGUubm90aWNpYXMsIGVkaXRlZCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcIm5vdGljaWFzXCIsIHtpZDogJyd9LCB7bm90aWZ5OiBmYWxzZX0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICBdKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignQWRkQWRDb250cm9sbGVyJyxBZGRBZENvbnRyb2xsZXIpO1xyXG5cclxuICAgIEFkZEFkQ29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywnJHNjb3BlJywnJG1kVG9hc3QnLCAnJG1kRGlhbG9nJywgJ0FkJywgJ1VwbG9hZCddO1xyXG4gICAgZnVuY3Rpb24gQWRkQWRDb250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgJG1kVG9hc3QsICRtZERpYWxvZywgQWQsIFVwbG9hZCkge1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcblxyXG4gICAgICAgIHZtLmVkaXQgPSBmYWxzZTtcclxuICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdm0uYXR0ZW1wdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdm0ucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgIHZtLmZpbGVDaGFuZ2VkID0gZmFsc2U7XHJcbiAgICAgICAgdm0uc2l6ZXMgPSBbIFwiMzAweDUwXCIsXCIzMDB4MjUwXCIsIFwiMzAweDYwMFwiLCBcIjk3MHg5MFwiLFwiNzI4eDkwXCIsICBcIjgxMHg1NTBcIl07XHJcbiAgICAgICAgdm0ucG9zaWNpb25lcyA9IFsxLCAyLCAzXTtcclxuICAgICAgICB2bS5wb3NpY2lvbmVzX3RhbWFubyA9IFsnKDcyOHg5MCknLCAnKDMwMHgyNTApJywgJyg3Mjh4OTApJ107XHJcblxyXG4gICAgICAgIGlmICgkc2NvcGUuc2VsZWN0ZWRJdGVtICE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2bS5hZCA9ICRzY29wZS5zZWxlY3RlZEl0ZW07XHJcbiAgICAgICAgICAgIHZtLmVkaXQgPSB0cnVlO1xyXG4gICAgICAgIH0gZWxzZVxyXG4gICAgICAgICAgICB2bS5hZCA9IG5ldyBBZDtcclxuXHJcblxyXG4gICAgICAgIHZtLmhpZGUgPSAkbWREaWFsb2cuaGlkZTtcclxuXHJcbiAgICAgICAgdm0uc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5hdHRlbXB0ZWQgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKCEkc2NvcGUuYWRGb3JtLiR2YWxpZClcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuXHJcbiAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSB0cnVlO1xyXG5cclxuICAgICAgICAgICAgaWYgKHZtLmZpbGVDaGFuZ2VkKVxyXG4gICAgICAgICAgICAgICAgdXBsb2FkQW5kU2F2ZSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICh2bS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICB2bS5maWxlQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICB2bS5maWxlQ2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZSgpIHtcclxuICAgICAgICAgICAgdm0uYWQuJHNhdmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSh2bS5hZCk7XHJcbiAgICAgICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoXCJOdWV2byBhZCBndWFyZGFkb1wiKSk7XHJcbiAgICAgICAgICAgIH0sIGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGRhdGUoKSB7XHJcbiAgICAgICAgICAgIEFkLnVwZGF0ZSh7aWQ6IHZtLmFkLmlkfSwgdm0uYWQpLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbmlzaGVkXCIsIHJlc3BvbnNlKTtcclxuICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKHZtLmFkKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRBbmRTYXZlKCkge1xyXG4gICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICRyb290U2NvcGUudXBsb2FkX3VybCxcclxuICAgICAgICAgICAgICAgIGZpbGU6IHZtLmFkLnNvdXJjZVxyXG4gICAgICAgICAgICB9KS5wcm9ncmVzcyhmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcyA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XHJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICB2bS5hZC5zb3VyY2UgPSBkYXRhLnVybDtcclxuICAgICAgICAgICAgICAgIHZtLmFkLnR5cGUgPSBkYXRhLnR5cGU7XHJcbiAgICAgICAgICAgICAgICB2bS5maWxlQ2hhbmdlZCA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdm0ucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYgKHZtLmVkaXQpXHJcbiAgICAgICAgICAgICAgICAgICAgdXBkYXRlKCk7XHJcbiAgICAgICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgICAgICB9KS5lcnJvcihmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChkYXRhLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIHZtLnByb2dyZXNzID0gMDtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH1cclxuXHJcbiAgICB9XHJcbn0pKCk7IiwiLyoqXHJcbiAqIENyZWF0ZWQgYnkgTWF4aSBvbiA3LzMxLzIwMTUuXHJcbiAqL1xyXG4oZnVuY3Rpb24oKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcbiAgICBhbmd1bGFyLm1vZHVsZSgnYmFja2VuZEFwcC5jb250cm9sbGVycycpLmNvbnRyb2xsZXIoJ0FkTGlzdENvbnRyb2xsZXInLEFkTGlzdENvbnRyb2xsZXIpO1xyXG4gICAgQWRMaXN0Q29udHJvbGxlci4kaW5qZWN0ID0gWyckcm9vdFNjb3BlJywnJHNjb3BlJywnQWQnLCAnJG1kRGlhbG9nJywgJyRtZFRvYXN0JywgJyRzdGF0ZScsICckc3RhdGVQYXJhbXMnXTtcclxuICAgIGZ1bmN0aW9uIEFkTGlzdENvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHNjb3BlLCBBZCwgJG1kRGlhbG9nLCAkbWRUb2FzdCwgJHN0YXRlLCAkc3RhdGVQYXJhbXMpIHtcclxuICAgICAgICB2YXIgdm0gPSB0aGlzO1xyXG5cclxuICAgICAgICB2bS5hZHMgPSBBZC5xdWVyeSgpO1xyXG4gICAgICAgIHZtLnNob3dFZGl0ID0gbmF2aWdhdGVUb0l0ZW07XHJcblxyXG4gICAgICAgIHZtLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgIHJvd0hlaWdodDogXCJhdXRvXCIsXHJcbiAgICAgICAgICAgIGZvb3RlckhlaWdodDogZmFsc2UsXHJcbiAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgIHNjcm9sbGJhclY6IGZhbHNlLFxyXG4gICAgICAgICAgICBzZWxlY3RhYmxlOiBmYWxzZSxcclxuICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLnNob3dBZGQgPSBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEFkQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3Byb21vcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldlxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChuZXdPYmopIHtcclxuICAgICAgICAgICAgICAgIGlmIChuZXdPYmohPT10cnVlKVxyXG4gICAgICAgICAgICAgICAgICAgIHZtLmFkcy5wdXNoKG5ld09iaik7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGFjdGl2YXRlKCk7XHJcblxyXG4gICAgICAgIC8qKioqKioqKioqKioqKioqKioqKioqL1xyXG4gICAgICAgIGZ1bmN0aW9uIGFjdGl2YXRlKCl7XHJcbiAgICAgICAgICAgIGlmKCRzdGF0ZVBhcmFtcy5pZCl7XHJcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZygkc3RhdGVQYXJhbXMpO1xyXG4gICAgICAgICAgICAgICAgQWQuZ2V0KHtpZDokc3RhdGVQYXJhbXMuaWR9KS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICBzaG93RWRpdChyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHZtLmRlbGV0ZSA9IGRvRGVsZXRlO1xyXG4gICAgICAgIGZ1bmN0aW9uIGRvRGVsZXRlKHJvdywgJGV2ZW50KSB7XHJcbiAgICAgICAgICAgICRldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xyXG4gICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgIHZhciBjb25maXJtID0gJG1kRGlhbG9nLmNvbmZpcm0oKVxyXG4gICAgICAgICAgICAgICAgLmNvbnRlbnQoJ0VzdGEgc2VndXJvIHF1ZSBkZXNlYSBib3JyYXIgZXN0ZSBlbGVtZW50bycpXHJcbiAgICAgICAgICAgICAgICAub2soJ0JvcnJhcicpXHJcbiAgICAgICAgICAgICAgICAuY2FuY2VsKCdDYW5jZWxhcicpXHJcbiAgICAgICAgICAgICAgICAudGFyZ2V0RXZlbnQoJGV2ZW50KTtcclxuXHJcbiAgICAgICAgICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIEFkLmRlbGV0ZSh7aWQ6IHJvdy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSB2bS5hZHMuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2bS5hZHMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBuYXZpZ2F0ZVRvSXRlbShyb3cpe1xyXG4gICAgICAgICAgICAkc3RhdGUuZ28oXCJhZHNcIix7aWQ6cm93LmlkfSwge25vdGlmeTpmYWxzZX0pO1xyXG4gICAgICAgICAgICBzaG93RWRpdChyb3cpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZnVuY3Rpb24gc2hvd0VkaXQocm93KSB7XHJcbiAgICAgICAgICAgIHZhciBpbmRleCA9IHZtLmFkcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgIHJvdyA9IEFkLmdldCh7aWQ6cm93LmlkfSwgZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgIHZtLmFkc1tpbmRleF0gPSByb3c7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRJdGVtID0gYW5ndWxhci5jb3B5KHJvdyk7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZEFkQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlckFzOiAndm0nLFxyXG4gICAgICAgICAgICAgICAgICAgIHRlbXBsYXRlVXJsOiAncGFydGlhbHMvcHJvbW9zL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKVxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbihlZGl0ZWQpe1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKGVkaXRlZCE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYWRkT3JVcGRhdGVMaXN0KHZtLmFkcywgZWRpdGVkLCBpbmRleCk7XHJcbiAgICAgICAgICAgICAgICAgICAgJHN0YXRlLmdvKFwiYWRzXCIse2lkOicnfSwge25vdGlmeTpmYWxzZX0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uKCkge1xyXG4gICAgJ3VzZSBzdHJpY3QnO1xyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdTaXRlVXNlckNvbnRyb2xsZXInLFNpdGVVc2VyQ29udHJvbGxlcik7XHJcbiAgICBTaXRlVXNlckNvbnRyb2xsZXIuJGluamVjdCA9IFsnJHJvb3RTY29wZScsJyRzY29wZScsJyRtZFRvYXN0JywgJyRtZERpYWxvZycsICdTaXRlVXNlcicsJ1VwbG9hZCcsJ1VTRVJfUk9MRVMnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBTaXRlVXNlckNvbnRyb2xsZXIoJHJvb3RTY29wZSwgJHNjb3BlLCRtZFRvYXN0LCAkbWREaWFsb2csIFNpdGVVc2VyLCBVcGxvYWQsIFVTRVJfUk9MRVMpe1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgaWYoJHNjb3BlLnNlbGVjdGVkSXRlbSE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2bS51c2VyID0gJHNjb3BlLnNlbGVjdGVkSXRlbTtcclxuICAgICAgICAgICAgdm0uZWRpdCA9IHRydWU7XHJcbiAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgdm0udXNlciA9IG5ldyBTaXRlVXNlcigpO1xyXG5cclxuICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgdm0uYXR0ZW1wdGVkID0gZmFsc2U7XHJcbiAgICAgICAgdm0ucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgIHZtLmZpbGVjaGFuZ2VkID0gZmFsc2U7XHJcblxyXG5cclxuICAgICAgICB2bS5yb2xlcyA9IHt9O1xyXG4gICAgICAgIHZtLnJvbGVzW1VTRVJfUk9MRVMuYWRtaW4gXT0gXCJBZG1pbmlzdHJhZG9yXCI7XHJcbiAgICAgICAgdm0ucm9sZXNbVVNFUl9ST0xFUy5lZGl0b3JdPSBcIkVkaXRvclwiO1xyXG4gICAgICAgIHZtLnJvbGVzW1VTRVJfUk9MRVMuZWRpdG9yUGx1c109XCJFZGl0b3IgUGx1c1wiO1xyXG4gICAgICAgIHZtLnJvbGVzW1VTRVJfUk9MRVMuYW5hbGlzdGFdPVwiQW5hbGlzdGFcIjtcclxuICAgICAgICB2bS5yb2xlc1tVU0VSX1JPTEVTLmxlY3Rvcl09XCJMZWN0b3JcIjtcclxuXHJcblxyXG4gICAgICAgIHZtLmhpZGUgPSAkbWREaWFsb2cuaGlkZTtcclxuICAgICAgICB2bS5zdWJtaXQgPSBzdWJtaXQ7XHJcbiAgICAgICAgdm0uZmlsZUNoYW5nZSA9IGZpbGVDaGFuZ2U7XHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiBmaWxlQ2hhbmdlKCkge1xyXG4gICAgICAgICAgICBjb25zb2xlLmxvZyhcImZpbGVDaGFuZ2VcIik7XHJcbiAgICAgICAgICAgIHZtLmZpbGVjaGFuZ2VkID0gdHJ1ZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHN1Ym1pdCgpIHtcclxuICAgICAgICAgICAgdm0uYXR0ZW1wdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKCEkc2NvcGUuZm9ybS4kdmFsaWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcbiAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAodm0uZmlsZWNoYW5nZWQpXHJcbiAgICAgICAgICAgICAgICB1cGxvYWRBbmRTYXZlKCk7XHJcbiAgICAgICAgICAgIGVsc2UgaWYgKHZtLmVkaXQpXHJcbiAgICAgICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgc2F2ZSgpO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHNhdmUoKSB7XHJcbiAgICAgICAgICAgIFNpdGVVc2VyLnNhdmUodm0udXNlcixmdW5jdGlvbiAoZGF0YSkge1xyXG4gICAgICAgICAgICAgICAgaWYgKGRhdGEuZXJyb3IpIHtcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoZGF0YS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSh2bS51c2VyKTtcclxuICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoXCJOdWV2byB1c3VhcmlvIGd1YXJkYWRvXCIpKTtcclxuICAgICAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG5cclxuICAgICAgICBmdW5jdGlvbiB1cGxvYWRBbmRTYXZlKCkge1xyXG4gICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gdHJ1ZTtcclxuICAgICAgICAgICAgVXBsb2FkLnVwbG9hZCh7XHJcbiAgICAgICAgICAgICAgICB1cmw6ICRyb290U2NvcGUudXBsb2FkX3VybCxcclxuICAgICAgICAgICAgICAgIGZpbGU6IHZtLnVzZXIuaW1hZ2VuXHJcbiAgICAgICAgICAgIH0pLnByb2dyZXNzKGZ1bmN0aW9uIChldnQpIHtcclxuICAgICAgICAgICAgICAgIHZtLnByb2dyZXNzID0gcGFyc2VJbnQoMTAwLjAgKiBldnQubG9hZGVkIC8gZXZ0LnRvdGFsKTtcclxuICAgICAgICAgICAgfSkuc3VjY2VzcyhmdW5jdGlvbiAoZGF0YSwgc3RhdHVzLCBoZWFkZXJzLCBjb25maWcpIHtcclxuICAgICAgICAgICAgICAgIHZtLnVzZXIuaW1hZ2VuID0gZGF0YS51cmw7XHJcbiAgICAgICAgICAgICAgICB2bS5maWxlY2hhbmdlZCA9IHRydWU7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgICAgICAgICBpZih2bS5lZGl0KVxyXG4gICAgICAgICAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICAgICAgICAgIHNhdmUoKTtcclxuICAgICAgICAgICAgfSkuZXJyb3IoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQoZGF0YS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcbiAgICAgICAgZnVuY3Rpb24gdXBkYXRlKCkge1xyXG4gICAgICAgICAgICBTaXRlVXNlci51cGRhdGUoe2lkOiB2bS51c2VyLmlkfSwgdm0udXNlcikuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSh2bS51c2VyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignU2l0ZVVzZXJMaXN0Q29udHJvbGxlcicsIFsnJHJvb3RTY29wZScsICckc2NvcGUnLCAnU2l0ZVVzZXInLCAnJG1kRGlhbG9nJywgJ1VTRVJfUk9MRVMnLCAnJG1kVG9hc3QnLCAnJHN0YXRlJyxcclxuICAgICAgICBmdW5jdGlvbiAoJHJvb3RTY29wZSwgJHNjb3BlLCBTaXRlVXNlciwgJG1kRGlhbG9nLCBVU0VSX1JPTEVTLCAkbWRUb2FzdCwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS5zaXRldXNlcnMgPSBTaXRlVXNlci5xdWVyeSgpO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICAgICAgZm9vdGVySGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXJWOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNob3dBZGQgPSBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2l0ZVVzZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9zaXRlVXNlcnMvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldlxyXG4gICAgICAgICAgICAgICAgfSkudGhlbihmdW5jdGlvbiAobmV3RXZlbnQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAobmV3RXZlbnQgIT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNpdGV1c2Vycy5wdXNoKG5ld0V2ZW50KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZSA9IGRvRGVsZXRlO1xyXG4gICAgICAgICAgICBmdW5jdGlvbiBkb0RlbGV0ZShyb3csICRldmVudCkge1xyXG4gICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICB2YXIgY29uZmlybSA9ICRtZERpYWxvZy5jb25maXJtKClcclxuICAgICAgICAgICAgICAgICAgICAuY29udGVudCgnRXN0YSBzZWd1cm8gcXVlIGRlc2VhIGJvcnJhciBlc3RlIGVsZW1lbnRvJylcclxuICAgICAgICAgICAgICAgICAgICAub2soJ0JvcnJhcicpXHJcbiAgICAgICAgICAgICAgICAgICAgLmNhbmNlbCgnQ2FuY2VsYXInKVxyXG4gICAgICAgICAgICAgICAgICAgIC50YXJnZXRFdmVudCgkZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KGNvbmZpcm0pLnRoZW4oZnVuY3Rpb24oKXtcclxuICAgICAgICAgICAgICAgICAgICBTaXRlVXNlci5kZWxldGUoe2lkOnJvdy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24ocmVzcG9uc2Upe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5lcnJvcikudGhlbWUoXCJlcnJvci10b2FzdFwiKSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICRzY29wZS5zaXRldXNlcnMuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnNpdGV1c2Vycy5zcGxpY2UoaW5kZXgsIDEpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgICAgIH07XHJcblxyXG4gICAgICAgICAgICAkc2NvcGUuc2hvd0VkaXQgPSBmdW5jdGlvbiAocm93KSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc2VsZWN0ZWRJdGVtID0gYW5ndWxhci5jb3B5KHJvdyk7XHJcbiAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkc2NvcGUuc2l0ZXVzZXJzLmluZGV4T2Yocm93KTtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnU2l0ZVVzZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy9zaXRlVXNlcnMvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgICAgIHBhcmVudDogYW5ndWxhci5lbGVtZW50KGRvY3VtZW50LmJvZHkpLFxyXG4gICAgICAgICAgICAgICAgICAgIHNjb3BlOiAkc2NvcGUuJG5ldygpXHJcbiAgICAgICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChlZGl0ZWQpIHtcclxuICAgICAgICAgICAgICAgICAgICBpZiAoZWRpdGVkICE9IHRydWUpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRyb290U2NvcGUuYWRkT3JVcGRhdGVMaXN0KCRzY29wZS5zaXRldXNlcnMsIGVkaXRlZCwgaW5kZXgpO1xyXG4gICAgICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcInNpdGV1c2Vyc1wiLCB7aWQ6ICcnfSwge25vdGlmeTogZmFsc2V9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVXNlckNvbnRyb2xsZXInLFVzZXJDb250cm9sbGVyKTtcclxuICAgIFVzZXJDb250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCckc2NvcGUnLCckbWRUb2FzdCcsICckbWREaWFsb2cnLCAnVXNlcicsJ1VwbG9hZCcsJ1VTRVJfUk9MRVMnXTtcclxuICAgIGZ1bmN0aW9uIFVzZXJDb250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwkbWRUb2FzdCwgJG1kRGlhbG9nLCBVc2VyLCBVcGxvYWQsIFVTRVJfUk9MRVMpe1xyXG4gICAgICAgIHZhciB2bSA9IHRoaXM7XHJcbiAgICAgICAgaWYoJHNjb3BlLnNlbGVjdGVkSXRlbSE9IHVuZGVmaW5lZCkge1xyXG4gICAgICAgICAgICB2bS51c2VyID0gJHNjb3BlLnNlbGVjdGVkSXRlbTtcclxuICAgICAgICAgICAgdm0uZWRpdCA9IHRydWU7XHJcbiAgICAgICAgfWVsc2VcclxuICAgICAgICAgICAgdm0udXNlciA9IG5ldyBVc2VyKCk7XHJcblxyXG4gICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICB2bS5hdHRlbXB0ZWQgPSBmYWxzZTtcclxuICAgICAgICB2bS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgdm0uZmlsZWNoYW5nZWQgPSBmYWxzZTtcclxuXHJcblxyXG4gICAgICAgIHZtLnJvbGVzID0ge307XHJcbiAgICAgICAgdm0ucm9sZXNbVVNFUl9ST0xFUy5hZG1pbiBdPSBcIkFkbWluaXN0cmFkb3JcIjtcclxuICAgICAgICB2bS5yb2xlc1tVU0VSX1JPTEVTLmVkaXRvcl09IFwiRWRpdG9yXCI7XHJcbiAgICAgICAgdm0ucm9sZXNbVVNFUl9ST0xFUy5lZGl0b3JQbHVzXT1cIkVkaXRvciBQbHVzXCI7XHJcbiAgICAgICAgdm0ucm9sZXNbVVNFUl9ST0xFUy5hbmFsaXN0YV09XCJBbmFsaXN0YVwiO1xyXG4gICAgICAgIHZtLnJvbGVzW1VTRVJfUk9MRVMubGVjdG9yXT1cIkxlY3RvclwiO1xyXG5cclxuXHJcbiAgICAgICAgdm0uaGlkZSA9ICRtZERpYWxvZy5oaWRlO1xyXG4gICAgICAgIHZtLnN1Ym1pdCA9IHN1Ym1pdDtcclxuICAgICAgICB2bS5maWxlQ2hhbmdlID0gZmlsZUNoYW5nZTtcclxuXHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIGZpbGVDaGFuZ2UoKSB7XHJcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiZmlsZUNoYW5nZVwiKTtcclxuICAgICAgICAgICAgdm0uZmlsZWNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc3VibWl0KCkge1xyXG4gICAgICAgICAgICB2bS5hdHRlbXB0ZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICBpZiAoISRzY29wZS5mb3JtLiR2YWxpZClcclxuICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICh2bS5maWxlY2hhbmdlZClcclxuICAgICAgICAgICAgICAgIHVwbG9hZEFuZFNhdmUoKTtcclxuICAgICAgICAgICAgZWxzZSBpZiAodm0uZWRpdClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgfVxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gc2F2ZSgpIHtcclxuICAgICAgICAgICAgVXNlci5zYXZlKHZtLnVzZXIsZnVuY3Rpb24gKGRhdGEpIHtcclxuICAgICAgICAgICAgICAgIGlmIChkYXRhLmVycm9yKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KGRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIHZtLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgIH0gZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kRGlhbG9nLmhpZGUodm0udXNlcik7XHJcbiAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KFwiTnVldm8gdXN1YXJpbyBndWFyZGFkb1wiKSk7XHJcbiAgICAgICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG5cclxuXHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkQW5kU2F2ZSgpIHtcclxuICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IHRydWU7XHJcbiAgICAgICAgICAgIFVwbG9hZC51cGxvYWQoe1xyXG4gICAgICAgICAgICAgICAgdXJsOiAkcm9vdFNjb3BlLnVwbG9hZF91cmwsXHJcbiAgICAgICAgICAgICAgICBmaWxlOiB2bS51c2VyLmltYWdlblxyXG4gICAgICAgICAgICB9KS5wcm9ncmVzcyhmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICB2bS5wcm9ncmVzcyA9IHBhcnNlSW50KDEwMC4wICogZXZ0LmxvYWRlZCAvIGV2dC50b3RhbCk7XHJcbiAgICAgICAgICAgIH0pLnN1Y2Nlc3MoZnVuY3Rpb24gKGRhdGEsIHN0YXR1cywgaGVhZGVycywgY29uZmlnKSB7XHJcbiAgICAgICAgICAgICAgICB2bS51c2VyLmltYWdlbiA9IGRhdGEudXJsO1xyXG4gICAgICAgICAgICAgICAgdm0uZmlsZWNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgdm0ucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICAgICAgaWYodm0uZWRpdClcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KGRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgdm0uc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgdm0ucHJvZ3Jlc3MgPSAwO1xyXG4gICAgICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgfVxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgVXNlci51cGRhdGUoe2lkOiB2bS51c2VyLmlkfSwgdm0udXNlcikuJHByb21pc2UudGhlbihmdW5jdGlvbihyZXNwb25zZSl7XHJcbiAgICAgICAgICAgICAgICB2bS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZSh2bS51c2VyKTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG4gICAgfVxyXG59KSgpOyIsIi8qKlxyXG4gKiBDcmVhdGVkIGJ5IE1heGkgb24gNy8zMS8yMDE1LlxyXG4gKi9cclxuKGZ1bmN0aW9uICgpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVXNlckxpc3RDb250cm9sbGVyJywgWyckcm9vdFNjb3BlJywgJyRzY29wZScsICdVc2VyJywgJyRtZERpYWxvZycsICdVU0VSX1JPTEVTJywgJyRtZFRvYXN0JywgJyRzdGF0ZScsXHJcbiAgICAgICAgZnVuY3Rpb24gKCRyb290U2NvcGUsICRzY29wZSwgVXNlciwgJG1kRGlhbG9nLCBVU0VSX1JPTEVTLCAkbWRUb2FzdCwgJHN0YXRlKSB7XHJcbiAgICAgICAgICAgICRzY29wZS51c2VycyA9IFVzZXIucXVlcnkoKTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5yb2xlcyA9IHt9O1xyXG4gICAgICAgICAgICAkc2NvcGUucm9sZXNbVVNFUl9ST0xFUy5hZG1pbl0gPSBcIkFkbWluaXN0cmFkb3JcIjtcclxuICAgICAgICAgICAgJHNjb3BlLnJvbGVzW1VTRVJfUk9MRVMuZWRpdG9yXSA9IFwiRWRpdG9yXCI7XHJcbiAgICAgICAgICAgICRzY29wZS5yb2xlc1tVU0VSX1JPTEVTLmVkaXRvclBsdXNdID0gXCJFZGl0b3IgUGx1c1wiO1xyXG4gICAgICAgICAgICAkc2NvcGUucm9sZXNbVVNFUl9ST0xFUy5hbmFsaXN0YV0gPSBcIkFuYWxpc3RhXCI7XHJcbiAgICAgICAgICAgICRzY29wZS5yb2xlc1tVU0VSX1JPTEVTLmxlY3Rvcl0gPSBcIkxlY3RvclwiO1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLm9wdGlvbnMgPSB7XHJcbiAgICAgICAgICAgICAgICByb3dIZWlnaHQ6IDUwLFxyXG4gICAgICAgICAgICAgICAgZm9vdGVySGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIGhlYWRlckhlaWdodDogNTAsXHJcbiAgICAgICAgICAgICAgICBzY3JvbGxiYXJWOiBmYWxzZSxcclxuICAgICAgICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICAgICAgY29sdW1uTW9kZTogJ2ZvcmNlJ1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLnNob3dBZGQgPSBmdW5jdGlvbiAoZXYpIHtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyOiAnVXNlckNvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgICAgIGNvbnRyb2xsZXJBczogJ3ZtJyxcclxuICAgICAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3VzZXJzL2FkZC5odG1sJyxcclxuICAgICAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgICAgICB0YXJnZXRFdmVudDogZXZcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKG5ld0V2ZW50KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKG5ld0V2ZW50ICE9PSB1bmRlZmluZWQpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS51c2Vycy5wdXNoKG5ld0V2ZW50KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG4gICAgICAgICAgICB9O1xyXG5cclxuICAgICAgICAgICAgJHNjb3BlLmRlbGV0ZSA9IGZ1bmN0aW9uIChyb3csICRldmVudCkge1xyXG4gICAgICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICAgICAkZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XHJcbiAgICAgICAgICAgICAgICBVc2VyLmRlbGV0ZSh7aWQ6IHJvdy5pZH0pLiRwcm9taXNlLnRoZW4oZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgaWYgKHJlc3BvbnNlLmVycm9yKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkbWRUb2FzdC5zaG93KCRtZFRvYXN0LnNpbXBsZSgpLmNvbnRlbnQocmVzcG9uc2UubWVzc2FnZSkpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgaW5kZXggPSAkc2NvcGUudXNlcnMuaW5kZXhPZihyb3cpO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAkc2NvcGUudXNlcnMuc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfTtcclxuXHJcbiAgICAgICAgICAgICRzY29wZS5zaG93RWRpdCA9IGZ1bmN0aW9uIChyb3cpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEl0ZW0gPSBhbmd1bGFyLmNvcHkocm93KTtcclxuICAgICAgICAgICAgICAgIHZhciBpbmRleCA9ICRzY29wZS51c2Vycy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuc2hvdyh7XHJcbiAgICAgICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ1VzZXJDb250cm9sbGVyJyxcclxuICAgICAgICAgICAgICAgICAgICBjb250cm9sbGVyQXM6ICd2bScsXHJcbiAgICAgICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy91c2Vycy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICAgICAgc2NvcGU6ICRzY29wZS4kbmV3KClcclxuICAgICAgICAgICAgICAgIH0pLnRoZW4oZnVuY3Rpb24gKGVkaXRlZCkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmIChlZGl0ZWQgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgJHJvb3RTY29wZS5hZGRPclVwZGF0ZUxpc3QoJHNjb3BlLnVzZXJzLCBlZGl0ZWQsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgICAgICAkc3RhdGUuZ28oXCJ1c2Vyc1wiLCB7aWQ6ICcnfSwge25vdGlmeTogZmFsc2V9KTtcclxuICAgICAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICAgICAgfTtcclxuICAgICAgICB9XHJcbiAgICBdKTtcclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbiAoKSB7XHJcbiAgICAndXNlIHN0cmljdCc7XHJcblxyXG4gICAgYW5ndWxhci5tb2R1bGUoJ2JhY2tlbmRBcHAuY29udHJvbGxlcnMnKS5jb250cm9sbGVyKCdBZGRWaWRlb0NvbnRyb2xsZXInLCBBZGRWaWRlb0NvbnRyb2xsZXIpO1xyXG4gICAgQWRkVmlkZW9Db250cm9sbGVyLiRpbmplY3QgPSBbJyRyb290U2NvcGUnLCAnJHNjb3BlJywgJyRtZFRvYXN0JywgJyRtZERpYWxvZycsICdWaWRlbycsICdBZCcsICdVcGxvYWQnLCAnJHNjZScsICckaHR0cCddO1xyXG4gICAgZnVuY3Rpb24gQWRkVmlkZW9Db250cm9sbGVyKCRyb290U2NvcGUsICRzY29wZSwgJG1kVG9hc3QsICRtZERpYWxvZywgVmlkZW8sIEFkLCBVcGxvYWQsICRzY2UsICRodHRwKSB7XHJcbiAgICAgICAgJHNjb3BlLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAkc2NvcGUuYXR0ZW1wdGVkID0gZmFsc2U7XHJcbiAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gMDtcclxuICAgICAgICAkc2NvcGUuZmlsZUNoYW5nZWQgPSBmYWxzZTtcclxuICAgICAgICAkc2NvcGUuaXNMaW5rID0gZmFsc2U7XHJcbiAgICAgICAgJHNjb3BlLnlvdXR1YmVJZCA9ICcnO1xyXG4gICAgICAgICRzY29wZS5hZHMgPSBBZC5xdWVyeSgpO1xyXG5cclxuICAgICAgICBpZiAoJHNjb3BlLnNlbGVjdGVkSXRlbSAhPSB1bmRlZmluZWQpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnZpZGVvID0gJHNjb3BlLnNlbGVjdGVkSXRlbTtcclxuICAgICAgICAgICAgaWYoJHNjb3BlLnZpZGVvLmFkKVxyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZpZGVvLmFkX2lkID0gJHNjb3BlLnZpZGVvLmFkLmlkO1xyXG4gICAgICAgICAgICAkc2NvcGUuZWRpdCA9IHRydWU7XHJcbiAgICAgICAgICAgIGlmICgkc2NvcGUudmlkZW8udHlwZSA9PSAneW91dHViZScpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS5pc0xpbmsgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnlvdXR1YmVJZCA9ICRzY29wZS52aWRlby5zb3VyY2U7XHJcbiAgICAgICAgICAgIH0gZWxzZSBpZiAoJHNjb3BlLnZpZGVvLnR5cGUgPT0gJyB2aWRlbycpIHtcclxuXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9IGVsc2VcclxuICAgICAgICAgICAgJHNjb3BlLnZpZGVvID0gbmV3IFZpZGVvO1xyXG5cclxuICAgICAgICAkc2NvcGUuc3VibWl0ID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuYXR0ZW1wdGVkID0gdHJ1ZTtcclxuICAgICAgICAgICAgaWYgKCEkc2NvcGUuZm9ybS4kdmFsaWQpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XHJcblxyXG4gICAgICAgICAgICBpZiAoJHNjb3BlLmZpbGVDaGFuZ2VkICYmICEkc2NvcGUuaXNMaW5rKVxyXG4gICAgICAgICAgICAgICAgdXBsb2FkQW5kU2F2ZSgpO1xyXG4gICAgICAgICAgICBlbHNlIGlmICgkc2NvcGUuZWRpdClcclxuICAgICAgICAgICAgICAgIHVwZGF0ZSgpO1xyXG4gICAgICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmhpZGUgPSAkbWREaWFsb2cuaGlkZTtcclxuICAgICAgICBmdW5jdGlvbiBzYXZlKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUudmlkZW8uJHNhdmUoZnVuY3Rpb24gKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAkbWREaWFsb2cuaGlkZShyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuc3VibWl0dGluZyA9IGZhbHNlO1xyXG4gICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KFwiTnVldm8gYWQgZ3VhcmRhZG9cIikpO1xyXG4gICAgICAgICAgICB9LCBmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRtZFRvYXN0LnNob3coJG1kVG9hc3Quc2ltcGxlKCkuY29udGVudChyZXNwb25zZS5kYXRhLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5zdWJtaXR0aW5nID0gZmFsc2U7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuXHJcblxyXG4gICAgICAgICRzY29wZS5maWxlQ2hhbmdlID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuZmlsZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMaW5rID0gZmFsc2U7XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgJHNjb3BlLmxpbmtDaGFuZ2VkID0gZnVuY3Rpb24gKCkge1xyXG4gICAgICAgICAgICAkc2NvcGUuaXNMaW5rID0gdHJ1ZTtcclxuICAgICAgICAgICAgJGh0dHAucG9zdCgkcm9vdFNjb3BlLnNlcnZlcl91cmwgKyBcIi9hcGkvdXRpbHMveW91dHViZVwiLCB7dXJsOiAkc2NvcGUudmlkZW8uc291cmNlfSkuc3VjY2VzcyhmdW5jdGlvbiAocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICRzY29wZS55b3V0dWJlSWQgPSAnJztcclxuICAgICAgICAgICAgICAgIGlmIChyZXNwb25zZS5pZCAhPT0gZmFsc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUueW91dHViZUlkID0gcmVzcG9uc2UuaWQ7XHJcbiAgICAgICAgICAgICAgICAgICAgJHNjb3BlLnZpZGVvLnR5cGUgPSAneW91dHViZSc7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5nZXRZdCA9IGZ1bmN0aW9uICh2aWRlb0lkKSB7XHJcbiAgICAgICAgICAgIHJldHVybiAkc2NlLnRydXN0QXNSZXNvdXJjZVVybCgnaHR0cHM6Ly93d3cueW91dHViZS5jb20vZW1iZWQvJyArIHZpZGVvSWQpO1xyXG4gICAgICAgIH07XHJcbiAgICAgICAgZnVuY3Rpb24gdXBsb2FkQW5kU2F2ZSgpIHtcclxuICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdHRpbmcgPSB0cnVlO1xyXG4gICAgICAgICAgICBVcGxvYWQudXBsb2FkKHtcclxuICAgICAgICAgICAgICAgIHVybDogJHJvb3RTY29wZS51cGxvYWRfdXJsLFxyXG4gICAgICAgICAgICAgICAgZmlsZTogJHNjb3BlLnZpZGVvLnNvdXJjZVxyXG4gICAgICAgICAgICB9KS5wcm9ncmVzcyhmdW5jdGlvbiAoZXZ0KSB7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUucHJvZ3Jlc3MgPSBwYXJzZUludCgxMDAuMCAqIGV2dC5sb2FkZWQgLyBldnQudG90YWwpO1xyXG4gICAgICAgICAgICB9KS5zdWNjZXNzKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZpZGVvLnNvdXJjZSA9IGRhdGEudXJsO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnZpZGVvLnR5cGUgPSBkYXRhLnR5cGU7XHJcbiAgICAgICAgICAgICAgICAkc2NvcGUuZmlsZUNoYW5nZWQgPSB0cnVlO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnByb2dyZXNzID0gMDtcclxuICAgICAgICAgICAgICAgIGlmICgkc2NvcGUuZWRpdClcclxuICAgICAgICAgICAgICAgICAgICB1cGRhdGUoKTtcclxuICAgICAgICAgICAgICAgIGVsc2VcclxuICAgICAgICAgICAgICAgICAgICBzYXZlKCk7XHJcbiAgICAgICAgICAgIH0pLmVycm9yKGZ1bmN0aW9uIChkYXRhLCBzdGF0dXMsIGhlYWRlcnMsIGNvbmZpZykge1xyXG4gICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KGRhdGEuZXJyb3IpLnRoZW1lKFwiZXJyb3ItdG9hc3RcIikpO1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICRzY29wZS5wcm9ncmVzcyA9IDA7XHJcbiAgICAgICAgICAgIH0pO1xyXG5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGZ1bmN0aW9uIHVwZGF0ZSgpIHtcclxuICAgICAgICAgICAgVmlkZW8udXBkYXRlKHtpZDogJHNjb3BlLnZpZGVvLmlkfSwgJHNjb3BlLnZpZGVvKS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uIChyZXNwb25zZSkge1xyXG4gICAgICAgICAgICAgICAgJHNjb3BlLnN1Ym1pdHRpbmcgPSBmYWxzZTtcclxuICAgICAgICAgICAgICAgICRtZERpYWxvZy5oaWRlKCRzY29wZS52aWRlbyk7XHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH1cclxuICAgIH1cclxufSkoKTsiLCIvKipcclxuICogQ3JlYXRlZCBieSBNYXhpIG9uIDcvMzEvMjAxNS5cclxuICovXHJcbihmdW5jdGlvbigpIHtcclxuICAgICd1c2Ugc3RyaWN0JztcclxuICAgIGFuZ3VsYXIubW9kdWxlKCdiYWNrZW5kQXBwLmNvbnRyb2xsZXJzJykuY29udHJvbGxlcignVmlkZW9MaXN0Q29udHJvbGxlcicsVmlkZW9MaXN0Q29udHJvbGxlcik7XHJcbiAgICBWaWRlb0xpc3RDb250cm9sbGVyLiRpbmplY3Q9IFsnJHJvb3RTY29wZScsJyRzY29wZScsICdWaWRlbycsICckbWREaWFsb2cnLCAnJG1kVG9hc3QnLCckc3RhdGUnXTtcclxuXHJcbiAgICBmdW5jdGlvbiBWaWRlb0xpc3RDb250cm9sbGVyKCRyb290U2NvcGUsJHNjb3BlLCBWaWRlbywgJG1kRGlhbG9nLCAkbWRUb2FzdCwgJHN0YXRlKXtcclxuICAgICAgICAkc2NvcGUudmlkZW9zID0gVmlkZW8ucXVlcnkoKTtcclxuICAgICAgICAkc2NvcGUub3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgcm93SGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgZm9vdGVySGVpZ2h0OiBmYWxzZSxcclxuICAgICAgICAgICAgaGVhZGVySGVpZ2h0OiA1MCxcclxuICAgICAgICAgICAgc2Nyb2xsYmFyVjogZmFsc2UsXHJcbiAgICAgICAgICAgIHNlbGVjdGFibGU6IGZhbHNlLFxyXG4gICAgICAgICAgICBjb2x1bW5Nb2RlOiAnZm9yY2UnXHJcbiAgICAgICAgfTtcclxuICAgICAgICAkc2NvcGUuc2hvd0FkZCA9IGZ1bmN0aW9uKGV2KXtcclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coe1xyXG4gICAgICAgICAgICAgICAgY29udHJvbGxlcjogJ0FkZFZpZGVvQ29udHJvbGxlcicsXHJcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZVVybDogJ3BhcnRpYWxzL3ZpZGVvcy9hZGQuaHRtbCcsXHJcbiAgICAgICAgICAgICAgICBwYXJlbnQ6IGFuZ3VsYXIuZWxlbWVudChkb2N1bWVudC5ib2R5KSxcclxuICAgICAgICAgICAgICAgIHRhcmdldEV2ZW50OiBldlxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uKG5ld0V2ZW50KXtcclxuICAgICAgICAgICAgICAgIGlmKG5ld0V2ZW50IT09IHVuZGVmaW5lZClcclxuICAgICAgICAgICAgICAgICAgICAkc2NvcGUudmlkZW9zLnB1c2gobmV3RXZlbnQpO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICAkc2NvcGUuZGVsZXRlID0gZG9EZWxldGU7XHJcbiAgICAgICAgZnVuY3Rpb24gZG9EZWxldGUocm93LCAkZXZlbnQpIHtcclxuICAgICAgICAgICAgJGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgICAgICAgICRldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcclxuICAgICAgICAgICAgdmFyIGNvbmZpcm0gPSAkbWREaWFsb2cuY29uZmlybSgpXHJcbiAgICAgICAgICAgICAgICAuY29udGVudCgnRXN0YSBzZWd1cm8gcXVlIGRlc2VhIGJvcnJhciBlc3RlIGVsZW1lbnRvJylcclxuICAgICAgICAgICAgICAgIC5vaygnQm9ycmFyJylcclxuICAgICAgICAgICAgICAgIC5jYW5jZWwoJ0NhbmNlbGFyJylcclxuICAgICAgICAgICAgICAgIC50YXJnZXRFdmVudCgkZXZlbnQpO1xyXG5cclxuICAgICAgICAgICAgJG1kRGlhbG9nLnNob3coY29uZmlybSkudGhlbihmdW5jdGlvbigpe1xyXG4gICAgICAgICAgICAgICAgVmlkZW8uZGVsZXRlKHtpZDpyb3cuaWR9KS4kcHJvbWlzZS50aGVuKGZ1bmN0aW9uKHJlc3BvbnNlKXtcclxuICAgICAgICAgICAgICAgICAgICBpZihyZXNwb25zZS5lcnJvcilcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLmVycm9yKS50aGVtZShcImVycm9yLXRvYXN0XCIpKTtcclxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgJG1kVG9hc3Quc2hvdygkbWRUb2FzdC5zaW1wbGUoKS5jb250ZW50KHJlc3BvbnNlLm1lc3NhZ2UpKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGluZGV4ID0gJHNjb3BlLnZpZGVvcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICRzY29wZS52aWRlb3Muc3BsaWNlKGluZGV4LCAxKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgICRzY29wZS5zaG93RWRpdCA9IGZ1bmN0aW9uKHJvdyl7XHJcbiAgICAgICAgICAgICRzY29wZS5zZWxlY3RlZEl0ZW0gPSBhbmd1bGFyLmNvcHkocm93KTtcclxuICAgICAgICAgICAgdmFyIGluZGV4ID0gJHNjb3BlLnZpZGVvcy5pbmRleE9mKHJvdyk7XHJcbiAgICAgICAgICAgICRtZERpYWxvZy5zaG93KHtcclxuICAgICAgICAgICAgICAgIGNvbnRyb2xsZXI6ICdBZGRWaWRlb0NvbnRyb2xsZXInLFxyXG4gICAgICAgICAgICAgICAgdGVtcGxhdGVVcmw6ICdwYXJ0aWFscy92aWRlb3MvYWRkLmh0bWwnLFxyXG4gICAgICAgICAgICAgICAgcGFyZW50OiBhbmd1bGFyLmVsZW1lbnQoZG9jdW1lbnQuYm9keSksXHJcbiAgICAgICAgICAgICAgICBzY29wZTogJHNjb3BlLiRuZXcoKVxyXG4gICAgICAgICAgICB9KS50aGVuKGZ1bmN0aW9uIChlZGl0ZWQpIHtcclxuICAgICAgICAgICAgICAgIGlmIChlZGl0ZWQgIT0gdHJ1ZSlcclxuICAgICAgICAgICAgICAgICAgICAkcm9vdFNjb3BlLmFkZE9yVXBkYXRlTGlzdCgkc2NvcGUudmlkZW9zLCBlZGl0ZWQsIGluZGV4KTtcclxuICAgICAgICAgICAgICAgICRzdGF0ZS5nbyhcInZpZGVvc1wiLCB7aWQ6ICcnfSwge25vdGlmeTogZmFsc2V9KTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbn0pKCk7Il0sInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9