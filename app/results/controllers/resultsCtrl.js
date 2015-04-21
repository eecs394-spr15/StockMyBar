/* Results controller */

angular
	.module('results')
	.controller('ResultsCtrl', function ($scope, supersonic) {

		var ingList = [];
		$scope.recipes = [];
		$scope.noneActive = true;
		$scope.ingredShoppingList = angular.isDefined(localStorage.ingredShoppingList) ? JSON.parse(localStorage.ingredShoppingList) : [];
		supersonic.data.channel('barContents').subscribe( function(newVal) {
			// Updates possible recipes anytime the user's bar contents change
			ingList = newVal;
			Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
			Parse.Cloud.run("search4Recipes", {ingredientNames: ingList}, {
				success: function(results) {
					$scope.recipes = results;
					$scope.noneActive = true;
					$scope.selected = null;
					for (var i=0; i<$scope.recipes.length; i++) {
						$scope.recipes[i].count = 0;
					}
					$scope.$apply();
				}, error: function(error) {
					supersonic.logger.log(error);
				}
			});
		});

		/* Update recipe quantity */
		$scope.incrementCount = function(index) {
			$scope.recipes[index].count++;
		};

		$scope.decrementCount = function(index) {
			if ($scope.recipes[index].count > 0) {
				$scope.recipes[index].count--;
			}
		};

		$scope.reset = function() {
			angular.forEach($scope.recipes, function(value,key) {
				$scope.recipes[key].count=0;
			});
		};

		/* Change activeRecipe on UI click */
		$scope.activateRecipe = function(index) {
			$scope.noneActive = false;
			$scope.selected = index;
			$scope.activeRecipe =  $scope.recipes[index];
			$scope.neededIngredients = $scope.recipes[index].ingredListOffHand;
			$scope.haveIngredients = $scope.recipes[index].ingredListInHand;
			$scope.$apply();
		};


		/* Add recipe to shopping cart */
		$scope.addToCart = function(index) {
			$scope.ingredShoppingList = angular.isDefined(localStorage.ingredShoppingList) ? JSON.parse(localStorage.ingredShoppingList) : [];
			$scope.recipeShoppingList.push($scope.recipes[index]);
			$scope.makeIngredShoppingList();
			localStorage.ingredShoppingList = JSON.stringify($scope.ingredShoppingList);
			$scope.apply();
		};

		$scope.makeIngredShoppingList = function(){
			var addToList = true;
			for(var i=0; i<$scope.recipeShoppingList.length; i++){
				for(var j=0; j<$scope.recipeShoppingList[i].ingredListOffHand.length; j++){
					addToList = true;
					for(var k=0; k<$scope.ingredShoppingList.length; k++){
						if ($scope.ingredShoppingList[k].id == $scope.recipeShoppingList[i].ingredListOffHand[j]){
							addToList = false;
							break;
						}
					}
					if(addToList){
						$scope.ingredShoppingList.push($scope.recipeShoppingList[i].ingredListOffHand[j]);
					}
				}
			}
		};
	});
