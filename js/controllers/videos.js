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

    angular.module('backendApp.controllers').controller('AddVideoController',['$scope','$mdToast', '$mdDialog', 'Video',
        function($scope,$mdToast, $mdDialog, Video){
            $scope.video = new Video();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.showInputDate = function (ev){
                $mdDialog.show({
                    template: '<time-date-picker ng-model="video.fecha"></time-date-picker>',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.videos.push(newEvent);
                });
            };

            $scope.submit = function(){
                $scope.video.$save($scope.video, function(response) {
                    $mdDialog.hide($scope.video);
                }, function(response){
                    $mdToast.show($mdToast.simple().content(response.data.error));
                });
            };
        }
    ]);
})();