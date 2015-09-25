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
            AuthService.refresh().then(function(response){console.log(response);});
        }

        $rootScope.$on('$stateChangeStart', function (event, next) {
            if (next.data)
                var authorizedRoles = next.data.authorizedRoles;
            if (authorizedRoles && !AuthService.isAuthorized(authorizedRoles)) {
                event.preventDefault();
                $rootScope.$broadcast('unauthorized');
            }
        });
    };

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
    };
})();