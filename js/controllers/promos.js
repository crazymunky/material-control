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

    angular.module('backendApp.controllers').controller('AddAdController',['$scope','$mdToast', '$mdDialog', 'Ad',
        function($scope,$mdToast, $mdDialog, Ad){
            $scope.ad = new Ad();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.showInputDate = function (ev){
                $mdDialog.show({
                    template: '<time-date-picker ng-model="ad.fecha"></time-date-picker>',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.ads.push(newEvent);
                });
            };

            $scope.submit = function(){
                $scope.ad.$save($scope.ad, function(response) {
                    $mdDialog.hide($scope.ad);
                }, function(response){
                    $mdToast.show($mdToast.simple().content(response.data.error));
                });
            };
        }
    ]);
})();