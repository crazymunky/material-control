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

    angular.module('backendApp.controllers').controller('AddCancionController',['$scope','$mdToast', '$mdDialog', 'Cancion', 'Upload',
        function($scope,$mdToast, $mdDialog, Cancion, Upload){
            $scope.cancion = new Cancion();

            $scope.hide = function() {
                $mdDialog.hide();
            }

            $scope.progress = 0;
            $scope.submitting = false;
            $scope.submit = function(){
                $scope.submitting= true;
                Upload.upload({
                    url: 'http://stg1.jwtdigitalpr.com/mpto/api/upload',
                    file: $scope.cancion.audio_source
                }).progress(function(evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.cancion.audio_source = data.url;
                    $scope.cancion.$save(function(response) {
                        $mdDialog.hide($scope.cancion);
                    }, function(response){
                        $scope.cancion.audio_source="";
                        $mdToast.show($mdToast.simple().content(response.data.error));
                    }).then(function(){
                        $scope.submitting=false;
                    });
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error));
                }).then(function(){
                    $scope.cancion.audio_source="";
                    $scope.submitting=false;
                    $scope.progress=0;
                });
            };
        }
    ]);
})();