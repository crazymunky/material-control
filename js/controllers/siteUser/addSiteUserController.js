/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('SiteUserController',SiteUserController);
    SiteUserController.$inject = ['$rootScope','$scope','$mdToast', '$mdDialog', 'SiteUser','Upload','USER_ROLES'];

    function SiteUserController($rootScope, $scope,$mdToast, $mdDialog, SiteUser, Upload, USER_ROLES){
        var vm = this;
        if($scope.selectedItem!= undefined) {
            vm.user = $scope.selectedItem;
            vm.edit = true;
        }else
            vm.user = new SiteUser();

        vm.submitting = false;
        vm.attempted = false;
        vm.progress = 0;
        vm.filechanged = false;


        vm.roles = {};
        vm.roles[USER_ROLES.admin ]= "Administrador";
        vm.roles[USER_ROLES.editor]= "Editor";
        vm.roles[USER_ROLES.editorPlus]="Editor Plus";
        vm.roles[USER_ROLES.analista]="Analista";
        vm.roles[USER_ROLES.lector]="Lector";


        vm.hide = $mdDialog.hide;
        vm.submit = submit;
        vm.fileChange = fileChange;


        function fileChange() {
            console.log("fileChange");
            vm.filechanged = true;
        }

        function submit() {
            vm.attempted = true;
            if (!$scope.form.$valid)
                return false;
            vm.submitting = true;
            if (vm.filechanged)
                uploadAndSave();
            else if (vm.edit)
                update();
            else
                save();
        }


        function save() {
            SiteUser.save(vm.user,function (data) {
                if (data.error) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    vm.submitting = false;
                } else {
                    $mdDialog.hide(vm.user);
                    $mdToast.show($mdToast.simple().content("Nuevo usuario guardado"));
                }

            });
        }



        function uploadAndSave() {
            vm.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.user.imagen
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.user.imagen = data.url;
                vm.filechanged = true;
                vm.progress = 0;
                if(vm.edit)
                    update();
                else
                    save();
            }).error(function (data, status, headers, config) {
                $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                vm.submitting = false;
                vm.progress = 0;
            });

        }
        function update() {
            SiteUser.update({id: vm.user.id}, vm.user).$promise.then(function(response){
                vm.submitting = false;
                $mdDialog.hide(vm.user);
            });
        }
    }
})();