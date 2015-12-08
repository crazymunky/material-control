/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';

    angular.module('backendApp.controllers').controller('AnalyticsDetailsController', AnalyticsDetailsController);
    AnalyticsDetailsController.$inject = ['Ad', '$http', '$rootScope', '$scope', '$mdDialog'];
    function AnalyticsDetailsController(Ad, $http, $rootScope, $scope, $mdDialog) {
        var vm = this;
        vm.hide = function(){clearInterval(interval);$mdDialog.hide();}
        if($scope.selectedItem)
            vm.ad = $scope.selectedItem;

        vm.dataPrints = [];
        vm.labelsPrints = [];
        vm.seriesPrints = [];

        vm.seriesReproducciones = [];
        vm.seriesReproducciones = [];
        vm.seriesReproducciones = [];

        loadCharts();
        var interval = setInterval(updateInfo, 10000);
        function updateInfo(){
            Ad.get({id:vm.ad.id}, function(response){
                vm.ad = response;
            });
            loadCharts();

        }
        function loadCharts() {
            $http.get($rootScope.server_url + "/api/analytics/" + vm.ad.id).then(succcesLoadCharts);
        }
        function succcesLoadCharts(response) {
            vm.dataPrints = [];
            vm.seriesPrints = [];
            vm.labelsPrints = response.data.fechas;
            vm.seriesPrints.push("Impresiones");
            vm.dataPrints.push(response.data.prints);
            vm.seriesPrints.push("Clicks");
            vm.dataPrints.push(response.data.clicks);


            if (vm.ad.type == "video") {
                vm.dataReproducciones = [];
                vm.seriesReproducciones = [];
                vm.labelsReproducciones = response.data.fechas;

                vm.seriesReproducciones.push("Reproducciones");
                vm.dataReproducciones.push(response.data.reproducciones);
                vm.seriesReproducciones.push("Skips");
                vm.dataReproducciones.push(response.data.skips);
            }
        }
    }

})();