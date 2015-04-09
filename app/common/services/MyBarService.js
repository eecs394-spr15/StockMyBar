/* MyBarService service */

angular
	.module('common')
	.factory('MyBarService', function() {
        factory = {};
        factory.barContents = [];
        factory.allIngredients = [];
        factory.getAllIngredients = function() {
            Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
            var query = new Parse.Query("Ingredients");
            return query.find({
            success: function(results) {
                factory.allIngredients = [];
                for(var i=0; i<results.length; i++) {
                    factory.allIngredients.push(results[i].get("name"));
                }
                }
            });
        };
        return factory;
    });