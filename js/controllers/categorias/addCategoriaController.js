/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';

    angular.module('backendApp.controllers').controller('AddCategoriaController',AddCategoriaController);
    AddCategoriaController.$inject = ['$scope','$mdToast', '$mdDialog', 'Categoria'];
    function AddCategoriaController($scope, $mdToast, $mdDialog, Categoria) {
        var vm = this;

        vm.categoria = null;
        vm.edit = false;

        vm.hide = $mdDialog.hide;
        vm.submitting = false;
        vm.attempted = false;
        vm.submit = submit;

        activate();

        /******************/

        function activate(){
            if ($scope.selectedItem != undefined) {
                vm.categoria = $scope.selectedItem;
                vm.edit = true;
            } else
                vm.categoria = new Categoria();
        }

        function submit() {
            vm.attempted = true;
            if (!$scope.form.$valid)
                return false;

            if (vm.edit)
                update();
            else
                save();
        }

        function save() {
            Categoria.save(vm.categoria).$promise.then(function (response) {
                if (response.error) {
                    $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                } else {
                    $mdDialog.hide(response);
                    $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
                }
                vm.submitting = false;
            });
        }

        function update() {
            Categoria.update({id: vm.categoria.id}, vm.categoria).$promise.then(function (response) {
                vm.submitting = false;
                $mdDialog.hide(vm.categoria);
            });
        }
    }
})();