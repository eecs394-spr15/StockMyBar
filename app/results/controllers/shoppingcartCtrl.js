angular
    .module('results')
    .controller('ShoppingCartCtrl', function ($scope, supersonic) {
        //var tempShoppingList = [];
        //supersonic.data.channel('barContents').subscribe( function(newVal) {
        //    tempShoppingList = newVal;
        //    $scope.shoppingList = tempShoppingList;

        //});
    	$scope.shoppingList = [];
    	var unsubscribe = supersonic.data.channel('haha').subscribe( function(message) {
		  supersonic.logger.log("received a message " + message);
		});
    	//supersonic.logger.log("haha"+$scope.shoppingList.length);
    });