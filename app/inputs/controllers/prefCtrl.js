/* Input controller */

angular
	.module('inputs')
    .controller('PrefCtrl', function ($scope, supersonic) {

        $scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
        $scope.prefList = angular.isDefined(localStorage.prefList) ? JSON.parse(localStorage.prefList) : [];
        $scope.showActions = false;

        function createprefPartJS(id,name){
            var obj = new Object(); 
            obj.id = id; 
            obj.name = name; 
            return obj; 
        }

        function updateprefList(){
            $scope.prefList = angular.isDefined(localStorage.prefList) ? JSON.parse(localStorage.prefList) : [];
            var newList = [];
            for(var i=0;i<$scope.prefList.length;i++){
                newList.push(createprefPartJS($scope.prefList[i].id,$scope.prefList[i].name));
            }
            $scope.prefList = newList;
            $scope.$apply();
        } 
        /*
        setTimeout(function() {
            supersonic.data.channel('prefIdList').publish($scope.prefIdList);
        }, 1000);
        */

        supersonic.data.channel('prefList').subscribe(function(message) {
            updateprefList();
        });

        
        supersonic.data.channel('prefIdList').subscribe(function(message) {
            $scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
            $scope.$apply();
        });


        //need to implement deleting prefient from recipe list after user swiped left
        $scope.showDeleteButton = function(index){
            $scope.showActions = true;
            $scope.selected = index;
            $scope.apply();
        };


        $scope.clearAllItems = function() {
            $scope.prefIdList = [];
            $scope.prefList = [];
            localStorage.prefIdList = JSON.stringify($scope.prefIdList);
            localStorage.prefList = JSON.stringify($scope.prefList);
            supersonic.data.channel('prefIdList').publish($scope.prefIdList);
            $scope.apply();
        };

		$scope.cancel = function(index) {
            $scope.showActions = false;
			var index1 = $scope.prefIdList.indexOf($scope.prefList[index].id);
			$scope.prefIdList.splice(index1,1);  
            $scope.prefList.splice(index,1);
			localStorage.prefIdList = JSON.stringify($scope.prefIdList);
            localStorage.prefList = JSON.stringify($scope.prefList);
			supersonic.data.channel('prefIdList').publish($scope.prefIdList);
            $scope.apply();
		};

        $scope.showButton = function(index){
            return $scope.showActions && (index==$scope.selected);
        }

        /* Open Add Items menu */
        $scope.addItems = function() {
            supersonic.ui.modal.show("inputs#prefsSelect");
            supersonic.logger.log($scope.prefIdList);
        }
    });
