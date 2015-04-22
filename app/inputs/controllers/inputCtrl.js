/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {


        $scope.checkedIngredients = {};
        $scope.allIngredients = [];

        $scope.checkedPreferences = {};
        $scope.allPreferences = [];
        
        $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
        $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];

        supersonic.device.ready.then( function() {
            supersonic.logger.log(localStorage.barContents);
            supersonic.data.channel('barContents').publish(JSON.parse(localStorage.barContents));
        });
        
        supersonic.data.channel('allIngredients').subscribe( function(newVal) {
            $scope.allIngredients = newVal;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.id] = false;
                //0: not added
                //1: not added but checked
                //2: added
                //item.condition = 0;
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


        /*
        supersonic.data.channel('barContents').subscribe(function(message) {
            $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
            $scope.$apply();
        });
        */


        /* Clear search bar */
        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
            supersonic.ui.navigationBar.update({overrideBackButton: true});
        };


        /* Called when user pressed "CONFIRM" button */
        $scope.confirm = function() {
            //var newBarContents = [];
            //var newIngredList = [];
            angular.forEach($scope.checkedIngredients, function(value, key) {
                if (value) {
                    for(var i=0;i<$scope.allIngredients.length;i++){
                        if ($scope.allIngredients[i].id == key){
                            //temp = JSON.stringfy(JSON.parse($scope.allIngredients[i]));
                            $scope.ingredList.push($scope.allIngredients[i]);
                            $scope.barContents.push(key);
                            break;
                        }
                    }
                }
            });

            //$scope.barContents = newBarContents;
            //$scope.ingredList = newIngredList;

            // Save and share changes to user's bar
            localStorage.barContents = JSON.stringify($scope.barContents);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            //supersonic.logger.log("ingredList:"+localStorage.ingredList);
            supersonic.data.channel('barContents').publish($scope.barContents);
            supersonic.data.channel('ingredList').publish($scope.ingredList);
            supersonic.ui.modal.hide();
        };
        
    });