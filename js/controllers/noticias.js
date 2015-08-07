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

    angular.module('backendApp.controllers').controller('AddNoticiaController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Noticia','Categoria','Video','Cancion','Ad', 'Upload',
        function($rootScope,$scope,$mdToast, $mdDialog, Noticia, Categoria, Video, Cancion, Ad, Upload){
            $scope.noticia = new Noticia();
            $scope.categorias = Categoria.query();
            $scope.videos = Video.query();
            $scope.canciones = Cancion.query();
            $scope.ads = Ad.query();


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
                $scope.noticia.$save(function (response) {
                    $mdDialog.hide($scope.noticia);
                    $scope.submitting = false;
                    $mdToast.show($mdToast.simple().content("Nueva noticia guardada"));
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
                    file: $scope.noticia.imagen
                }).progress(function (evt) {
                    $scope.progress = parseInt(100.0 * evt.loaded / evt.total);
                }).success(function (data, status, headers, config) {
                    $scope.noticia.imagen= data.url;
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