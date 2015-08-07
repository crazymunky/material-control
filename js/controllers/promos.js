/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AdListController',['$scope', 'Ad', '$mdDialog',
        function($scope, Ad, $mdDialog){
            $scope.ads = Ad.query();
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
                    controller: 'AddAdController',
                    templateUrl: 'partials/promos/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.ads.push(newEvent);
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddAdController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Ad', 'Upload',
        function($rootScope, $scope,$mdToast, $mdDialog, Ad, Upload){
            $scope.ad = new Ad;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submitting = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.adForm.$valid)
                    return false;

                if(!$scope.photoUploaded)
                    uploadAndSave();
                else
                    save();
            };

            function save() {
                $scope.ad.$save(function (response) {
                    $mdDialog.hide($scope.ad);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
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
                    file: $scope.ad.source
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.ad.source = data.url;
                    $scope.ad.type = data.type;
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