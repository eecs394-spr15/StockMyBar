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
            removeShelves();
            injectShelves();
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
            // removeShelves();
            // injectShelves();
            $scope.$apply();
        };

        // Navigate to home view
        $scope.goHome = function() {
            var view = new supersonic.ui.View("inputs#home");
            supersonic.ui.layers.push(view);
        }
                
        // Navigate to categories view
        $scope.addIngredient = function() {
            var view = new supersonic.ui.View("inputs#categories");
            supersonic.ui.layers.push(view);
        };


        // Get icon for items
        $scope.getImageFilename = function(name) {
            return '../../ing_icns/'+name+'.jpg';
        };



        /*************
         *           *
         *  Styling  *
         *           *
         *************/

        // Remove/Inject shelves
        var removeShelves = function() {
            $('div.shelf').remove();
        };
        var injectShelves = function() {
            setTimeout(function() {
                $('section.ingreds ul li:nth-child(4n)').each(function() {
                    $(this).after('<div class="shelf"></div>');
                });
            }, 500);
        };
        injectShelves();


    });