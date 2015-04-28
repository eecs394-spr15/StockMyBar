/* Input controller */

angular
	.module('inputs')
    .controller('CategoriesCtrl', function ($scope, MyBarService, supersonic) {


    	/* On category click --> show items to select within category */ 
    	$scope.chooseCategory = function(category){
            localStorage.category = category;
            var view = new supersonic.ui.View("inputs#itemSelect");
			supersonic.ui.layers.push(view);
        }

    });