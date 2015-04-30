/* Input controller */

angular
    .module('inputs')
    .controller('PrefCtrl', function ($scope, supersonic) {

        $scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
        $scope.prefList = angular.isDefined(localStorage.prefList) ? JSON.parse(localStorage.prefList) : [];
        $scope.showActions = false;
        $scope.prefNum = angular.isDefined(localStorage.prefNum) ? JSON.parse(localStorage.prefNum):{'tequila':0,'gin':0,'rum':0,'vodka':0,'whiskey':0,'bitter':0,'salty':0,'sour':0,'sweet':0};
        //$scope.updateprefList();

        function createprefPartJS(id,name){
            var obj = new Object(); 
            obj.id = id; 
            obj.name = name; 
            return obj; 
        }

        $scope.updateprefList = function(){
            var newList = [];
            $scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
            angular.forEach($scope.prefNum, function(value, key) {
                if (value>0){
                    newList.push(key);
                }
            });
            $scope.prefIdList = newList;
            localStorage.prefIdList = JSON.stringify($scope.prefIdList);
            localStorage.prefNum = JSON.stringify($scope.prefNum);
            supersonic.data.channel('prefIdList').publish($scope.prefIdList);
            supersonic.logger.log($scope.prefIdList);
            $scope.$apply();
        } 
        

        /*
        supersonic.data.channel('prefIdList').subscribe(function(message) {
            $scope.prefIdList = angular.isDefined(localStorage.prefIdList) ? JSON.parse(localStorage.prefIdList) : [];
            $scope.$apply();
        });
        */


        //need to implement deleting prefient from recipe list after user swiped left
        
    });