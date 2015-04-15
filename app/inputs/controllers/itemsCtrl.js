/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {
        $scope.barContents = [];

        $scope.clearAllItems = function() {
            $scope.barContents = [];
            //supersonic.bind($scope, 'barContents');
        };
        supersonic.bind($scope, 'barContents');
    });