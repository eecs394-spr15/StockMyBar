angular.module('inputs', ['common'])
    .controller('InputController', function ($scope, MyBarService) {
        $scope.barContents = MyBarService.barContents;
        //$scope.barContents = ['Tequila', 'Salt', 'Gin', 'coffee', 'whipped cream'];
    });