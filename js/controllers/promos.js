/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('AdListController',['$scope', 'Ad', '$mdDialog', '$mdToast',
        function($scope, Ad, $mdDialog, $mdToast){
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
                }).then(function(newObj){
                    if(newObj!== undefined)
                        $scope.ads.push(newObj);
                });
            };

            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Ad.delete({id:row.id}).$promise.then(function(response){
                    console.log(response);
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.ads.indexOf(row);
                        $scope.ads.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddAdController',
                    templateUrl: 'partials/promos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddAdController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Ad', 'Upload',
        function($rootScope, $scope,$mdToast, $mdDialog, Ad, Upload){
            $scope.edit = false;
            $scope.submitting = false;
            $scope.attempted = false;
            $scope.progress = 0;
            $scope.fileChanged = false;

            if($scope.selectedItem!= undefined) {
                $scope.ad = $scope.selectedItem;
                $scope.edit = true;
            }else
                $scope.ad = new Ad;

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.adForm.$valid)
                    return false;

                if($scope.fileChanged)
                    uploadAndSave();
                else if($scope.edit)
                    update();
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



            function update() {
                Ad.update({id: $scope.ad.id}, $scope.ad).$promise.then(function(response){
                    console.log("finished", response);
                    $scope.submitting = false;
                    $mdDialog.hide($scope.ad);
                });
            }

            $scope.fileChange = function(){
                $scope.fileChanged = true;
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
                    $scope.fileChanged = false;
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

        }
    ]);
})();