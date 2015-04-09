/* Results controller */


angular
	.module('results')
	.controller('ResultsCtrl', function($scope, supersonic) {
		ingList = ['bourbon'];
		$scope.recipes = [];
		Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");

		Parse.Cloud.run("search4Recipes", {ingredientNames: ingList}, function(results) {
			$scope.recipes = results;
		});


		//$scope.recipes = [
		//	{
		//		name: "Recipe 1",
		//		ingredients: ["Ingredient 1", "Ingredient 2", "Ingredient 3"]
		//	},
		//	{
		//		name: "Recipe 2",
		//		ingredients: ["Ingredient 4", "Ingredient 5", "Ingredient 6"]
		//	},
		//	{
		//		name: "Recipe 3",
		//		ingredients: ["Ingredient 7", "Ingredient 8", "Ingredient 9"]
		//	},
		//	{
		//		name: "Recipe 4",
		//		ingredients: ["Ingredient 10", "Ingredient 11", "Ingredient 12"]
		//	},
		//	{
		//		name: "Recipe 5",
		//		ingredients: ["Ingredient 13", "Ingredient 14", "Ingredient 15"]
		//	},
		//	{
		//		name: "Recipe 6",
		//		ingredients: ["Ingredient 16", "Ingredient 17", "Ingredient 18"]
		//	},
		//	{
		//		name: "Recipe 7",
		//		ingredients: ["Ingredient 19", "Ingredient 20", "Ingredient 21"]
		//	},
		//	{
		//		name: "Recipe 8",
		//		ingredients: ["Ingredient 22", "Ingredient 23", "Ingredient 24"]
		//	},
		//	{
		//		name: "Recipe 9",
		//		ingredients: ["Ingredient 25", "Ingredient 26", "Ingredient 27"]
		//	},
		//	{
		//		name: "Recipe 10",
		//		ingredients: ["Ingredient 28", "Ingredient 29", "Ingredient 30"]
		//	}
		//];



		// Change activeRecipe on UI click
		$scope.noneActive = true;
		$scope.activateRecipe = function(index) {
			$scope.noneActive = false;
			$scope.activeRecipe = $scope.recipes[index];
		};


	});