/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';
    angular.module('backendApp.controllers').controller('AddDiscoController', AddDiscoController);
    AddDiscoController.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'Disco', 'Upload']

    function AddDiscoController($rootScope, $scope, $mdToast, $mdDialog, Disco, Upload) {
        var vm = this;
        vm.hide = $mdDialog.hide;
        vm.edit = false;
        vm.disco = null;
        vm.submitting = false;
        vm.attempted = false;
        vm.progress = 0;
        vm.fileChanged = false;

        vm.fileChange = function () {
            vm.fileChanged = true;
        };
        vm.submit = submit;

        activate();

        function activate() {
            if ($scope.selectedItem != undefined) {
                vm.disco = $scope.selectedItem;
                vm.edit = true;
            } else
                vm.disco = new Disco();
        }

        function submit() {
            vm.attempted = true;
            if (!$scope.form.$valid)
                return false;

            if (vm.fileChanged)
                uploadAndSave();
            else if (vm.edit)
                update();
            else
                save();
        }

        function save() {
            vm.disco.$save(function (response) {
                $mdDialog.hide(vm.disco);
                vm.submitting = false;
                $mdToast.show($mdToast.simple().content("Nuevo disco guardado"));
            }, function (response) {
                $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                vm.submitting = false;
            });
        }

        function uploadAndSave() {
            vm.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.disco.cover_img
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.disco.cover_img = data.url;
                vm.fileChanged = true;
                vm.progress = 0;
                if (vm.edit)
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
            Disco.update({id: vm.disco.id}, vm.disco).$promise.then(function (response) {
                vm.submitting = false;
                $mdDialog.hide(vm.disco);
            });
        }
    };
})();