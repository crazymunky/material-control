(function(){
    'use strict';

    angular.module('backendApp', ['ngMaterial', 'ngResource','ngMessages', 'ui.router','backendApp.controllers', 'backendApp.services'])
        .config(function($mdThemingProvider, $stateProvider) {
            var customBlueMap = 		$mdThemingProvider.extendPalette('light-blue', {
                'contrastDefaultColor': 'light',
                'contrastDarkColors': ['50'],
                '50': 'ffffff'
            });
            $mdThemingProvider.definePalette('customBlue', customBlueMap);
            $mdThemingProvider.theme('default')
                .primaryPalette('customBlue', {
                    'default': '500',
                    'hue-1': '50'
                })
                .accentPalette('pink');
            $mdThemingProvider.theme('input', 'default')
                .primaryPalette('grey')

            $stateProvider.state('noticias',{
                url:'/noticias',
                templateUrl: 'partials/noticias.html',
                controller: 'NoticiaListController'
            }).state('canciones',{
                url:'/canciones',
                templateUrl: 'partials/canciones.html',
                controller: 'CancionListController'
            }).state('categorias',{
                url:'/categorias',
                templateUrl: 'partials/categorias.html',
                controller: 'CategoriaListController'
            });

        }).run(function($state){
            $state.go('noticias');
        });

})();