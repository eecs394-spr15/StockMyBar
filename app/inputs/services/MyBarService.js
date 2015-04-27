/* Input(Ingredients and Preferences) service */

angular
	.module('inputs')
	.factory('MyBarService', function(supersonic) {
        factory = {};
        factory.allIngredients = [];
        factory.allPreferences = [];

        function createIngredJS(result){
            var obj = new Object();
            obj.category = result.get('category');
            obj.id = result.id;
            obj.name = result.get('name');
            obj.common_name = result.get('common_name');
            obj.description = result.get('description');
            obj.common = result.get('common');
            obj.price = result.get('price');
            obj.assumed = result.get('assumed');
            obj.tags = result.get('tags');
            return obj;
        }

        function createPrefTagJS(id,name){
            var obj = new Object();
            obj.id = id;
            obj.name = name;
            return obj;
        }

        Parse.initialize("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe", "gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");

        var query = new Parse.Query("Ingredients");
        query.find({
            success: function (results) {
                factory.allIngredients = [];
                for (var i = 0; i < results.length; i++) {
                    factory.allIngredients.push(createIngredJS(results[i]));
                }
                supersonic.data.channel('allIngredients').publish(factory.allIngredients);
            }, error: function(error) {
                supersonic.logger.log(error);
            }
        });

        var query = new Parse.Query("Preferences");
        query.find({
            success: function (results) {
                factory.allPreferences = [];
                for (var i = 0; i < results.length; i++) {
                    factory.allPreferences.push(createPrefTagJS(results[i].id,results[i].get("name")));
                }
                supersonic.data.channel('allPreferences').publish(factory.allPreferences);
            }, error: function(error) {
                supersonic.logger.log(error);
            }
        });

        return factory;
    });
