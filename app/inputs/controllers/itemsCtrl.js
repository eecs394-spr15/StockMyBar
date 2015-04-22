/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {

        $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
        $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
        $scope.showActions = false;

        /*
        setTimeout(function() {
            supersonic.data.channel('barContents').publish($scope.barContents);
        }, 1000);
        */

        supersonic.data.channel('ingredList').subscribe(function(message) {
            $scope.ingredList = angular.isDefined(localStorage.ingredList) ? JSON.parse(localStorage.ingredList) : [];
            supersonic.logger.log("received,ingredList:"+$scope.ingredList);
            $scope.$apply();
        });

        
        supersonic.data.channel('barContents').subscribe(function(message) {
            $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
            $scope.$apply();
        });


        //need to implement deleting ingredient from recipe list after user swiped left
        $scope.delete = function () {
           $scope.showActions = !$scope.showActions;
        };

        $scope.showDeleteButton = function(index){
            $scope.showActions = true;
            $scope.selected = index;
        };


        $scope.clearAllItems = function() {
            $scope.barContents = [];
            $scope.ingredList = [];
            localStorage.barContents = JSON.stringify($scope.barContents);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            supersonic.data.channel('barContents').publish($scope.barContents);
        };

		$scope.cancel = function(index) {
            $scope.showActions = false;
			var index1 = $scope.barContents.indexOf($scope.ingredList[index].id);
			$scope.barContents.splice(index1,1);  
            $scope.ingredList.splice(index,1);
			localStorage.barContents = JSON.stringify($scope.barContents);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            supersonic.logger.log($scope.ingredList);
            supersonic.logger.log($scope.barContents);
			supersonic.data.channel('barContents').publish($scope.barContents);
		};

        $scope.showButton = function(index){
            return $scope.showActions && (index==$scope.selected);
        }

        /*
        supersonic.data.channel('barContents').subscribe(function(message) {
            $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
            $scope.$apply();
        });
        */

        /* Open Add Items menu */
        $scope.addItems = function() {
            supersonic.ui.modal.show("inputs#itemSelect");
            supersonic.logger.log($scope.barContents);
        }
    });
