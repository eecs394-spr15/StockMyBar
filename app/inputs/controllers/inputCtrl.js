/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {
        $scope.checkedIngredients = [];
        $scope.allIngredients = [];
        $scope.updateService = function() {
            $scope.recipes = [];
            temp_barContents = [];
            for (var i = 0; i < $scope.checkedIngredients.length; i++) {
                if ($scope.checkedIngredients[i].checked) {
                    temp_barContents.push($scope.checkedIngredients[i].item);
                }
            }
            MyBarService.setBarContents(temp_barContents);
            supersonic.logger.log(MyBarService.getBarContents());
        };
        MyBarService.getAllIngredients().then(function() {
            $scope.allIngredients = MyBarService.allIngredients;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients.push({item:item,checked:false});
            });
            $scope.$apply();
        });
    });