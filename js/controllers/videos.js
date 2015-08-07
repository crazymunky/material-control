/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('VideoListController',['$scope', 'Video', '$mdDialog',
        function($scope, Video, $mdDialog){
            $scope.videos = Video.query();
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
                    controller: 'AddVideoController',
                    templateUrl: 'partials/videos/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.videos.push(newEvent);
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddVideoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Video','Ad','Upload',
        function($rootScope,$scope,$mdToast, $mdDialog, Video, Ad, Upload){
            $scope.video = new Video();
            $scope.ads = Ad.query();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submitting = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if(!$scope.photoUploaded && !$scope.isLink)
                    uploadAndSave();
                else
                    save();
            };

            function save() {
                $scope.video.$save(function (response) {
                    $mdDialog.hide($scope.video);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                    $scope.submitting = false;
                });
            }
            $scope.progress = 0;
            $scope.photoUploaded = false;
            $scope.isLink = false;
            $scope.fileChanged = function(){
                $scope.photoUploaded = false;
                $scope.isLink = false;
            };
            $scope.linkChanged = function(){
                $scope.isLink = true;
                $scope.video.type = 'youtube';
            };
            function uploadAndSave() {
                $scope.submitting = true;
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.video.source
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.video.source = data.url;
                    $scope.video.type = data.type;
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