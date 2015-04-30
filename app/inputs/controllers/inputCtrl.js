/* Input controller */

angular
	.module('inputs')
    .controller('InputCtrl', function ($scope, MyBarService, supersonic) {
        $scope.checkedIngredients = {};
        $scope.allIngredients = [];
        $scope.category = localStorage.category;
        $scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
        $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
        $scope.ingredNum = angular.isDefined(localStorage.ingredNum) ? JSON.parse(localStorage.ingredNum) : {'liquor':0,'mixer':0,'fruit':0,'spice':0,'other':0};

        supersonic.device.ready.then( function() {
            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            supersonic.data.channel('ingredIdList').publish(JSON.parse(localStorage.ingredIdList));
        });

        supersonic.data.channel('allIngredients').subscribe( function(newVal) {
            $scope.allIngredients = newVal;
            angular.forEach($scope.allIngredients,function(item){
                $scope.checkedIngredients[item.id] = false;
            });
            $scope.$apply();
        });


        /* Clear search bar */
        $scope.clearSearchBarText = function() {
            $scope.searchBarText = '';
            supersonic.ui.navigationBar.update({overrideBackButton: true});
        };


        /* Called when user pressed "CONFIRM" button */
        $scope.confirm = function() {
            angular.forEach($scope.checkedIngredients, function(value, key) {
                if (value) {
                    for(var i=0;i<$scope.allIngredients.length;i++){
                        if ($scope.allIngredients[i].id == key){
                            $scope.ingredList.push($scope.allIngredients[i]);
                            $scope.ingredIdList.push(key);
                            break;
                        }
                    }
                }
            });
            $scope.ingredNum = {'liquor':0,'mixer':0,'fruit':0,'spice':0,'other':0};
            for(var i=0;i<$scope.ingredList.length;i++){
                $scope.ingredNum[$scope.ingredList[i].category]++;
            }

            // Save and share changes to user's bar
            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            localStorage.ingredNum = JSON.stringify($scope.ingredNum);
            //supersonic.logger.log("ingredList:"+localStorage.ingredList);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            supersonic.data.channel('ingredList').publish($scope.ingredList);
            supersonic.data.channel('ingredNum').publish($scope.ingredNum);
            //supersonic.ui.modal.hide();
        };


        $scope.getImageFilename = function(name) {
            return '../../ing_icns/'+name+'.jpg';
        };

        /*
        $scope.setCategory = function(category){
            $scope.category = category;
            $scope.apply();
        }
        */
    });
