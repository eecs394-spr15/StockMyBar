/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {
        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
        $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
        supersonic.device.ready.then( function() {
            supersonic.logger.log(localStorage.barContents);
            supersonic.data.channel('barContents').publish(JSON.parse(localStorage.barContents));
        });

        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
            supersonic.ui.navigationBar.update({overrideBackButton: true});
        };

        $scope.confirm = function() {
            // Called when user pressed "CONFIRM" button
            angular.forEach($scope.checkedIngredients, function(value, key) {
                // Add newly checked ingredients to user's bar
                if (value) {
                    $scope.barContents.push(key);
                }
            });

            // Save and share changes to user's bar
            localStorage.barContents = JSON.stringify($scope.barContents);
            supersonic.data.channel('barContents').publish($scope.barContents);

            // Re-enable bottom tabs and return to previous view
            supersonic.ui.tabs.show();
            supersonic.ui.layers.pop();
        };

        supersonic.data.channel('allIngredients').subscribe( function(newVal) {
            $scope.allIngredients = newVal;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.name] = false;
            });
            $scope.$apply();
        });

        supersonic.data.channel('barContents').subscribe(function(message) {
            $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
            $scope.$apply();
        });
    });