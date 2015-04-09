angular.module('common')
.factory('MyBarService', function() {
        factory = {};
        factory.barContents = ['tequila', 'salt', 'gin', 'coffee', 'whipped cream'];
        //factory.barContents = ['bourbon', 'whipped cream'];
        return factory;
    });