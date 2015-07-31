/**
 * Created by Maxi on 7/31/2015.
 */
(function(){
    'use strict';

    var module = angular.module('backendApp.controllers', []);

    module.controller( 'NoticiaListController',['$scope', 'Noticia',
        function($scope, Noticia){
            $scope.noticias = Noticia.query();

        }]);

    module.controller( 'CancionListController',['$scope', 'Cancion', '$mdDialog',
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
        }]);

    module.controller('HeaderController', ['$scope', '$mdSidenav',
        function ($scope, $mdSidenav) {
            $scope.openLeftMenu = function () {
                $mdSidenav('side-nav').toggle();
            };
        }
    ]);

    module.controller('MenuController', ['$scope',
        function ($scope) {
            $scope.menu = [
                {
                    link : 'noticias',
                    title: 'Noticias',
                    icon: 'dashboard'
                },
                {
                    link : 'categorias',
                    title: 'Categorias',
                    icon: 'group'
                },
                {
                    link : 'canciones',
                    title: 'Canciones',
                    icon: 'message'
                }
            ];
        }
    ]);

    module.controller( 'AddCategoriaController',['$scope', '$mdDialog', 'Categoria',
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
        }]);

    module.controller( 'CategoriaListController',['$scope', 'Categoria', '$mdDialog',
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