/**
 * Created by Maxi on 7/31/2015.
 */
(function() {
    'use strict';
       angular.module('backendApp.controllers').controller('AddNoticiaController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Noticia','Categoria','Video','Cancion','Ad', 'Upload','Tag',
        function($rootScope,$scope,$mdToast, $mdDialog, Noticia, Categoria, Video, Cancion, Ad, Upload, Tag){
            if($scope.selectedItem!= undefined) {
                $scope.noticia = $scope.selectedItem;
                $scope.noticia.fecha = new Date($scope.noticia.fecha);
                $scope.noticia.categoria_id = $scope.noticia.categorias[0].id;
                $scope.noticia.video_id = $scope.noticia.video.id;
                $scope.noticia.cancion_id = $scope.noticia.cancion.id;
                $scope.edit = true;
            }else {
                $scope.noticia = new Noticia();
                $scope.noticia.tags = [];
            }

            $scope.categorias = Categoria.query();
            $scope.videos = Video.query();
            $scope.canciones = Cancion.query();
            $scope.ads = Ad.query();
            $scope.tags = Tag.query();

            $scope.posiciones = new Array(6);

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
            $scope.fileChanged = false;
            $scope.fileChange = function(){
                $scope.fileChanged = true;
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
                Noticia.update({id: $scope.noticia.id}, $scope.noticia).$promise.then(function(response){
                    $scope.submitting = false;
                    $scope.noticia = response;
                    $scope.noticia.fecha = new Date($scope.noticia.fecha);
                    $scope.noticia.categoria_id = $scope.noticia.categorias[0].id;
                    $scope.noticia.video_id = $scope.noticia.video.id;
                    $scope.noticia.cancion_id = $scope.noticia.cancion.id;
                    $mdDialog.hide(response);
                });
            }


            /****TAGS CHIPS **********/

            $scope.searchText = null;
            $scope.querySearch = querySearch;
            $scope.tags = loadTags();
            $scope.selectedTags = [];
            $scope.numberChips = [];
            $scope.numberChips2 = [];
            $scope.numberBuffer = '';
            /**
             * Search for tags.
             */
            function querySearch (query) {
                var results = query ? $scope.tags.then(function(data){
                    return data.filter(createFilterFor(query));
                }): [];
                return results;
            }

            /*
             * Add new tag if it doesnt exist
             */
            $scope.newTag =  function (chip){
                if(!chip.nombre) {
                    var newTag = {
                        nombre: chip
                    }
                    return newTag;
                }else
                    return chip;

            }

            /**
             * Create filter function for a query string
             */
            function createFilterFor(query) {
                var lowercaseQuery = angular.lowercase(query);
                return function filterFn(tag) {
                    return (tag.nombre.toLowerCase().indexOf(lowercaseQuery) === 0);
                };
            }
            function loadTags() {
                return Tag.query().$promise.then(function(data){
                    return data;
                });
            }
        }
    ]);
})();