/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {


        $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
        setTimeout(function() {
            supersonic.data.channel('barContents').publish($scope.barContents);
        }, 1000);

      //need to implement deleting ingredient from recipe list after user swiped left

         $scope.showActions = false;

        $scope.delete = function () {
           $scope.showActions = !$scope.showActions;
        };
        $scope.showDeleteButton = function(index){
            $scope.showActions = true;
            $scope.selected = index;
            supersonic.logger.log("we have index" + index);
     
        };


        $scope.clearAllItems = function() {
            $scope.barContents = [];
            localStorage.barContents = JSON.stringify($scope.barContents);
            supersonic.data.channel('barContents').publish($scope.barContents);
        };

				$scope.cancel = function(item) {
						var pos = $scope.barContents.indexOf(item)
						$scope.barContents.splice(pos,1)
						supersonic.logger.log($scope.barContents);
						localStorage.barContents = JSON.stringify($scope.barContents);
						supersonic.data.channel('barContents').publish($scope.barContents);
				};

        supersonic.data.channel('barContents').subscribe(function(message) {
            $scope.barContents = angular.isDefined(localStorage.barContents) ? JSON.parse(localStorage.barContents) : [];
            $scope.$apply();
        });


        /* Open Add Items menu */
        $scope.addItems = function() {
            supersonic.ui.modal.show("inputs#itemSelect");
            supersonic.logger.log($scope.barContents);
        }
    });
