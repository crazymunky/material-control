/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CategoriaListController',['$scope', 'Categoria', '$mdDialog',
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
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.categorias.push(newEvent);
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddCategoriaController',['$scope','$mdToast', '$mdDialog', 'Categoria',
        function($scope,$mdToast, $mdDialog, Categoria){
            $scope.categoria = new Categoria();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submitting = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;
                save();
            };

            function save() {
                $scope.categoria.$save(function (response) {
                    $mdDialog.hide($scope.categoria);
                    $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                }).then(function(){
                    $scope.submitting = false;
                });
            }
        }
    ]);
})();