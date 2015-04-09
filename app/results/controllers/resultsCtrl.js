/* Results controller */

angular
	.module('results', ['common'])
	.controller('ResultsCtrl', function ($scope, supersonic, MyBarService) {
		var ingList = [];
		$scope.recipes = [];
		Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");

		var barContentsUpdated = function() {
			ingList = MyBarService.barContents;
			$scope.recipes = [];
			Parse.Cloud.run("search4Recipes", {ingredientNames: ingList}, function(results) {
				$scope.recipes = results;
				$scope.$apply();
			});
		};

        var stopListening = supersonic.ui.views.current.whenVisible( function() {
            if(MyBarService.barContents != ingList) {
                supersonic.logger.log('Updating List:' + MyBarService.barContents);
                barContentsUpdated();
            }
        });

		// Change activeRecipe on UI click
		$scope.noneActive = true;
		$scope.activateRecipe = function(index) {
			$scope.noneActive = false;
			$scope.selected = index;
			$scope.activeRecipe =  $scope.recipes[index];
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
					$scope.$apply()
  				},
				error: function(error) {
					$scope.test = 'baz';
				}
  			});
		};


	});