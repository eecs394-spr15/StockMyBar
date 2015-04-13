/* Results controller */

angular
	.module('results')
	.controller('ResultsCtrl', function ($scope, supersonic, MyBarService) {
		var ingList = [];
		$scope.recipes = [];
<<<<<<< HEAD

=======
		$scope.noneActive = true;
>>>>>>> feature/database-algorithm
		supersonic.data.channel('barContents').subscribe( function(newVal) {
			// Updates possible recipes anytime the user's bar contents change
			ingList = newVal;
			Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
<<<<<<< HEAD
			Parse.Cloud.run("search4Recipes", {ingredientNames: ingList}, {
=======
			Parse.Cloud.run("search4Recipes2", {ingredientNames: ingList}, {
>>>>>>> feature/database-algorithm
				success: function(results) {
					$scope.recipes = results;
					$scope.noneActive = true;
					$scope.selected = null;
					$scope.$apply();
				}, error: function(error) {
					supersonic.logger.log(error);
				}
			});
		});

		// Change activeRecipe on UI click
<<<<<<< HEAD
		$scope.noneActive = true;
		$scope.activateRecipe = function(index) {
			$scope.noneActive = false;
			$scope.selected = index;
			$scope.activeRecipe =  $scope.recipes[index];
=======
			$scope.activateRecipe = function(index) {
			$scope.noneActive = false;
			$scope.selected = index;
			$scope.activeRecipe =  $scope.recipes[index];
			$scope.neededIngredients = $scope.recipes[index].ingredListOffHand;
			$scope.haveIngredients = $scope.recipes[index].ingredListInHand;
			$scope.$apply();
			/*
>>>>>>> feature/database-algorithm
			recipeId = $scope.activeRecipe.get('objectId');
			var query = new Parse.Query("Join_Table");
			query.include("ingredient");
			query.equalTo("recipe", $scope.activeRecipe);
			query.find({
  				success: function(results) {
					ingredientList = [];
					haveIngredientList = [];
  					for (var i = 0; i < results.length; i++) {
						currentName = results[i].get("ingredient").get("name");
						if (ingList.indexOf(currentName) == -1) {
							ingredientList.push(currentName);
						} else {
							haveIngredientList.push(currentName);
						}
  					}

					$scope.neededIngredients = ingredientList;
					$scope.haveIngredients = haveIngredientList;
<<<<<<< HEAD
					$scope.$apply()
=======
					$scope.$apply();
>>>>>>> feature/database-algorithm
  				},
				error: function(error) {
					$scope.test = 'baz';
				}
  			});
<<<<<<< HEAD
=======
			*/
>>>>>>> feature/database-algorithm
		};


	});