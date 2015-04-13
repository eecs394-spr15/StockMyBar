/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {
<<<<<<< HEAD
        $scope.checkedIngredients = {};
=======
        $scope.checkedIngredients = [];
>>>>>>> feature/database-algorithm
        $scope.allIngredients = [];
        $scope.updateService = function() {
            // Updates user's bar contents whenever they make a new selection in the Items view
            $scope.recipes = [];
            temp_barContents = [];
<<<<<<< HEAD
            angular.forEach($scope.checkedIngredients, function(value, key) {
                if(value) {
                    temp_barContents.push(key);
                }
            });
            supersonic.data.channel('barContents').publish(temp_barContents);
        };
        $scope.clearAllItems = function() {
            $scope.checkedIngredients = {};
=======
            for (var i = 0; i < $scope.checkedIngredients.length; i++) {
                if ($scope.checkedIngredients[i].checked) {
                    temp_barContents.push($scope.checkedIngredients[i].item);
                }
            }
            supersonic.data.channel('barContents').publish(temp_barContents);
        };
        $scope.clearAllItems = function() {
            $scope.checkedIngredients = [];
>>>>>>> feature/database-algorithm
            reset();
            $scope.updateService();
        };
        MyBarService.getAllIngredients().then(function() {reset();});
        var reset = function() {
            supersonic.logger.log("Resetting ingredients");
            $scope.allIngredients = MyBarService.allIngredients;
<<<<<<< HEAD
            supersonic.logger.log($scope.allIngredients);
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.name] = false;
            });
            supersonic.logger.log($scope.checkedIngredients);
            $scope.$apply();
        };
        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
        };
=======
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients.push({item:item,checked:false});
            });
            $scope.$apply();
        }
>>>>>>> feature/database-algorithm
    });