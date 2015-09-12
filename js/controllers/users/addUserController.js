/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('UserController',['$rootScope','$scope','$mdToast', '$mdDialog', 'User','Upload','USER_ROLES',
        function($rootScope, $scope,$mdToast, $mdDialog, User, Upload, USER_ROLES){
            if($scope.selectedItem!= undefined) {
                $scope.user = $scope.selectedItem;
                $scope.edit = true;
            }else
                $scope.user = new User();

            $scope.submitting = false;
            $scope.attempted = false;
            $scope.progress = 0;
            $scope.filechanged = false;


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

                if($scope.fileChanged)
                    uploadAndSave();
                else if($scope.edit)
                    update();
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

            $scope.fileChange = function(){
                $scope.filechanged = false;
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
                    $scope.filechanged = true;
                    $scope.progress = 0;
                    if($scope.edit)
                        update();
                    else
                        save();
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    $scope.submitting = false;
                    $scope.progress = 0;
                });

            }
            function update() {
                User.update({id: $scope.user.id}, $scope.user).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.user);
                });
            }
        }
    ]);
})();