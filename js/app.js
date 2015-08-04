(function(){
    'use strict';

    angular.module('backendApp', ['flow', 'ngMaterial', 'data-table', 'mdDateTime', 'ngResource','ngMessages', 'ui.router','backendApp.controllers', 'backendApp.services'])
        .config(function($mdThemingProvider, $stateProvider,flowFactoryProvider) {
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
                .primaryPalette('grey');

            $stateProvider.state('ads',{
                url:'/promos',
                templateUrl: 'partials/promos.html',
                controller: 'AdListController'
            }).state('canciones',{
                url:'/canciones',
                templateUrl: 'partials/canciones.html',
                controller: 'CancionListController'
            }).state('categorias',{
                url:'/categorias',
                templateUrl: 'partials/categorias.html',
                controller: 'CategoriaListController'
            }).state('discos',{
                url:'/discos',
                templateUrl: 'partials/discos.html',
                controller: 'DiscoListController'
            }).state('eventos',{
                url:'/eventos',
                templateUrl: 'partials/eventos.html',
                controller: 'EventoListController'
            }).state('noticias',{
                url:'/noticias',
                templateUrl: 'partials/noticias.html',
                controller: 'NoticiaListController'
            }).state('videos',{
                url:'/videos',
                templateUrl: 'partials/videos.html',
                controller: 'VideoListController'
            });

            flowFactoryProvider.defaults = {
                target: 'upload.php',
                permanentErrors:[404, 500, 501],
                singleFile:true,
            };
        }).run(function($state){
            $state.go('noticias');
        }).filter('capitalize', function() {
            return function(input, all) {
                return (!!input) ? input.replace(/([^\W_]+[^\s-]*) */g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();}) : '';
            }
        });

})();