angular
    .module('results')
    .controller('ShoppingCartCtrl', function ($scope, supersonic) {
		$scope.shoppingList = angular.isDefined(localStorage.shoppingList) ? JSON.parse(localStorage.shoppingList) : [];
		
		$scope.clearAllItems = function(){
			$scope.shoppingList = [];
            localStorage.shoppingList = JSON.stringify($scope.shoppingList);
		};
    });