/* Input controller */

angular
	.module('inputs')
    .controller('CategoriesCtrl', function ($scope, MyBarService, supersonic) {


    	/* On category click --> show items to select within category */ 
    	

        $scope.ingredNum = angular.isDefined(localStorage.ingredNum) ? JSON.parse(localStorage.ingredNum) : {'liquor':0,'mixer':0,'fruit':0,'spice':0,'other':0};
        supersonic.data.channel('ingredNum').subscribe( function(newVal) {
            $scope.ingredNum = JSON.parse(localStorage.ingredNum);
            $scope.$apply();
        });

        /* On category click --> show items to select within category */
        $scope.chooseCategory = function(category){
            localStorage.category = category;
            var view = new supersonic.ui.View("inputs#itemSelect");
            supersonic.ui.layers.push(view);
        }
    });