/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {
        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
        $scope.barContents = [];

        $scope.updateBarContents = function(itemName) {
            //// Updates user's bar contents whenever they make a new selection in the Items view
            //supersonic.logger.log('before update: '+$scope.barContents);
            //supersonic.logger.log('before update according to service: '+MyBarService.barContents);
            var tempContents = $scope.barContents;
            if ($scope.checkedIngredients[itemName]) {
                $scope.barContents.push(itemName);
                //supersonic.logger.log("Checked");
            } else {
                $scope.barContents.splice($scope.barContents.indexOf(itemName), 1);
                //supersonic.logger.log("Unchecked");
            }
            //supersonic.bind($scope, 'barContents');
            $scope.$apply();
            //supersonic.logger.log($scope.barContents);
        };
        function reset() {
            //supersonic.logger.log("Resetting ingredients");
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.name] = false;
            });
            //supersonic.logger.log($scope.checkedIngredients);
            $scope.$apply();
        }
        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
        };
        supersonic.data.channel('allIngredients').subscribe( function(newVal) {
            $scope.allIngredients = newVal;
            reset();
            $scope.$apply();
            //supersonic.logger.log($scope.allIngredients);
        });
        supersonic.bind($scope, 'barContents');
    });