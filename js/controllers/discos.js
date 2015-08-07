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
        }
    ]);

    angular.module('backendApp.controllers').controller('DiscoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Disco','Upload',
        function($rootScope,$scope,$mdToast, $mdDialog, Disco, Upload){
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

                if(!$scope.photoUploaded)
                    uploadAndSave();
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
            $scope.photoUploaded = false;
            $scope.fileChanged = function(){
                $scope.photoUploaded = false;
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
                    $scope.photoUploaded = true;
                    $scope.progress = 0;
                    save();
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error).theme("error-toast"));
                    $scope.submitting = false;
                    $scope.progress = 0;
                });

            }
        }
    ]);
})();