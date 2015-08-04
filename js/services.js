(function(){
    'use strict';

    var module = angular.module('backendApp.services', []);

    module.factory('Ad', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/ads/:id');
    });

    module.factory('Cancion', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/canciones/:id');
    });

    module.factory('Categoria', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/categorias/:id');
    });

    module.factory('Disco', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/discos/:id');
    });

    module.factory('Evento', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/eventos/:id');
    });

    module.factory('Noticia', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/noticias/:id');
    });

    module.factory('Video', function($resource){
        return $resource('http://stg1.jwtdigitalpr.com/mpto/api/videos/:id');
    });

})();