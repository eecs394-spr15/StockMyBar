angular
    .module('results')
    .controller('ShoppingCartCtrl', function ($scope, supersonic) {

    	$scope.noneActive = true;
		$scope.ingredShoppingList = angular.isDefined(localStorage.ingredShoppingList) ? JSON.parse(localStorage.ingredShoppingList) : [];
		Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
			
		$scope.clearAllItems = function(){
			$scope.ingredShoppingList = [];
            localStorage.ingredShoppingList = JSON.stringify($scope.ingredShoppingList);
		};

		$scope.selectIngred = function(index){
			$scope.selected = index;
			$scope.noneActive = false;
			Parse.Cloud.run("search4Ingreds", {ingredientIds: [$scope.ingredShoppingList[index].id]}, {
				success: function(results) {
					$scope.activeIngred = results[0];
				},
				error: function(){
					supersonic.logger.log(error);
				}
			});
		};
    });