/* Input controller */

angular
	.module('inputs')
    .controller('PrefCtrl', function ($scope, MyBarService, supersonic) {


        $scope.checkedIngredients = {};
        $scope.allIngredients = [];

        $scope.checkedPreferences = {};
        $scope.allPreferences = [];
        
        $scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
        $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];

        $scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
        $scope.prefList = angular.isDefined(localStorage.prefList) ? JSON.parse(localStorage.prefList) : [];

        supersonic.device.ready.then( function() {
            supersonic.logger.log(localStorage.ingredIdList);
            supersonic.data.channel('ingredIdList').publish(JSON.parse(localStorage.ingredIdList));
            supersonic.logger.log(localStorage.prefIdList);
            supersonic.data.channel('prefIdList').publish(JSON.parse(localStorage.prefIdList));
        });
        
        supersonic.data.channel('allIngredients').subscribe( function(newVal) {
            $scope.allIngredients = newVal;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.id] = false;
            });
            $scope.$apply();
        });

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


        /* Called when user pressed "CONFIRM" button */
        $scope.confirm = function() {
            angular.forEach($scope.checkedIngredients, function(value, key) {
                if (value) {
                    for(var i=0;i<$scope.allIngredients.length;i++){
                        if ($scope.allIngredients[i].id == key){
                            $scope.ingredList.push($scope.allIngredients[i]);
                            $scope.ingredIdList.push(key);
                            break;
                        }
                    }
                }
            });

            // Save and share changes to user's bar
            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);

            localStorage.prefIdList = JSON.stringify($scope.prefIdList);
            localStorage.prefList = JSON.stringify($scope.prefList);

            //supersonic.logger.log("ingredList:"+localStorage.ingredList);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            supersonic.data.channel('ingredList').publish($scope.ingredList);

            supersonic.data.channel('prefIdList').publish($scope.prefIdList);
            supersonic.data.channel('prefList').publish($scope.prefList);
            
            supersonic.ui.modal.hide();
        };
        
    });