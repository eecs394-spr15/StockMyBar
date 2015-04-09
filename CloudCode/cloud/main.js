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
        queryJT.include("recipe");
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
		    response.success(recipeList);
        },
        error: function() {
            response.error("11");
        }
        });
    },
    error: function() {
        response.error("ingredient lookup failed");
    }
    });
});

Parse.Cloud.define("search4Recipes2", function(request, response) {
    var queryIngred = new Parse.Query("Ingredients");
    queryIngred.containedIn("name", request.params.ingredientNames);
    queryIngred.find({
    success: function(results1) {
        var queryJT = new Parse.Query("Join_Table");
        queryJT.containedIn("ingredient", results1);
        queryJT.include("recipe");
        queryJT.find({
        success: function(results2) {
            var recipeList = [];
            for(var i = 0; i < results2.length; i++){
                var repeat = false;
                for(var j = 0; j < recipeList.length; j++){
                    if(results2[i].get("recipe").id == recipeList[j].id){
                        repeat = true;
                        recipeList[j].numInHand++;
                        break;
                    }
                }
                if(!repeat){
                	results2[i].get("recipe").numInHand = 1;
                    recipeList.push(results2[i].get("recipe"));
                }
            }
            recipeList.sort(function(a,b){
				if (a.numInHand < b.numInHand)
					return 1;
				if (a.numInHand > b.numInHand)
					return -1;
				return 0;
			});

		    response.success(recipeList);
        },
        error: function() {
            response.error("11");
        }
        });
    },
    error: function() {
        response.error("ingredient lookup failed");
    }
    });
});
