angular
    .module('results')
    .controller('ShoppingCartCtrl', function ($scope, supersonic) {

		$scope.ingredShoppingList = angular.isDefined(localStorage.ingredShoppingList) ? JSON.parse(localStorage.ingredShoppingList) : [];
	
		$scope.clearAllItems = function(){
			$scope.ingredShoppingList = [];
            localStorage.ingredShoppingList = JSON.stringify($scope.ingredShoppingList);
		};

		$scope.selectIngred = function(index){
			$scope.selected = index;
		};
    });