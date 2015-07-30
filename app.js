(function(){
    'use strict';

    angular.module('backendApp', ['ngMaterial', 'ngResource','ngMessages', 'ui.router','backendApp.controllers', 'backendApp.services'])
        .config(function($mdThemingProvider, $stateProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('light-blue', {
                    'default': '400', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                .accentPalette('amber', {
                    'default': '200' // use shade 200 for default, and keep all other shades the same
                });

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

    angular.module('backendApp.services',[]).factory('Noticia', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/noticias/:id');
    }).factory('Cancion', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/canciones/:id');
    }).factory('Categoria', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/categorias/:id');
    });

    angular.module('backendApp.controllers',[]).controller( 'NoticiaListController',['$scope', 'Noticia',
        function($scope, Noticia){
            $scope.noticias = Noticia.query();
        }]).controller( 'CancionListController',['$scope', 'Cancion', '$mdDialog',
        function($scope, Cancion, $mdDialog){
            $scope.canciones = Cancion.query();
            $scope.showAdd = function(ev){
                $mdDialog.show({
                    controller: 'AddController',
                    templateUrl: 'partials/canciones/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                });
            };
        }]).controller( 'HeaderController',['$scope', '$mdSidenav',
        function($scope, $mdSidenav){
            $scope.openLeftMenu = function() {
                $mdSidenav('side-nav').toggle();
            };
        }]).controller( 'AddCategoriaController',['$scope', '$mdDialog', 'Categoria',
        function($scope, $mdDialog, Categoria){
            $scope.categoria = new Categoria();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submit = function(){
                $scope.categoria.$save(function() {
                    $mdDialog.hide($scope.categoria);
                });
            };
        }]).controller( 'CategoriaListController',['$scope', 'Categoria', '$mdDialog',
        function($scope, Categoria, $mdDialog){
            $scope.categorias = Categoria.query();
            $scope.showAdd = function(ev){
                $mdDialog.show({
                    controller: 'AddCategoriaController',
                    templateUrl: 'partials/categorias/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(answer){
                    if(answer!== undefined)
                        $scope.categorias.push(answer);
                });
            };
        }]);

})();