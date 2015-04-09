/* MyBarService service */

angular
	.module('common')
	.factory('MyBarService', function() {
        factory = {};
        factory.barContents = ['tequila', 'salt', 'gin', 'coffee', 'whipped cream'];
        return factory;
    });