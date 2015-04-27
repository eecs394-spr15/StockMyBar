/* Input controller */

angular
	.module('inputs')
    .controller('ItemsCtrl', function ($scope, supersonic) {



       


        $scope.clearAllItems = function() {
            $scope.ingredIdList = [];
            $scope.ingredList = [];
            localStorage.ingredIdList = JSON.stringify($scope.ingredIdList);
            localStorage.ingredList = JSON.stringify($scope.ingredList);
            supersonic.data.channel('ingredIdList').publish($scope.ingredIdList);
            $scope.apply();
        };




        /*
         * Styling
         */
        // Inject shelves
        setTimeout(function() {
            $('section.ingreds ul li:nth-child(4n)').each(function() {
                $(this).after('<div class="shelf"></div>');
            });
        }, 1000);


    });
