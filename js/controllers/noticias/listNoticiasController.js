/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('NoticiaListController',['$rootScope','$scope', 'Noticia', '$mdDialog', '$mdToast','$state',
        function($rootScope, $scope, Noticia, $mdDialog, $mdToast, $state){
            $scope.noticias = Noticia.query();
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
                    controller: 'AddNoticiaController',
                    templateUrl: 'partials/noticias/add.html',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newModel){
                    if(newModel!= true)
                        $rootScope.addOrUpdateList($scope.noticias, newModel);
                });
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
                    Noticia.delete({id:row.id}).$promise.then(function(response){
                        if(response.error)
                            $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                        else {
                            $mdToast.show($mdToast.simple().content(response.message));
                            var index = $scope.noticias.indexOf(row);
                            $scope.noticias.splice(index, 1);
                        }
                    });
                });

            };

            $scope.showEdit = function(row){
                $scope.selectedItem = angular.copy(row);;
                var index = $scope.noticias.indexOf(row);
                $mdDialog.show({
                    controller: 'AddNoticiaController',
                    templateUrl: 'partials/noticias/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                }).then(function(edited){
                    if(edited!= true)
                        $rootScope.addOrUpdateList($scope.noticias, edited, index);
                    $state.go("noticias",{id:''}, {notify:false});
                });
            };
        }
    ]);
})();