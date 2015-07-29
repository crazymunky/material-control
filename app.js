(function(){
    'use strict';

    angular.module('backendApp', ['ngMaterial', 'ngResource', 'backendApp.controllers', 'backendApp.services'])
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('light-blue', {
                    'default': '400', // by default use shade 400 from the pink palette for primary intentions
                    'hue-1': '100', // use shade 100 for the <code>md-hue-1</code> class
                    'hue-2': '600', // use shade 600 for the <code>md-hue-2</code> class
                    'hue-3': 'A100' // use shade A100 for the <code>md-hue-3</code> class
                })
                // If you specify less than all of the keys, it will inherit from the
                // default shades
                .accentPalette('amber', {
                    'default': '200' // use shade 200 for default, and keep all other shades the same
                })
        });

    angular.module('backendApp.services',[]).factory('Noticia', function($resource){
        return $resource('http://192.168.235.153/musica_para_tus_oidos/public/api/noticias/:id');
    });

    angular.module('backendApp.controllers',[]).controller( 'ListController',['$scope', '$http', '$mdSidenav',
        function($scope,$http, $mdSidenav){
            $scope.noticias = Noticia.query();
            $scope.openLeftMenu = function() {
                $mdSidenav('side-nav').toggle();
            };
        }]);

})();