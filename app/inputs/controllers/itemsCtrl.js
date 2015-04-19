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

        $scope.addItems = function() {
            // Open Add Items menu
            supersonic.ui.tabs.hide();
            var view = new supersonic.ui.View('inputs#itemSelect');
            supersonic.ui.layers.push(view);
        }
    });