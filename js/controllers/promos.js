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
            $scope.ad = new Ad;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.$watch('file', function () {
                $scope.upload($scope.ad.source);
            });
            // set default directive values
            // Upload.setDefaults( {ngf-keep:false ngf-accept:'image/*', ...} );
            $scope.upload = function (file) {

            };

            $scope.progress = 0;
            $scope.submitting = false;

            $scope.submit = function(){
                $scope.submitting= true;
                Upload.upload({
                    url: 'http://stg1.jwtdigitalpr.com/mpto/api/upload',
                    file: $scope.ad.source
                }).progress(function(evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.ad.source = data.url;
                    $scope.ad.type = data.type;
                    $scope.ad.$save(function(response) {
                        $mdDialog.hide($scope.ad);
                    }, function(response){
                        $mdToast.show($mdToast.simple().content(response.data.error));
                    }).then(function(){
                        $scope.submitting=false;
                    });
                }).error(function (data, status, headers, config) {
                    $mdToast.show($mdToast.simple().content(data.error));
                }).then(function(){
                    $scope.ad.source="";
                    $scope.submitting=false;
                    $scope.progress=0;
                });

            };
        }
    ]);
})();