/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('ComentarioController',['$scope', 'Comentario', '$mdDialog','$mdToast',
        function($scope, Comentario, $mdDialog, $mdToast){
            var data;

            Comentario.query().$promise.then(function(response){$scope.cuentos = data = response;});
            $scope.hide = $mdDialog.hide;

            $scope.options = {
                rowHeight: 'auto',
                footerHeight: false,
                headerHeight: 50,
                scrollbarV: false,
                selectable: false,
                columnMode: 'force'
            };

            $scope.filters = {
                aprobados: false,
                pendientes: false,
                rechazados: false
            };

            $scope.filter = function(newVal) {
                if(!data)return;
                if(!$scope.filters.aprobados &&!$scope.filters.pendientes && !$scope.filters.rechazados)
                    $scope.cuentos = data;
                else
                    $scope.cuentos = data.filter(function(d) {
                        var aprobado = d.aprobado;

                        switch(aprobado){
                            case 1:
                                var retorno = $scope.filters.aprobados;
                                break;
                            case 0:
                                var retorno = $scope.filters.rechazados;
                                break;
                            case -1:
                                var retorno = $scope.filters.pendientes;
                                break;
                        }
                        return retorno;
                    });
            };

            $scope.$watch('filters', $scope.filter , true);

            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Comentario.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.cuentos.indexOf(row);
                        $scope.cuentos.splice(index, 1);
                        data.splice(index, 1);
                }
                });
            };

            $scope.approve = function(row, isApproved, $event){
                $event.preventDefault();
                $event.stopPropagation();
                $mdDialog.hide();
                console.log("aprobar", row);
                row.aprobado = isApproved ? 1 : 0;
                $scope.filter();
                $scope.submitting = true;
                Comentario.update({id: row.id}, row).$promise.then(function(response){
                    $scope.submitting = false;
                    $mdDialog.hide(row);
                });

            };


            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    templateUrl: 'partials/cuentos/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new(),
                    controller: ShowComentarioController
                });
            };

            function ShowComentarioController($scope, $mdDialog){
                console.log("INIT");
                $scope.cuento = $scope.selectedItem;
            }
        }
    ]);
})();