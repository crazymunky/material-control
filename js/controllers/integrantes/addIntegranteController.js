/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AddIntegranteController', AddIntegranteController);

    AddIntegranteController.$inject = ['$scope','$rootScope','$mdToast', '$mdDialog', 'Integrante', 'Disco', 'Upload'];

    function AddIntegranteController($scope, $rootScope,$mdToast, $mdDialog, Integrante, Disco, Upload){
        var vm = this;
        vm.edit = false;
        vm.discos = Disco.query();
        vm.progress = 0;
        vm.submitting = false;
        vm.fileChanged = false;
        vm.attempted = false;

        vm.submit = submit;
        vm.fileChange = fileChange;
        vm.hide = $mdDialog.hide;

        if($scope.selectedItem != undefined) {
            vm.integrante = $scope.selectedItem;
            vm.edit = true;
        }else
            vm.integrante = new Integrante();

        /*******functions*******/
        function submit(){
            vm.attempted = true;
            vm.submitting = true;
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
                file: vm.integrante.imagen
            }).progress(function (evt) {
                vm.progress = parseInt(100.0 * evt.loaded / evt.total);
            }).success(function (data, status, headers, config) {
                vm.integrante.imagen = data.url;
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
            Integrante.save(vm.integrante).$promise.then(function (response, algo, algo2) {
                console.log(algo);
                console.log(algo2);
                if (response.error) {
                    $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                } else {
                    $mdDialog.hide(response);
                    $mdToast.show($mdToast.simple().content("Nueva integrante guardado"));
                }
                vm.submitting = false;
            });
        }

        function update() {
            Integrante.update({id: vm.integrante.id}, vm.integrante).$promise.then(function(response){
                vm.submitting = false;
                $mdDialog.hide(vm.integrante);
            });
        }
    }
})();