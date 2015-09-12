/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('UserListController',['$rootScope','$scope', 'User', '$mdDialog', 'USER_ROLES','$mdToast','$state',
        function($rootScope, $scope, User, $mdDialog, USER_ROLES, $mdToast, $state){
            $scope.users = User.query();

            $scope.roles = {};
            $scope.roles[USER_ROLES.admin ]= "Administrador";
            $scope.roles[USER_ROLES.editor]= "Editor";
            $scope.roles[USER_ROLES.editorPlus]="Editor Plus";
            $scope.roles[USER_ROLES.analista]="Analista";
            $scope.roles[USER_ROLES.lector]="Lector";

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
                    controller: 'UserController',
                    templateUrl: 'partials/users/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.users.push(newEvent);
                });
            };

            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                User.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.users.indexOf(row);
                        $scope.users.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function(row){
                $scope.selectedItem = angular.copy(row);
                var index = $scope.users.indexOf(row);
                $mdDialog.show({
                    controller: 'UserController',
                    templateUrl: 'partials/users/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                }).then(function(edited){
                    if(edited!= true)
                        $rootScope.addOrUpdateList($scope.users, edited, index);
                    $state.go("users",{id:''}, {notify:false});
                });;
            };
        }
    ]);
})();