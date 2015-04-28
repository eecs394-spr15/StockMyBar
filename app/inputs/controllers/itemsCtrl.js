/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {


        /*********************
         *                   *
         *  Data management  *
         *                   *
         *********************/

        // Initializations
        $scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
        $scope.ingredList = [];
        $scope.showActions = false;

        // Publish ingredient list to the appropriate channel
        setTimeout(function() {
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
        }, 1000);

        // Update ingredient list
        updateIngredList();

        // Update ingredient list
        function updateIngredList(){
            $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
            var newList = [];
            for(var i=0;i<$scope.ingredList.length;i++){
                newList.push(createIngredPartJS($scope.ingredList[i].id,$scope.ingredList[i].name));
            }
            $scope.ingredList = newList;
            $scope.$apply();
        }


       
        /**********************************
         *                                *
         *  UI Interaction Functionality  *
         *                                *
         **********************************/

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

        // Select ingredient
        $scope.selectIngredient = function() {

        }



        /*************
         *           *
         *  Styling  *
         *           *
         *************/

        // Inject shelves
        setTimeout(function() {
            $('section.ingreds ul li:nth-child(4n)').each(function() {
                $(this).after('<div class="shelf"></div>');
            });
        }, 1000);


    });
