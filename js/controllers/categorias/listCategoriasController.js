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