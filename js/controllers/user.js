/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('UserListController',['$scope', 'User', '$mdDialog', 'USER_ROLES',
        function($scope, User, $mdDialog, USER_ROLES){
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
                    controller: 'AddUserController',
                    templateUrl: 'partials/users/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.users.push(newEvent);
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddUserController',['$rootScope','$scope','$mdToast', '$mdDialog', 'User','Upload','USER_ROLES',
        function($rootScope, $scope,$mdToast, $mdDialog, User, Upload, USER_ROLES){
            $scope.user = new User();
            $scope.submitting = false;
            $scope.attempted = false;
            $scope.progress = 0;
            $scope.photoUploaded = false;

            $scope.roles = {};
            $scope.roles[USER_ROLES.admin ]= "Administrador";
            $scope.roles[USER_ROLES.editor]= "Editor";
            $scope.roles[USER_ROLES.editorPlus]="Editor Plus";
            $scope.roles[USER_ROLES.analista]="Analista";
            $scope.roles[USER_ROLES.lector]="Lector";

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if(!$scope.photoUploaded && $scope.user.imagen)
                    uploadAndSave();
                else
                    save();
            };


            function save() {
                User.save($scope.user,function (data) {
                    if (data.error) {
                        $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                        $scope.submitting = false;
                    } else {
                        $mdDialog.hide($scope.user);
                        $mdToast.show($mdToast.simple().content("Nuevo usuario guardado"));
                    }

                });
            }

            $scope.fileChanged = function(){
                $scope.photoUploaded = false;
            };

            function uploadAndSave() {
                $scope.submitting = true;
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.user.imagen
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.user.imagen = data.url;
                    $scope.photoUploaded = true;
                    $scope.progress = 0;
                    save();
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    $scope.submitting = false;
                    $scope.progress = 0;
                });

            }
        }
    ]);
})();