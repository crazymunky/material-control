/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('NoticiaListController',['$scope', 'Noticia', '$mdDialog', '$mdToast',
        function($scope, Noticia, $mdDialog, $mdToast){
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
                    if(newModel!== undefined)
                        $scope.noticias.push(newModel);
                });
            };
            $scope.delete = function(row, $event){
                $event.preventDefault();
                $event.stopPropagation();
                Noticia.delete({id:row.id}).$promise.then(function(response){
                    if(response.error)
                        $mdToast.show($mdToast.simple().content(response.error).theme("error-toast"));
                    else {
                        $mdToast.show($mdToast.simple().content(response.message));
                        var index = $scope.noticias.indexOf(row);
                        $scope.noticias.splice(index, 1);
                    }
                });
            };

            $scope.showEdit = function(row){
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AddNoticiaController',
                    templateUrl: 'partials/noticias/add.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            };
        }
    ]);
})();