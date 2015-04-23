/* Input controller */

angular
	.module('inputs')
    .controller('PrefSelectCtrl', function ($scope, MyBarService, supersonic) {

        $scope.checkedPreferences = {};
        $scope.allPreferences = [];

        $scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
        $scope.prefList = angular.isDefined(localStorage.prefList) ? JSON.parse(localStorage.prefList) : [];


        supersonic.device.ready.then( function() {
            supersonic.logger.log(localStorage.prefIdList);
            supersonic.data.channel('prefIdList').publish(JSON.parse(localStorage.prefIdList));
        });
        
        supersonic.data.channel('allPreferences').subscribe( function(newVal) {
            $scope.allPreferences = newVal;
            angular.forEach($scope.allPreferences,function(item){
                $scope.checkedPreferences[item.id] = false;
            });
            $scope.$apply();
        });


        /* Called when user pressed "CONFIRM" button */
        $scope.confirm = function() {
            angular.forEach($scope.checkedPreferences, function(value, key) {
                if (value) {
                    for(var i=0;i<$scope.allPreferences.length;i++){
                        if ($scope.allPreferences[i].id == key){
                            $scope.prefList.push($scope.allPreferences[i]);
                            $scope.prefIdList.push(key);
                            break;
                        }
                    }
                }
            });


            // Save and share changes to user's bar
            localStorage.prefIdList = JSON.stringify($scope.prefIdList);
            localStorage.prefList = JSON.stringify($scope.prefList);
            //supersonic.logger.log("ingredList:"+localStorage.ingredList);
            supersonic.data.channel('prefIdList').publish($scope.prefIdList);
            supersonic.data.channel('prefList').publish($scope.prefList);
            supersonic.ui.modal.hide();

        };
        /* Clear search bar */
        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
            supersonic.ui.navigationBar.update({overrideBackButton: true});
        };
    });

