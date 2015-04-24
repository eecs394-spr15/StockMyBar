/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {


        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
<<<<<<< HEAD
        $scope.category = '';
        $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
=======

        $scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
        $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];

>>>>>>> df8d21f54e5bf4e6c60952f545847df92afaf256
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

<<<<<<< HEAD

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
=======
>>>>>>> df8d21f54e5bf4e6c60952f545847df92afaf256
    });
