(function(){
    'use strict';

    var module = angular.module('backendApp.services', []);

    module.factory('Noticia', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/noticias/:id');
    });

    module.factory('Cancion', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/canciones/:id');
    });

    module.factory('Categoria', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/categorias/:id');
    });

})();