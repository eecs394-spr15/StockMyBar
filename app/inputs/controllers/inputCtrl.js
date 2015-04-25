/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {
        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
        $scope.category = localStorage.category;
        $scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
        $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
        
        supersonic.device.ready.then( function() {
            supersonic.logger.log(localStorage.ingredIdList);
            supersonic.data.channel('ingredIdList').publish(JSON.parse(localStorage.ingredIdList));
        });

        supersonic.data.channel('allIngredients').subscribe( function(newVal) {
            $scope.allIngredients = newVal;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.id] = false;
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
            //supersonic.logger.log("ingredList:"+localStorage.ingredList);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            supersonic.data.channel('ingredList').publish($scope.ingredList);
            supersonic.ui.modal.hide();
        };

        $scope.setCategory = function(category){
            $scope.category = category;
            $scope.apply();
        }
    });
