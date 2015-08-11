/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CancionListController',['$scope', 'Cancion', '$mdDialog',
        function($scope, Cancion, $mdDialog){
            $scope.canciones = Cancion.query();

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
                    controller: 'AddCancionController',
                    templateUrl: 'partials/canciones/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.canciones.push(newEvent);
                });
            };

            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Cancion.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.canciones.indexOf(row);
                        $scope.canciones.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddCancionController',
                    templateUrl: 'partials/canciones/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddCancionController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Cancion', 'Disco', 'Upload',
        function($rootScope,$scope,$mdToast, $mdDialog, Cancion, Disco, Upload){
            $scope.edit = false;

            $scope.discos = Disco.query();
            $scope.progress = 0;
            $scope.submitting = false;
            $scope.fileChanged = false;
            $scope.attempted = false;

            if($scope.selectedItem!= undefined) {
                $scope.cancion = $scope.selectedItem;
                $scope.cancion.disco_id = $scope.cancion.disco.id;
                $scope.edit = true;
            }else
                $scope.cancion = new Cancion();

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


            $scope.fileChange = function(){
                $scope.fileChanged = true;
            };

            function uploadAndSave() {
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.cancion.audio_source
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.cancion.audio_source = data.url;
                    $scope.fileChanged = true;
                    $scope.progress=0;
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
            function save() {
                $scope.cancion.$save(function (response) {
                    $mdDialog.hide($scope.cancion);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nuevo canción guardada"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                    $scope.submitting = false;
                });
            }

            function update() {
                Cancion.update({id: $scope.cancion.id}, $scope.cancion).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.cancion);
                });
            }
        }
    ]);
})();