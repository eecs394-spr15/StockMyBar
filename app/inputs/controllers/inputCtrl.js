/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {

        /* Deal with tabs when this view is visible */
        var stopListening = supersonic.ui.views.current.whenVisible( function() {
            supersonic.ui.tabs.hide();
        });


        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
        $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
        supersonic.device.ready.then( function() {
            supersonic.logger.log(localStorage.barContents);
            supersonic.data.channel('barContents').publish(JSON.parse(localStorage.barContents));
        });


        /* Clear search bar */
        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
        };


        /* Called when user pressed "CONFIRM" button */
        $scope.confirm = function() {
            angular.forEach($scope.checkedIngredients, function(value, key) {
                if (value) {
                    $scope.barContents.push(key);
                }
            });

            // Save and share changes to user's bar
            localStorage.barContents = JSON.stringify($scope.barContents);
            supersonic.data.channel('barContents').publish($scope.barContents);
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