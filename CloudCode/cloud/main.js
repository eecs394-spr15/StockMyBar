// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!!!!!");
});

Parse.Cloud.define("search4Recipes", function(request, response) {
    var queryIngred = new Parse.Query("Ingredients");
    queryIngred.containedIn("name", request.params.ingredientNames);
    queryIngred.find({
    success: function(results1) {
        var queryJT = new Parse.Query("Join_Table");
        queryJT.containedIn("ingredient", results1);
        queryJT.find({
        success: function(results2) {
            var recipeList = [];
            for(var i = 0; i < results2.length; i++){
                var repeat = false;
                for(var j = 0; j < recipeList.length; j++){
                    if(results2[i].get("recipe").id == recipeList[j].id){
                        repeat = true;
                        break;
                    }
                }
                if(!repeat){
                    recipeList.push(results2[i].get("recipe"));
                }
            }
            response.success(recipeList.length);
        },
        error: function() {
            response.error("11")
        }
        });
        //response.success("22");
    },
    error: function() {
        response.error("ingredient lookup failed");
    }
    });
	var queryIngred = new Parse.Query("Ingredients");
	queryIngred.containedIn("name", request.params.ingredientNames);
	queryIngred.find({
	success: function(results1) {
		var queryJT = new Parse.Query("Join_Table");
		queryJT.containedIn("ingredient", results1);
		queryJT.find({
		success: function(results2) {
			var recipeList = [];
			for(var i = 0; i < results2.length; i++){
				var repeat = false;
				for(var j = 0; j < recipeList.length; j++){
					if(results2[i].get("recipe").id == recipeList[j].id){
						repeat = true;
						break;
					}
				}
				if(!repeat){
					recipeList.push(results2[i].get("recipe"));
				}
			}
			response.success(recipeList.length);
		},
		error: function() {
			response.error("11")
		}
		});
		//response.success("22");
	},
	error: function() {
		response.error("ingredient lookup failed");
	}
	});
});
