/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('VideoListController',VideoListController);
    VideoListController.$inject= ['$rootScope','$scope', 'Video', '$mdDialog', '$mdToast','$state'];

    function VideoListController($rootScope,$scope, Video, $mdDialog, $mdToast, $state){
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
            $scope.selectedItem = angular.copy(row);
            var index = $scope.videos.indexOf(row);
            $mdDialog.show({
                controller: 'AddVideoController',
                templateUrl: 'partials/videos/add.html',
                parent: angular.element(document.body),
                scope: $scope.$new()
            }).then(function (edited) {
                if (edited != true)
                    $rootScope.addOrUpdateList($scope.videos, edited, index);
                $state.go("videos", {id: ''}, {notify: false});
            });
        };
    }

})();