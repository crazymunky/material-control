/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('CancionListController',['$scope', 'Cancion', '$mdDialog',
        function($scope, Cancion, $mdDialog){
            $scope.canciones = Cancion.query();
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
                    controller: 'AddCancionController',
                    templateUrl: 'partials/canciones/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.canciones.push(newEvent);
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddCancionController',['$scope','$mdToast', '$mdDialog', 'Cancion',
        function($scope,$mdToast, $mdDialog, Cancion){
            $scope.cancion = new Cancion();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.showInputDate = function (ev){
                $mdDialog.show({
                    template: '<time-date-picker ng-model="cancion.fecha"></time-date-picker>',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.canciones.push(newEvent);
                });
            };

            $scope.submit = function(){
                $scope.cancion.$save($scope.cancion, function(response) {
                    $mdDialog.hide($scope.cancion);
                }, function(response){
                    $mdToast.show($mdToast.simple().content(response.data.error));
                });
            };
        }
    ]);
})();