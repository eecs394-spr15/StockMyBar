/* Results controller */

angular
	.module('results')
	.controller('ResultsCtrl', function ($scope, supersonic) {

		supersonic.logger.log("wtf!!");

		Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");

		$scope.recipes = [];
		$scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
		$scope.noRecipesDisplayed = true;
		$scope.noneActive = true;
		$scope.ingredShoppingList = angular.isDefined(localStorage.ingredShoppingList) ? JSON.parse(localStorage.ingredShoppingList) : [];
		$scope.recipeShoppingList = [];
		$scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
		
		supersonic.logger.log($scope.prefIdList);

		if ($scope.ingredIdList.length == 0){
			search4RecipesByPrefs();
		}
		else{
			search4RecipesByIds();
			updateRecipeListByPreferences();
		}
		makeIngredShoppingList();
		
		// Update recipes' cart icons when shopping list is cleared
		supersonic.data.channel('clearShoppingList').subscribe(function() {
			$scope.ingredShoppingList = [];
			$scope.recipeShoppingList = [];
			for(var i=0; i<$scope.recipes.length; i++){
				$scope.recipes[i].addedToCart = false;
			}
			$scope.$apply();
		});

		supersonic.data.channel('ingredIdList').subscribe( function(newVal) {
			// Updates possible recipes anytime the user's bar contents change
			$scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
			$scope.recipeShoppingList = [];
			if ($scope.ingredIdList.length == 0){
				search4RecipesByPrefs();
			}
			else{
				search4RecipesByIds();
				updateRecipeListByPreferences();
			}
			makeIngredShoppingList();
		});

		supersonic.data.channel('prefIdList').subscribe( function(newVal) {
			// Updates possible recipes anytime the user's bar contents change
			supersonic.logger.log("wtf!!");
			$scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
			$scope.recipeShoppingList = [];
			if ($scope.ingredIdList.length == 0){
				search4RecipesByPrefs();
			}
			else{
				search4RecipesByIds();
				updateRecipeListByPreferences();
			}
			makeIngredShoppingList();
		});
		/*
		supersonic.data.channel('ingredIdList').subscribe( function(newVal) {
			// Updates possible recipes anytime the user's bar contents change
			ingList = newVal;
			$scope.recipeShoppingList = [];
			makeIngredShoppingList();
			Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
			Parse.Cloud.run("search4Recipes", {ingredientIds: ["Zb6NA5RZaw"]}, {
				success: function(results) {
					supersonic.logger.log($scope.recipes)
					$scope.recipes = results;
					$scope.noneActive = true;
					$scope.selected = null;
					for (var i=0; i<$scope.recipes.length; i++) {
						$scope.recipes[i].count = 0;
					}
				});
			} else{
				var tagNameList = [];
				for(var i=0;i<$scope.prefList.length;i++){
					tagNameList.push($scope.prefList[i].name);
				}
				Parse.Cloud.run("search4RecipesByPreferences", {preferenceNames: tagNameList}, {
					success: function(results1){
						$scope.recipes = results1;
						$scope.noneActive = true;
						$scope.selected = null;
						$scope.$apply();
					},
					error: function(error){
						supersonic.logger.log(error);
					}
				});
			}
		});
		*/	

		function search4RecipesByIds(){
			Parse.Cloud.run("search4Recipes", {ingredientIds: $scope.ingredIdList}, {
				success: function(results) {
					$scope.recipes = results;
					$scope.noneActive = true;
					$scope.selected = null;
					// for (var i=0; i<$scope.recipes.length; i++) {
					// 	$scope.recipes[i].count = 0;
					// }
					$scope.$apply();
				}, error: function(error) {
					supersonic.logger.log(error);
				}
			});
		}

		function search4RecipesByPrefs(){
			Parse.Cloud.run("search4RecipesByPreferences", {preferenceNames: $scope.prefIdList}, {
				success: function(results) {
					$scope.recipes = results;
					$scope.noneActive = true;
					$scope.selected = null;
					// for (var i=0; i<$scope.recipes.length; i++) {
					// 	$scope.recipes[i].count = 0;
					// }
					$scope.$apply();
				}, error: function(error) {
					supersonic.logger.log(error);
				}
			});
		}

		function updateRecipeListByPreferences(){
			var recipesBefore = $scope.recipes;

			if ($scope.prefIdList.length == 0){
				$scope.recipes = recipesBefore;
			}
			else{
				$scope.recipes = [];
				var addToList = false;
				for(var i=0;i<recipesBefore.length;i++){
					addToList = false;
					for(var j=0;j<$scope.prefIdList.length;j++){
						if (recipesBefore[i].tags.indexOf($scope.prefIdList[j]) != -1){
							addToList = true;
							break;
						}
					}
					if(addToList){
						$scope.recipes.push(recipesBefore[i]);
					}
				}
			}
			$scope.$apply();
		}

		function makeIngredShoppingList(){
			$scope.ingredShoppingList = [];
			var addToList = true;
			var temp;
			for(var i=0; i<$scope.recipeShoppingList.length; i++){
				for(var j=0; j<$scope.recipeShoppingList[i].ingredListOffHand.length; j++){
					addToList = true;
					for(var k=0; k<$scope.ingredShoppingList.length; k++){
						if ($scope.ingredShoppingList[k].id == $scope.recipeShoppingList[i].ingredListOffHand[j].id){
							$scope.ingredShoppingList[k].optional = $scope.ingredShoppingList[k].optional && $scope.recipeShoppingList[i].ingredListOffHand[j].optional;
							$scope.ingredShoppingList[k].recipes.push({id: $scope.recipeShoppingList[i].id, name: $scope.recipeShoppingList[i].name});
							addToList = false;
							break;
						}
					}
					if(addToList){
						temp  = JSON.parse( JSON.stringify( $scope.recipeShoppingList[i].ingredListOffHand[j] ) );
						temp.recipes.push({id: $scope.recipeShoppingList[i].id, name: $scope.recipeShoppingList[i].name});
						$scope.ingredShoppingList.push(temp);
					}
				}
			}
			$scope.ingredShoppingList.sort(function(a,b){
				if(a.optional == b.optional){
					return (a.name-b.name);
				}
				else{
					return ((!a.optional) && (b.optional))?-1:1;
				}
			});
			localStorage.ingredShoppingList = JSON.stringify($scope.ingredShoppingList);
			$scope.$apply();
		}

		/*
		$scope.incrementCount = function(index) {
			$scope.recipes[index].count++;
		};
		$scope.decrementCount = function(index) {
			if ($scope.recipes[index].count > 0) {
				$scope.recipes[index].count--;
			}
		};
		*/

		$scope.reset = function() {
			angular.forEach($scope.recipes, function(value,key) {
				$scope.recipes[key].count=0;
			});
		};

		/*
		$scope.show = function(index) {
				$('#item-' + index).next(".recipe-more").slideToggle("fast");
		};
		*/

		$scope.show = function(index) {
			$('#item-' + index).slideToggle("fast");
		};

		$scope.goToItems = function(){
			$location.path("inputs#items");
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
			$scope.ingredShoppingList = angular.isDefined(localStorage.ingredShoppingList) ? JSON.parse(localStorage.ingredShoppingList) : [];
			$scope.recipes[index].addedToCart = true;
			$scope.recipeShoppingList.push($scope.recipes[index]);
			makeIngredShoppingList();
			//supersonic.logger.log($scope.recipeShoppingList.length);
			$scope.$apply();
		};

		$scope.removeFromCart = function(index){
			$scope.ingredShoppingList = angular.isDefined(localStorage.ingredShoppingList) ? JSON.parse(localStorage.ingredShoppingList) : [];
			$scope.recipes[index].addedToCart = false;
			for(var i=0;i<$scope.recipeShoppingList.length;i++){
				if ($scope.recipes[index].id == $scope.recipeShoppingList[i].id){
					$scope.recipeShoppingList.splice(i,1);
					break;
				}
			}
			makeIngredShoppingList();
			//supersonic.logger.log($scope.recipeShoppingList.length);
			$scope.$apply();

		};

		$scope.openShoppingList = function(){
			var view = new supersonic.ui.View("results#shoppingcart");
            supersonic.ui.layers.push(view);
		}

		/*
		// Update recipes' cart icons when shopping list is cleared
		supersonic.data.channel('clearShoppingList').subscribe(function() {
			$scope.ingredShoppingList = [];
			$scope.recipeShoppingList = [];
			for(var i=0; i<$scope.recipes.length; i++){
				$scope.recipes[i].addedToCart = false;
			}
			$scope.$apply();
		});
		*/


	});
