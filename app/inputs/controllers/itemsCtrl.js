/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {



       
        /*
         * UI Interaction Functionality
         */

        // Clear all ingredients from user's bar
        $scope.clearAllItems = function() {
            $scope.ingredIdList = [];
            $scope.ingredList = [];
            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            $scope.apply();
        };
        // Navigate to categories view to add a user's ingredient
        $scope.addIngredient = function() {
            var view = new supersonic.ui.View("inputs#categories");
            supersonic.ui.layers.push(view);
        };




        /*
         * Styling
         */

        // Inject shelves
        setTimeout(function() {
            $('section.ingreds ul li:nth-child(4n)').each(function() {
                $(this).after('<div class="shelf"></div>');
            });
        }, 1000);


    });
