/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('IntegranteListController',IntegranteListController);

    IntegranteListController.$inject = ['$rootScope','$scope', 'Integrante', '$mdDialog','$mdToast', '$stateParams', '$state' ];
    function IntegranteListController($rootScope, $scope, Integrante, $mdDialog, $mdToast, $stateParams, $state){
        var vm = this;
        vm.integrantes = Integrante.query();
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
                Integrante.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };

        function showAdd(ev){
            $mdDialog.show({
                controller: 'AddIntegranteController',
                controllerAs: 'vm',
                templateUrl: 'partials/integrantes/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function(newModel){
                if(newModel!= true)
                    $rootScope.addOrUpdateList(vm.integrantes, newModel)
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
                Integrante.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.integrantes.indexOf(row);
                        vm.integrantes.splice(index, 1);
                    }
                });
            });

        };

        function navigateToItem(row){
            $state.go("integrantes",{id:row.id}, {notify:false});
            showEdit(row);
        };

        function showEdit(row){
            $scope.selectedItem = angular.copy(row);
            var index = vm.integrantes.indexOf(row);
            $mdDialog.show({
                controller: 'AddIntegranteController',
                controllerAs: 'vm',
                templateUrl: 'partials/integrantes/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function(edited){
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.integrantes, edited, index);
                $state.go("integrantes",{id:''}, {notify:false});
            });
        };
    }
})();