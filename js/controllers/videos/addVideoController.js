/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';

    angular.module('backendApp.controllers').controller('AddVideoController', AddVideoController);
    AddVideoController.$inject = ['$rootScope', '$scope', '$mdToast', '$mdDialog', 'Video', 'Ad', 'Upload', '$sce', '$http'];
    function AddVideoController($rootScope, $scope, $mdToast, $mdDialog, Video, Ad, Upload, $sce, $http) {
        $scope.submitting = false;
        $scope.attempted = false;
        $scope.progress = 0;
        $scope.fileChanged = false;
        $scope.isLink = false;
        $scope.youtubeId = '';
        $scope.ads = Ad.query();

        if ($scope.selectedItem != undefined) {
            $scope.video = $scope.selectedItem;
            if($scope.video.ad)
                $scope.video.ad_id = $scope.video.ad.id;
            $scope.edit = true;
            if ($scope.video.type == 'youtube') {
                $scope.isLink = true;
                $scope.youtubeId = $scope.video.source;
            } else if ($scope.video.type == ' video') {

            }
        } else
            $scope.video = new Video;

        $scope.submit = function () {
            $scope.attempted = true;
            if (!$scope.form.$valid)
                return false;

            if ($scope.fileChanged && !$scope.isLink)
                uploadAndSave();
            else if ($scope.edit)
                update();
            else
                save();
        };

        $scope.hide = $mdDialog.hide;
        function save() {
            $scope.video.$save(function (response) {
                $mdDialog.hide(response);
                $scope.submitting = false;
                $mdToast.show($mdToast.simple().content("Nuevo ad guardado"));
            }, function (response) {
                $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                $scope.submitting = false;
            });
        }


        $scope.fileChange = function () {
            $scope.fileChanged = true;
            $scope.isLink = false;
        };

        $scope.linkChanged = function () {
            $scope.isLink = true;
            $http.post($rootScope.server_url + "/api/utils/youtube", {url: $scope.video.source}).success(function (response) {
                $scope.youtubeId = '';
                if (response.id !== false) {
                    $scope.youtubeId = response.id;
                    $scope.video.type = 'youtube';
                }
            });
        };

        $scope.getYt = function (videoId) {
            return $sce.trustAsResourceUrl('https://www.youtube.com/embed/' + videoId);
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
                $scope.fileChanged = true;
                $scope.progress = 0;
                if ($scope.edit)
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
            Video.update({id: $scope.video.id}, $scope.video).$promise.then(function (response) {
                $scope.submitting = false;
                $mdDialog.hide($scope.video);
            });
        }
    }
})();