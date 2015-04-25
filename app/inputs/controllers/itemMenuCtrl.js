/* Item Menu controller */

angular
	.module('inputs')
    .controller('ItemMenu', function ($scope, MyBarService, supersonic) {
        
        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
        $scope.showIngredients = [];
        $scope.selectedIngredients =[];
        $scope.$apply();

        /*
        supersonic.device.ready.then( function() {
            //supersonic.logger.log(localStorage.ingredIdList);
            supersonic.data.channel('ingredIdList').publish(JSON.parse(localStorage.ingredIdList));
        });
        
        
        supersonic.data.channel('allIngredients').subscribe( function(newVal) {
            $scope.allIngredients = newVal;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.id] = false;
            });
            $scope.$apply();
        });
        */

        $scope.chooseCategory = function(cate_name){
            localStorage.category = cate_name;           
            //supersonic.logger.log("yeah"+localStorage.showIngredients);
            supersonic.ui.modal.show("inputs#itemSelect");
        }
        
    });
