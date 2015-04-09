angular
	.module('inputs', ['common'])
    .controller('InputCtrl', function ($scope, MyBarService) {
        $scope.barContents = MyBarService.barContents;
    });