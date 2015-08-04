/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('EventoListController',['$scope', 'Evento', '$mdDialog',
        function($scope, Evento, $mdDialog){
            $scope.eventos = Evento.query();
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
                    controller: 'AddEventoController',
                    templateUrl: 'partials/eventos/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newEvent){
                    if(newEvent!== undefined)
                        $scope.eventos.push(newEvent);
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddEventoController',['$scope','$mdToast', '$mdDialog', 'Evento',
        function($scope,$mdToast, $mdDialog, Evento){
            $scope.evento = new Evento();

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
                        $scope.eventos.push(newEvent);
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