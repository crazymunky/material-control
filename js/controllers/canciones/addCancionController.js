/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AddCancionController', AddCancionController);

    AddCancionController.$inject = ['$scope','$rootScope','$mdToast', '$mdDialog', 'Cancion', 'Disco', 'Upload'];

    function AddCancionController($scope, $rootScope,$mdToast, $mdDialog, Cancion, Disco, Upload){
        var vm = this;
        vm.edit = false;
        vm.discos = Disco.query();
        vm.progress = 0;
        vm.submitting = false;
        vm.fileChanged = false;
        vm.attempted = false;

        vm.submit = submit;
        vm.fileChange = fileChange;
        vm.hide = $mdDialog.cancel;

        if($scope.selectedItem != undefined) {
            vm.cancion = $scope.selectedItem;
            vm.cancion.disco_id = vm.cancion.disco.id;
            vm.edit = true;
        }else
            vm.cancion = new Cancion();

        /*******functions*******/
        function submit(){
            vm.attempted = true;
            if(!$scope.form.$valid)
                return false;

            if(vm.fileChanged)
                uploadAndSave();
            else if(vm.edit)
                update();
            else
                save();
        };


        function fileChange(){
            vm.fileChanged = true;
        };

        function uploadAndSave() {
            Upload.upload({
                url: $rootScope.upload_url,
                file: vm.cancion.audio_source
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.cancion.audio_source = data.url;
                vm.fileChanged = true;
                vm.progress=0;
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

        function save() {
            vm.cancion.$save(function (response) {
                $mdDialog.hide(vm.cancion);
                vm.submitting = false;
                $mdToast.show($mdToast.simple().content("Nuevo canción guardada"));
            }, function (response) {
                $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                vm.submitting = false;
            });
        }

        function update() {
            Cancion.update({id: vm.cancion.id}, vm.cancion).$promise.then(function(response){
                vm.submitting = false;
                $mdDialog.hide(vm.cancion);
            });
        }
    }
})();