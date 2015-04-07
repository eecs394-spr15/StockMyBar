angular
	.module('results')
	.controller('ResultsCtrl', function($scope, supersonic) {

		Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
		
		var query = new Parse.Query("Recipes");
		query.find({
			success: function(results) {
				$scope.drinks = [];
				for (var i = 0; i < results.length; i++) {
					$scope.drinks[i] = {
						name: results[i].get("name"),
						ingredients: results[i].get("ingredients")
					};
				}

				$scope.activeDrink = $scope.drinks[10];

			},
			error: function(error) {
				supersonic.logger.log("Parse request failed.");
			}
		});
		//.then(function(result){
			//$scope.recipe = result.get("name");
		//});


	});