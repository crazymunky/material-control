/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('DiscoListController',['$scope', 'Disco', '$mdDialog',
        function($scope, Disco, $mdDialog){
            $scope.discos = Disco.query();
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
                    controller: 'DiscoController',
                    templateUrl: 'partials/discos/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.discos.push(newEvent);
                });
            };
            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Disco.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.discos.indexOf(row);
                        $scope.discos.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddDiscoController',
                    templateUrl: 'partials/discos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddDiscoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Disco','Upload',
        function($rootScope,$scope,$mdToast, $mdDialog, Disco, Upload){

            if($scope.selectedItem!= undefined) {
                $scope.disco = $scope.selectedItem;
                $scope.edit = true;
            }else
                $scope.disco = new Disco();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submitting = false;
            $scope.attempted = false;

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
                $scope.disco.$save(function (response) {
                    $mdDialog.hide($scope.disco);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nuevo disco guardado"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                    $scope.submitting = false;
                });
            }

            $scope.progress = 0;
            $scope.fileChanged = false;
            $scope.fileChange = function(){
                $scope.fileChanged = true;
            };

            function uploadAndSave() {
                $scope.submitting = true;
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.disco.cover_img
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.disco.cover_img = data.url;
                    $scope.fileChanged = true;
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
                Disco.update({id: $scope.disco.id}, $scope.disco).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.disco);
                });
            }
        }
    ]);
})();