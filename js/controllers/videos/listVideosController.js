/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('VideoListController',['$scope', 'Video', '$mdDialog', '$mdToast',
        function($scope, Video, $mdDialog, $mdToast){
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

            $scope.delete = doDelete;
            function doDelete(row, $event) {
                $event.preventDefault();
                $event.stopPropagation();
                var confirm = $mdDialog.confirm()
                    .content('Esta seguro que desea borrar este elemento')
                    .ok('Borrar')
                    .cancel('Cancelar')
                    .targetEvent($event);

                $mdDialog.show(confirm).then(function(){
                    Video.delete({id:row.id}).$promise.then(function(response){
                        if(response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.videos.indexOf(row);
                            $scope.videos.splice(index, 1);
                        }
                    });
                });

            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddVideoController',
                    templateUrl: 'partials/videos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddVideoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Video','Ad','Upload','$sce','$http',
        function($rootScope,$scope,$mdToast, $mdDialog, Video, Ad, Upload, $sce, $http){
            $scope.submitting = false;
            $scope.attempted = false;
            $scope.progress = 0;
            $scope.fileChanged = false;
            $scope.isLink = false;
            $scope.youtubeId = '';
            $scope.ads = Ad.query();

            if($scope.selectedItem!= undefined) {
                $scope.video = $scope.selectedItem;
                if($scope.video.ad)
                    $scope.video.ad_id = $scope.video.ad.id;
                $scope.edit = true;
                if($scope.video.type=='youtube'){
                    $scope.isLink = true;
                    $scope.youtubeId = $scope.video.source;
                }else if ($scope.video.type ==' video'){

                }
            }else
                $scope.video = new Video;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if($scope.fileChanged && !$scope.isLink)
                    uploadAndSave();
                else if($scope.edit)
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


            $scope.fileChange = function(){
                $scope.fileChanged = true;
                $scope.isLink = false;
            };

            $scope.linkChanged = function(){
                $scope.isLink = true;
                $http.post($rootScope.server_url + "/api/utils/youtube",{url: $scope.video.source}).success(function(response){
                    $scope.youtubeId ='';
                    if(response.id !== false) {
                        $scope.youtubeId = response.id;
                        $scope.video.type = 'youtube';
                    }
                });
            };

            $scope.getYt = function(videoId){
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
                Video.update({id: $scope.video.id}, $scope.video).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.video);
                });
            }
        }
    ]);
})();