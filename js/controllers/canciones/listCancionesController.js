/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular
        .module('backendApp.controllers')
        .controller('CancionListController',CancionListController);

    CancionListController.$inject = ['$scope', 'Cancion', '$mdDialog','$mdToast'];
    function CancionListController($scope, Cancion, $mdDialog, $mdToast){
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
        vm.showEdit = showEdit;

        /**********************/
        function showAdd(ev){
            $mdDialog.show({
                controller: 'AddCancionController',
                controllerAs: 'vm',
                templateUrl: 'partials/canciones/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function(newEvent){
                if(newEvent!== undefined)
                    vm.canciones.push(newEvent);
            });
        };

        function doDelete(row, $event){
            $event.preventDefault();
            $event.stopPropagation();
            Cancion.delete({id:row.id}).$promise.then(function(response){
                if(response.error)
                    $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                else {
                    $mdToast.show($mdToast.simple().content(response.message));
                    var index = vm.canciones.indexOf(row);
                    vm.canciones.splice(index, 1);
                }
            });
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
                if(edited)
                    vm.canciones[index] = edited;
            });
        };
    }
})();