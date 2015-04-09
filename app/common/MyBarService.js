angular.module('common')
.factory('MyBarService', function() {
        factory = {};
        //factory.barContents = ['Tequila', 'Salt', 'Gin', 'coffee', 'whipped cream'];
        factory.barContents = ['bourbon', 'whipped cream'];
        return factory;
    });