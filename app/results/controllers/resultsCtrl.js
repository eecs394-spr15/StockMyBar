/* Results controller */

angular
	.module('results')
	.controller('ResultsCtrl', function ($scope, supersonic) {

		var ingList = [];
		$scope.recipes = [];
		$scope.noneActive = true;
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

		supersonic.logger.log('hi');


		// Update recipe quantity
		$scope.incrementCount = function(index) {
			$scope.recipes[index].count++;
		}
		$scope.decrementCount = function(index) {
			if ($scope.recipes[index].count > 0) {
				$scope.recipes[index].count--;
			}
		}

		// Change activeRecipe on UI click
		$scope.activateRecipe = function(index) {
			$scope.noneActive = false;
			$scope.selected = index;
			$scope.activeRecipe =  $scope.recipes[index];
			$scope.neededIngredients = $scope.recipes[index].ingredListOffHand;
			$scope.haveIngredients = $scope.recipes[index].ingredListInHand;
			$scope.$apply();
		};
	});
