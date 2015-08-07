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
        }
    ]);

    angular.module('backendApp.controllers').controller('AddCancionController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Cancion', 'Disco', 'Upload',
        function($rootScope,$scope,$mdToast, $mdDialog, Cancion, Disco, Upload){
            $scope.cancion = new Cancion();
            $scope.discos = Disco.query();
            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.progress = 0;
            $scope.submitting = false;
            $scope.photoUploaded = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if(!$scope.photoUploaded)
                    uploadAndSave();
                else
                    save();
            };

            $scope.fileChanged = function(){
                $scope.photoUploaded = false;
            };

            function uploadAndSave() {
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.cancion.audio_source
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.cancion.audio_source = data.url;
                    $scope.photoUploaded = true;
                    $scope.progress=0;
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
        }
    ]);
})();