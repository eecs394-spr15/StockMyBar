/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {


        $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];


        $scope.clearAllItems = function() {
            $scope.barContents = [];
            localStorage.barContents = JSON.stringify($scope.barContents);
            supersonic.data.channel('barContents').publish($scope.barContents);
        };


        supersonic.data.channel('barContents').subscribe(function(message) {
            $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
            $scope.$apply();
        });


        /* Open Add Items menu */
        $scope.addItems = function() {
            supersonic.ui.modal.show("inputs#itemSelect");
            supersonic.logger.log($scope.barContents);
        }
    });