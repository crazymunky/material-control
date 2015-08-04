/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('DiscoListController',['$scope', 'Disco', '$mdDialog',
        function($scope, Disco, $mdDialog){
            $scope.discos = Disco.query();
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
                    controller: 'DiscoController',
                    templateUrl: 'partials/discos/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.discos.push(newEvent);
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('DiscoController',['$scope','$mdToast', '$mdDialog', 'Disco',
        function($scope,$mdToast, $mdDialog, Disco){
            $scope.evento = new Disco();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.showInputDate = function (ev){
                $mdDialog.show({
                    template: '<time-date-picker ng-model="evento.fecha"></time-date-picker>',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.discos.push(newEvent);
                });
            };

            $scope.submit = function(){
                $scope.evento.$save($scope.evento, function(response) {
                    $mdDialog.hide($scope.evento);
                }, function(response){
                    $mdToast.show($mdToast.simple().content(response.data.error));
                });
            };
        }
    ]);
})();