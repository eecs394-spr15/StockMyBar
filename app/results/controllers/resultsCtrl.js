/* Results controller */


angular
	.module('results')
	.controller('ResultsCtrl', function($scope, supersonic) {


		// Initialize Parse
		Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");

		
		// Query the Recipe table, inject into DOM
		var recipeQuery = new Parse.Query("Recipes");
		recipeQuery.find({

			success: function(results) {
				$scope.drinks = [];
				for (var i=0; i<results.length; i++) {
					$scope.drinks[i] = {
						name: results[i].get("name"),
					};
				}
			},

			error: function(error) {
				supersonic.logger.log("Parse request failed.");
			}
		});


		// Query the Join_Table table, inject into DOM
		var ingredientQuery = new Parse.Query("Join_Table");
		ingredientQuery.find({

			success: function(results) {
				$scope.ingredients = [];
				for (var i=0; i<results.length; i++) {
					$scope.ingredients[i] = {
						name: results[i]
					};
				}
			},

			error: function(error) {
				supersonic.logger.log("Parse request failed.");
			}
		});


		// Change activeDrink on UI click
		$scope.activateDrink = function(index) {
			$scope.activeDrink = $scope.drinks[index];
		};


	});