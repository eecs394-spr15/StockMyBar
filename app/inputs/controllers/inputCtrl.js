/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {
        $scope.checkedIngredients = [];
        $scope.allIngredients = [];
        $scope.updateService = function() {
            // Updates user's bar contents whenever they make a new selection in the Items view
            $scope.recipes = [];
            temp_barContents = [];
            for (var i = 0; i < $scope.checkedIngredients.length; i++) {
                if ($scope.checkedIngredients[i].checked) {
                    temp_barContents.push($scope.checkedIngredients[i].item);
                }
            }
            supersonic.data.channel('barContents').publish(temp_barContents);
        };
        $scope.clearAllItems = function() {
            $scope.checkedIngredients = [];
            reset();
            $scope.updateService();
        };
        MyBarService.getAllIngredients().then(function() {reset();});
        var reset = function() {
            supersonic.logger.log("Resetting ingredients");
            $scope.allIngredients = MyBarService.allIngredients;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients.push({item:item,checked:false});
            });
            $scope.$apply();
        }
    });