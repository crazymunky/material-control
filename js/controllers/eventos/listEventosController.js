/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('EventoListController',['$scope', 'Evento', '$mdDialog','$mdToast',
        function($scope, Evento, $mdDialog, $mdToast){
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
                    if(newEvent!== undefined) {
                        newEvent.fecha = new Date(newEvent.fecha);
                        $scope.eventos.push(newEvent);
                    }
                })
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
                    Evento.delete({id:row.id}).$promise.then(function(response){
                        if(response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.eventos.indexOf(row);
                            $scope.eventos.splice(index, 1);
                        }
                    });
                });

            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddEventoController',
                    templateUrl: 'partials/eventos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);

    angular.module('backendApp.controllers').controller('AddEventoController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Evento','Upload',
        function($rootScope, $scope,$mdToast, $mdDialog, Evento, Upload){
            if($scope.selectedItem!= undefined) {
                $scope.evento = $scope.selectedItem;
                $scope.evento.fecha = new Date($scope.evento.fecha);
                $scope.edit = true;
            }else
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

                if($scope.fileChanged)
                    uploadAndSave();
                else if($scope.edit)
                    update();
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
            $scope.fileChanged = false;
            $scope.fileChange = function(){
                $scope.fileChanged = true;
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
                    $scope.fileChanged = true;
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
            function update() {
                Evento.update({id: $scope.evento.id}, $scope.evento).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide($scope.evento);
                });
            }
        }
    ]);
})();