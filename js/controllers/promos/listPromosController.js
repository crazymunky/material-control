/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AdListController',AdListController);
    AdListController.$inject = ['$rootScope','$scope','Ad', '$mdDialog', '$mdToast', '$state'];
    function AdListController($rootScope, $scope, Ad, $mdDialog, $mdToast, $state) {
        var vm = this;

        vm.ads = Ad.query();
        vm.showEdit = navigateToItem;

        vm.options = {
            rowHeight: "auto",
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };

        vm.showAdd = function (ev) {
            $mdDialog.show({
                controller: 'AddAdController',
                controllerAs: 'vm',
                templateUrl: 'partials/promos/add.html',
                parent: angular.element(document.body),
                targetEvent: ev
            }).then(function (newObj) {
                if (newObj!==true)
                    vm.ads.push(newObj);
            });
        };

        vm.delete = doDelete;
        function doDelete(row, $event) {
            $event.preventDefault();
            $event.stopPropagation();
            var confirm = $mdDialog.confirm()
                .content('Esta seguro que desea borrar este elemento')
                .ok('Borrar')
                .cancel('Cancelar')
                .targetEvent($event);

            $mdDialog.show(confirm).then(function(){
                Ad.delete({id: row.id}).$promise.then(function (response) {
                    if (response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = vm.ads.indexOf(row);
                        vm.ads.splice(index, 1);
                    }
                });
            });

        };


        function navigateToItem(row){
            $state.go("ads",{id:row.id}, {notify:false});
            showEdit(row);
        };
        function showEdit(row) {
            $scope.selectedItem = angular.copy(row);
            var index = vm.ads.indexOf(row);
            $mdDialog.show({
                controller: 'AddAdController',
                controllerAs: 'vm',
                templateUrl: 'partials/promos/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function(edited){
                if(edited!= true)
                    $rootScope.addOrUpdateList(vm.ads, edited, index);
                $state.go("ads",{id:''}, {notify:false});
            });
        };

    }
})();