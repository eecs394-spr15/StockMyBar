/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {

        $scope.ingredIdList = angular.isDefined(localStorage.ingredIdList) ? JSON.parse(localStorage.ingredIdList) : [];
        $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
        $scope.showActions = false;

        setTimeout(function() {
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
        }, 1000);
        

        supersonic.data.channel('ingredList').subscribe(function(message) {
            updateIngredList();
        });


        function createIngredPartJS(id,name){
            var obj = new Object();
            obj.id = id;
            obj.name = name;
            return obj;
        }

        function updateIngredList(){
            $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
            var newList = [];
            for(var i=0;i<$scope.ingredList.length;i++){
                newList.push(createIngredPartJS($scope.ingredList[i].id,$scope.ingredList[i].name));
            }
            $scope.ingredList = newList;
            $scope.$apply();
        }
        

        //need to implement deleting ingredient from recipe list after user swiped left
        $scope.showDeleteButton = function(index){
            $scope.showActions = true;
            $scope.selected = index;
            $scope.apply();
        };


        $scope.clearAllItems = function() {
            $scope.ingredIdList = [];
            $scope.ingredList = [];
            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            $scope.apply();
        };

		$scope.cancel = function(index) {
            $scope.showActions = false;
			var index1 = $scope.ingredIdList.indexOf($scope.ingredList[index].id);
			$scope.ingredIdList.splice(index1,1);
            $scope.ingredList.splice(index,1);
			localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
			supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            $scope.apply();
		};

        $scope.showButton = function(index){
            return $scope.showActions && (index==$scope.selected);
        }

        /* Open Add Items menu */
        $scope.addItems = function() {
            supersonic.ui.modal.show("inputs#itemMenu");
        }
    });
