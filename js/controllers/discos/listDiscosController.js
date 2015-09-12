/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('DiscoListController',DiscoListController);
    DiscoListController.$inject = ['$scope', '$rootScope','$state', 'Disco', '$mdDialog','$mdToast', '$stateParams'];
    function DiscoListController($scope,$rootScope, $state, Disco, $mdDialog, $mdToast,$stateParams){
        var vm = this;
        vm.discos = Disco.query();
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
                Disco.get({id:$stateParams.id}).$promise.then(function(response){
                    showEdit(response);
                });
            }
        };
        function navigateToItem(row){
            $state.go("discos",{id:row.id}, {notify:false});
            showEdit(row);
        };


        function showAdd(ev) {
            $mdDialog.show({
                controller: 'AddDiscoController',
                controllerAs: 'vm',
                templateUrl: 'partials/discos/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (newEvent) {
                if (newEvent !== undefined)
                    vm.discos.push(newEvent);
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
                Noticia.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.discos.indexOf(row);
                        vm.discos.splice(index, 1);
                    }
                });
            });

        };


        function showEdit(row) {
            $scope.selectedItem = row;
            var index = vm.discos.indexOf(row);
            $mdDialog.show({
                controller: 'AddDiscoController',
                controllerAs: 'vm',
                templateUrl: 'partials/discos/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function(edited){
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.discos, edited, index);
                $state.go("discos",{id:''}, {notify:false});
            });
        }
    };
})();