/* Input controller */

angular
	.module('inputs')
    .controller('PrefCtrl', function ($scope, supersonic) {

        $scope.checkedPreferences = {};
        $scope.allPreferences = [];
        
        supersonic.data.channel('allPreferences').subscribe( function(newVal) {
            $scope.allPreferences = newVal;
            angular.forEach($scope.allPreferences,function(pref){
                $scope.checkedPreferences[pref.id] = false;
            });
            $scope.$apply();
        });

        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
            supersonic.ui.navigationBar.update({overrideBackButton: true});
        };
    });
