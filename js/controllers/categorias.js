/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CategoriaListController',['$scope', 'Categoria', '$mdDialog', '$mdToast',
        function($scope, Categoria, $mdDialog, $mdToast){
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
            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Categoria.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.categorias.indexOf(row);
                        $scope.categorias.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddCategoriaController',
                    templateUrl: 'partials/categorias/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddCategoriaController',['$scope','$mdToast', '$mdDialog', 'Categoria',
        function($scope,$mdToast, $mdDialog, Categoria){
            if($scope.selectedItem!= undefined) {
                $scope.categoria = $scope.selectedItem;
                $scope.edit = true;
            }else
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

                if($scope.edit)
                    update();
                else
                    save();
            };

            function save() {
                Categoria.save($scope.categoria).$promise.then(function (response) {
                    console.log(response);
                    if(response.error){
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    }else{
                        $mdDialog.hide(response);
                        $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
                    }
                    $scope.submitting = false;
                });
            }

            function update() {
                Categoria.update({id: $scope.categoria.id}, $scope.categoria).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.categoria);
                });
            }
        }
    ]);
})();