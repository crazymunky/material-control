/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
    angular.module('backendApp.controllers').controller('NoticiaListController',['$scope', 'Noticia', '$mdDialog',
        function($scope, Noticia, $mdDialog){
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
        }
    ]);

    angular.module('backendApp.controllers').controller('AddNoticiaController',['$scope','$mdToast', '$mdDialog', 'Noticia',
        function($scope,$mdToast, $mdDialog, Noticia){
            $scope.noticia = new Noticia();

            $scope.hide = function() {
                $mdDialog.hide();
            };

            $scope.showInputDate = function (ev){
                $mdDialog.show({
                    template: '<time-date-picker ng-model="noticia.fecha"></time-date-picker>',
                    parent: angular.element(document.body),
                    targetEvent: ev
                }).then(function(newModel){
                    if(newModel!== undefined)
                        $scope.noticias.push(newModel);
                });
            };

            $scope.submit = function(){
                $scope.noticia.$save($scope.noticia, function(response) {
                    $mdDialog.hide($scope.noticia);
                }, function(response){
                    $mdToast.show($mdToast.simple().content(response.data.error));
                });
            };
        }
    ]);
})();