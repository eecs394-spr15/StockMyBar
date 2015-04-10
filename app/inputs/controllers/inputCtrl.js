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
            supersonic.data.channel('barContents').publish(temp_barContents);
            supersonic.logger.log(temp_barContents);
            //supersonic.data.model('barContent').find(0).then( function(data) {
            //    data.barContents = temp_barContents;
            //    data.save();
            //});
        };
        MyBarService.getAllIngredients().then(function() {
            $scope.allIngredients = MyBarService.allIngredients;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients.push({item:item,checked:false});
            });
            $scope.$apply();
        });
    });