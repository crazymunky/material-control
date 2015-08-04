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

    angular.module('backendApp.controllers').controller('AddAdController',['$scope','$mdToast', '$mdDialog', 'Ad', 'Upload',
        function($scope,$mdToast, $mdDialog, Ad, Upload){
            $scope.ad = new Ad();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.$watch('file', function () {
                $scope.upload($scope.ad.source);
            });
            // set default directive values
            // Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
            $scope.upload = function (file) {
                Upload.upload({
                    url: 'http://stg1.jwtdigitalpr.com/mpto/api/upload',
                    file: file
                }).progress(function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.file.name);
                }).success(function (data, status, headers, config) {
                    console.log('file ' + config.file.name + 'uploaded. Response: ' + data);
                }).error(function (data, status, headers, config) {
                    console.log('error status: ' + status);
                });
            };

            $scope.submit = function(){
                $scope.upload($scope.ad.source);
                /*$scope.ad.$save($scope.ad, function(response) {
                 $mdDialog.hide($scope.ad);
                 }, function(response){
                 $mdToast.show($mdToast.simple().content(response.data.error));
                 });*/
            };
        }
    ]);
})();