/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AddAdController',AddAdController);

    AddAdController.$inject = ['$rootScope','$scope','$mdToast', '$mdDialog', 'Ad', 'Upload'];
    function AddAdController($rootScope, $scope, $mdToast, $mdDialog, Ad, Upload) {
        var vm = this;

        vm.edit = false;
        vm.submitting = false;
        vm.attempted = false;
        vm.progress = 0;
        vm.fileChanged = false;
        vm.sizes = [ "300x250", "300x600", "728X90", "320x50", "810X550"];
        vm.posiciones = [1, 2, 3];

        if ($scope.selectedItem != undefined) {
            vm.ad = $scope.selectedItem;
            vm.edit = true;
        } else
            vm.ad = new Ad;

        vm.hide = $mdDialog.hide;

        vm.submit = function () {
            vm.attempted = true;

            if (!$scope.adForm.$valid)
                return false;

            vm.submitting = true;

            if (vm.fileChanged)
                uploadAndSave();
            else if (vm.edit)
                update();
            else
                save();
        };

        vm.fileChange = function () {
            vm.fileChanged = true;
        };

        function save() {
            vm.ad.$save(function (response) {
                $mdDialog.hide(vm.ad);
                vm.submitting = false;
                $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
            }, function (response) {
                $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                vm.submitting = false;
            });
        }


        function update() {
            Ad.update({id: vm.ad.id}, vm.ad).$promise.then(function (response) {
                console.log("finished", response);
                vm.submitting = false;
                $mdDialog.hide(vm.ad);
            });
        }




        function uploadAndSave() {
            vm.submitting = true;
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.ad.source
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.ad.source = data.url;
                vm.ad.type = data.type;
                vm.fileChanged = false;
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

    }
})();