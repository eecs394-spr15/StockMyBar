/* Input controller */

angular
	.module('inputs')
    .controller('PrefCtrl', function ($scope, MyBarService, supersonic) {

        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
        
        supersonic.data.channel('allPreferences').subscribe( function(newVal) {
            $scope.allPreferences = newVal;
            angular.forEach($scope.allPreferences,function(item){
                $scope.checkedPreferences[item.id] = false;
            });
            $scope.$apply();
        });

        /* Clear search bar */
        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
            supersonic.ui.navigationBar.update({overrideBackButton: true});
        };
    });

