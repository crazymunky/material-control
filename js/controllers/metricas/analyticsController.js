/**
 * Created by Maxi on 7/31/2015.
 */
(function () {
    'use strict';

    angular.module('backendApp.controllers').controller('AnalyticsController', AnalyticsController);
    AnalyticsController.$inject = ['Ad', '$http', '$rootScope', '$scope', '$state', '$mdDialog'];
    function AnalyticsController(Ad, $http, $rootScope, $scope, $state, $mdDialog) {
        var vm = this;

        vm.ads = Ad.query();
        vm.options = {
            rowHeight: "auto",
            footerHeight: false,
            headerHeight: 50,
            scrollbarV: false,
            selectable: false,
            columnMode: 'force'
        };


        var data = [];
        vm.data = data;
        vm.labels = [];
        vm.series = [];
        vm.seriesEnabled = [true, true];

        vm.filter = function(newVal) {
            if(data.length == 0 ) return;
            vm.data = [];
            vm.series  = [];
            vm.labels = data.fechas;
            if(vm.seriesEnabled[0]){
                vm.series.push("Clicks");
                vm.data.push(data.clicks)
            }
            if(vm.seriesEnabled[1]){
                vm.series.push("Impresiones");
                vm.data.push(data.prints)
            }
        };


        $scope.$watch('vm.seriesEnabled', vm.filter , true);
        //STATS API
        $http.get($rootScope.server_url + "/api/analytics").then(function(response){
            //console.log("api request got" +response);
            data = response.data;
            vm.filter();
        });

        vm.showDetails  = navigateToItem;
        function navigateToItem(row){
            $state.go("analytics",{id:row.id}, {notify:false});
            showDetails(row);
        };
        function showDetails(row) {
            var index = vm.ads.indexOf(row);
            row = Ad.get({id:row.id}, function(){
                vm.ads[index] = row;
                $scope.selectedItem = row;
                $mdDialog.show({
                    controller: 'AnalyticsDetailsController',
                    controllerAs: 'vm',
                    templateUrl: 'partials/analytics/details.html',
                    parent: angular.element(document.body),
                    scope: $scope.$new()
                });
            });
        };
    }
})();