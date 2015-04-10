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

 
Parse.Cloud.define("search4Recipes2", function(request, response) {
    var queryIngred = new Parse.Query("Ingredients");
    queryIngred.containedIn("name", request.params.ingredientNames);
    queryIngred.find({
    success: function(results1) {
        var queryJT = new Parse.Query("Join_Table");
        queryJT.containedIn("ingredient", results1);
        queryJT.include("recipe");
        queryJT.include("ingredient");
        queryJT.find({
        success: function(results2) {
            var ingredLengthList = [];
            var recipeList = [];
            var addRecipe;
            var addIngred;
            for(var i = 0; i < results2.length; i++){
                var repeat = false;
                addRecipe = results2[i].get("recipe");
                addIngred = results2[i].get("ingredient");
                for(var j = 0; j < recipeList.length; j++){
                    if(addRecipe.id == recipeList[j].id){
                        repeat = true;
                        //recipeList[j].numInHand++;
                        recipeList[j].ingredListInHand.push(addIngred);
                        break;
                    }
                }
                if(!repeat){
                    //addRecipe.numInHand = 1;
                    //addRecipe.numAll = 0;
                    addRecipe.ingredListInHand = [addIngred];
                    addRecipe.ingredListAll = [];
                    recipeList.push(addRecipe);
                }
            }
            var queryAllIngred = new Parse.Query("Join_Table");  
            queryAllIngred.include("recipe");
            queryAllIngred.include("ingredient");
            queryAllIngred.containedIn("recipe",recipeList);
            queryAllIngred.find({
            success: function(results3) {
                for(var n=0; n < results3.length; n++){
                    for(var m=0; m < recipeList.length; m++){
                        if (results3[n].get("recipe").id == recipeList[m].id){
                            //recipeList[m].numAll++;
                            recipeList[m].ingredListAll.push({id: results3[n].get("ingredient").id, name: (results3[n].get("ingredient")).get("name")});
                        }
                    }
                }
                recipeList.sort(function(a,b){
                    if ((a.ingredListAll.length-a.ingredListInHand.length) < (b.ingredListAll.length-b.ingredListInHand.length))
                        return -1;
                    if ((a.ingredListAll.length-a.ingredListInHand.length) > (b.ingredListAll.length-b.ingredListInHand.length))
                        return 1;
                    return 0;
                });
                response.success(recipeList[0].ingredListAll.length);
            },
            error: function(){
                response.error("no!!!");
            }
            });
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
