/**
 * Created by Maxi on 7/31/2015.
 */
(function(){
    'use strict';

    var module = angular.module('backendApp.controllers', []);

    module.controller('NoticiaListController',['$scope', 'Noticia',
        function($scope, Noticia){
            $scope.noticias = Noticia.query();
            $scope.options = {
                rowHeight: 40,
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };
            $scope.clickNoticia  = function(noticia){
                console.log(noticia);
            };
        }]);

    module.controller('CancionListController',['$scope', 'Cancion', '$mdDialog',
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
                    link : 'ads',
                    title: 'Ads',
                    icon: 'message'
                },
                {
                    link : 'canciones',
                    title: 'Canciones',
                    icon: 'message'
                },
                {
                    link : 'categorias',
                    title: 'Categorias',
                    icon: 'group'
                },
                {
                    link : 'discos',
                    title: 'Discos',
                    icon: 'message'
                },
                {
                    link : 'eventos',
                    title: 'Eventos',
                    icon: 'message'
                },
                {
                    link : 'noticias',
                    title: 'Noticias',
                    icon: 'dashboard'
                },
                {
                    link : 'videos',
                    title: 'Videos',
                    icon: 'message'
                }
            ];
        }
    ]);

    module.controller('AddCategoriaController',['$scope', '$mdDialog', 'Categoria',
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
        }
    ]);

    module.controller('CategoriaListController',['$scope', 'Categoria', '$mdDialog',
        function($scope, Categoria, $mdDialog){
            $scope.categorias = Categoria.query();
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