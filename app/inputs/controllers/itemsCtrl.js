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
        $scope.ingredNum = angular.isDefined(localStorage.ingredNum) ? JSON.parse(localStorage.ingredNum) : {'liquor':0,'mixer':0,'fruit':0,'spice':0,'other':0};
        $scope.$apply();

        // Publish ingredient list to the appropriate channel
        setTimeout(function() {
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
        }, 1000);

        // Update ingredient list
        updateIngredList();

         supersonic.data.channel('ingredList').subscribe(function(message) {
            updateIngredList();
        });

        supersonic.data.channel('ingredNum').subscribe(function(message) {
            $scope.ingredNum = angular.isDefined(localStorage.ingredNum) ? JSON.parse(localStorage.ingredNum) : {'liquor':0,'mixer':0,'fruit':0,'spice':0,'other':0};
        });

        // Create Ingredient javascript object
        function createIngredJS(id,name,category){
            var obj = new Object();
            obj.id = id;
            obj.name = name;
            obj.category = category;
            return obj;
        }

        // Update ingredient list
        function updateIngredList(){
            $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
            var newList = [];
            for(var i=0;i<$scope.ingredList.length;i++){
                newList.push(createIngredJS($scope.ingredList[i].id,$scope.ingredList[i].name,$scope.ingredList[i].category));
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
            $scope.ingredNum = {'liquor':0,'mixer':0,'fruit':0,'spice':0,'other':0};

            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            localStorage.ingredNum = JSON.stringify($scope.ingredNum);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            supersonic.data.channel('ingredList').publish($scope.ingredIdList);
            supersonic.data.channel('ingredNum').publish($scope.ingredIdList);
            $scope.$apply();
        };

        // Delete item from My Bar
        $scope.cancel = function(index) {
            $scope.showActions = false;
            var index1 = $scope.ingredIdList.indexOf($scope.ingredList[index].id);
            $scope.ingredIdList.splice(index1,1);
            $scope.ingredNum[$scope.ingredList[index].category]--;
            $scope.ingredList.splice(index,1);
            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            localStorage.ingredNum = JSON.stringify($scope.ingredNum);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            supersonic.data.channel('ingredNum').publish($scope.ingredNum);
            $scope.$apply();
        };
                
        // Navigate to categories view
        $scope.addIngredient = function() {
            var view = new supersonic.ui.View("inputs#categories");
            supersonic.ui.layers.push(view);
        };

        // Select ingredient
        $scope.selectIngredient = function(index) {
            if ($scope.selected == index) {
                $scope.selected = -1;
            }
            else {
                $scope.selected = index;
            }
            $scope.$apply();
        };

        // Get icon for items
        $scope.getImageFilename = function(name) {
            supersonic.logger.log('../../ing_icns/'+name+'.jpg');
            return '../../ing_icns/'+name+'.jpg';
        };



        /*************
         *           *
         *  Styling  *
         *           *
         *************/

        // Inject shelves
        var injectShelves = function() {
            $('section.ingreds ul li:nth-child(4n)').each(function() {
                $(this).after('<div class="shelf"></div>');
            });
        };
        setTimeout(function() {
            injectShelves();
        }, 1000);


    });