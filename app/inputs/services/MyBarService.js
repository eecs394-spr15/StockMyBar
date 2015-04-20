/* MyBarService service */

angular
	.module('inputs')
	.factory('MyBarService', function(supersonic) {
        factory = {};
        factory.allIngredients = [];

        supersonic.logger.log("Getting all ingredients from database");
        Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
        var query = new Parse.Query("Ingredients");
        query.find({
            success: function (results) {
                factory.allIngredients = [];
                for (var i = 0; i < results.length; i++) {
                    factory.allIngredients.push({name: results[i].get("name")});
                }
                supersonic.data.channel('allIngredients').publish(factory.allIngredients);
            }, error: function(error) {
                supersonic.logger.log(error);
            }
        });

        return factory;
    });