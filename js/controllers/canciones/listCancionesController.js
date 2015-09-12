/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CancionListController',CancionListController);

    CancionListController.$inject = ['$rootScope','$scope', 'Cancion', '$mdDialog','$mdToast', '$stateParams', '$state' ];
    function CancionListController($rootScope, $scope, Cancion, $mdDialog, $mdToast, $stateParams, $state){
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
        vm.showEdit = navigateToItem;
        vm.hide = $mdDialog.cancel;

        activate();

        /**********************/
        function activate(){
            if($stateParams.id){
                Cancion.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };

        function showAdd(ev){
            $mdDialog.show({
                controller: 'AddCancionController',
                controllerAs: 'vm',
                templateUrl: 'partials/canciones/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function(newModel){
                if(newModel!= true)
                    $rootScope.addOrUpdateList(vm.canciones, newModel);
            });
        };


        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Cancion.delete({id: row.id}).$promise.then(function (response) {
                    if (response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.canciones.indexOf(row);
                        vm.canciones.splice(index, 1);
                    }
                });
            });

        };

        function navigateToItem(row){
            $state.go("canciones",{id:row.id}, {notify:false});
            showEdit(row);
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
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.canciones, edited, index);
                $state.go("canciones",{id:''}, {notify:false});
            });
        };


    }
})();