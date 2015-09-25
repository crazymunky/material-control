/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';
    angular.module('backendApp.controllers').controller('SiteUserListController', ['$rootScope', '$scope', 'SiteUser', '$mdDialog', 'USER_ROLES', '$mdToast', '$state',
        function ($rootScope, $scope, SiteUser, $mdDialog, USER_ROLES, $mdToast, $state) {
            $scope.siteusers = SiteUser.query();

            $scope.options = {
                rowHeight: 50,
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };

            $scope.showAdd = function (ev) {
                $mdDialog.show({
                    controller: 'SiteUserController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/siteUsers/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function (newEvent) {
                    if (newEvent !== undefined)
                        $scope.siteusers.push(newEvent);
                });
            };

            $scope.delete = doDelete;
            function doDelete(row, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var confirm = $mdDialog.confirm()
                    .content('Esta seguro que desea borrar este elemento')
                    .ok('Borrar')
                    .cancel('Cancelar')
                    .targetEvent($event);

                $mdDialog.show(confirm).then(function(){
                    SiteUser.delete({id:row.id}).$promise.then(function(response){
                        if(response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.siteusers.indexOf(row);
                            $scope.siteusers.splice(index, 1);
                        }
                    });
                });

            };

            $scope.showEdit = function (row) {
                $scope.selectedItem = angular.copy(row);
                var index = $scope.siteusers.indexOf(row);
                $mdDialog.show({
                    controller: 'SiteUserController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/siteUsers/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                }).then(function (edited) {
                    if (edited != true)
                        $rootScope.addOrUpdateList($scope.siteusers, edited, index);
                    $state.go("siteusers", {id: ''}, {notify: false});
                });

            };
        }
    ]);
})();