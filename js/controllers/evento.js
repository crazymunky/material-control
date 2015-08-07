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

    angular.module('backendApp.controllers').controller('AddEventoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Evento','Upload',
        function($rootScope, $scope,$mdToast, $mdDialog, Evento, Upload){
            $scope.evento = new Evento();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.submitting = false;
            $scope.attempted = false;

            $scope.submit = function(){
                $scope.attempted = true;
                if(!$scope.form.$valid)
                    return false;

                if(!$scope.photoUploaded)
                    uploadAndSave();
                else
                    save();
            };

            function save() {
                $scope.evento.$save(function (response) {
                    $mdDialog.hide($scope.evento);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nuevo evento guardado"));
                }, function (response) {
                    $mdToast.show($mdToast.simple().content(response.data.error).theme("error-toast"));
                    $scope.submitting = false;
                });
            }
            $scope.progress = 0;
            $scope.photoUploaded = false;
            $scope.fileChanged = function(){
                $scope.photoUploaded = false;
            };
            function uploadAndSave() {
                $scope.submitting = true;
                Upload.upload({
                    url: $rootScope.upload_url,
                    file: $scope.evento.imagen
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.evento.imagen = data.url;
                    $scope.photoUploaded = true;
                    $scope.progress = 0;
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