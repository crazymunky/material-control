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

    angular.module('backendApp.controllers').controller('AddNoticiaController',['$rootScope','$scope','$mdToast', '$mdDialog', 'Noticia','Categoria','Video','Cancion','Ad', 'Upload',
        function($rootScope,$scope,$mdToast, $mdDialog, Noticia, Categoria, Video, Cancion, Ad, Upload){
            if($scope.selectedItem!= undefined) {
                $scope.noticia = $scope.selectedItem;
                $scope.noticia.fecha = new Date($scope.noticia.fecha);
                $scope.noticia.categoria_id = $scope.noticia.categorias[0].id;
                $scope.noticia.video_id = $scope.noticia.video.id;
                $scope.noticia.cancion_id = $scope.noticia.cancion.id;
                $scope.edit = true;
            }else
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
                    console.log($scope.noticia);
                    $scope.noticia.fecha = new Date($scope.noticia.fecha);
                    $scope.noticia.categoria_id = $scope.noticia.categorias[0].id;
                    $scope.noticia.video_id = $scope.noticia.video.id;
                    $scope.noticia.cancion_id = $scope.noticia.cancion.id;
                    $mdDialog.hide(response);
                });
            }
        }
    ]);
})();