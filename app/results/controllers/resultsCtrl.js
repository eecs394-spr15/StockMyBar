/* Results controller */

angular
	.module('results')
	.controller('ResultsCtrl', function ($scope, supersonic) {


<<<<<<< HEAD
=======
		/* Deal with tabs when this view is visible */
        var stopListening = supersonic.ui.views.current.whenVisible( function() {
            supersonic.ui.tabs.show();
        });

>>>>>>> feature/shopping-cart-view
		var ingList = [];
		$scope.recipes = [];
		$scope.shoppingList = [];
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

<<<<<<< HEAD


		/* Update recipe quantity */
=======
		// Update recipe quantity
>>>>>>> feature/shopping-cart-view
		$scope.incrementCount = function(index) {
			$scope.recipes[index].count++;
		}
		$scope.decrementCount = function(index) {
			if ($scope.recipes[index].count > 0) {
				$scope.recipes[index].count--;
			}
		}

		$scope.reset = function() {
			angular.forEach($scope.recipes, function(value,key) {
				$scope.recipes[key].count=0;
			});
		}

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
			$scope.shoppingList.push($scope.recipes[index]);
<<<<<<< HEAD
			$scope.temp = 100;
			supersonic.data.channel('haha').publish('8');
=======
			localStorage.shoppingList = JSON.stringify($scope.shoppingList);
			supersonic.logger.log(localStorage.shoppingList.length);
>>>>>>> feature/shopping-cart-view
			$scope.apply();
		};


	});
