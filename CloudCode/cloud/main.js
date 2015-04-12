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
        queryJT.include("ingredient");
        queryJT.find({
        success: function(results2) {
            var ingredLengthList = [];
            var recipeList = [];
            var addRecipe;
            var addIngred;
            var addIngredPart;
            for(var i = 0; i < results2.length; i++){
                var repeat = false;
                addRecipe = results2[i].get("recipe");
                addIngred = results2[i].get("ingredient");
                addIngredPart = {id: addIngred.id, name: addIngred.get("name")};
                for(var j = 0; j < recipeList.length; j++){
                    if(addRecipe.id == recipeList[j].id){
                        repeat = true;
                        //recipeList[j].numInHand++;
                        recipeList[j].ingredListInHand.push(addIngredPart);
                        break;
                    }
                }
                if(!repeat){
                    //addRecipe.numInHand = 1;
                    //addRecipe.numAll = 0;
                    addRecipe.ingredListInHand = [addIngredPart];
                    addRecipe.ingredListOffHand = [];
                    recipeList.push(addRecipe);
                }
            }
            var queryAllIngred = new Parse.Query("Join_Table");  
            queryAllIngred.include("recipe");
            queryAllIngred.include("ingredient");
            queryAllIngred.containedIn("recipe",recipeList);
            var addToOffHand = true;
            queryAllIngred.find({
            success: function(results3) {
                for(var n=0; n < results3.length; n++){
                    addRecipe = results3[n].get("recipe");
                    addIngred = results3[n].get("ingredient");
                    addIngredPart = {id: addIngred.id, name: addIngred.get("name")};
                    for(var m=0; m < recipeList.length; m++){
                        if (addRecipe.id == recipeList[m].id){
                            //recipeList[m].numAll++;
                            addToOffHand = true;
                            for(var l=0; l<recipeList[m].ingredListInHand.length;l++){
                                if(recipeList[m].ingredListInHand[l].id == addIngredPart.id){
                                    addToOffHand = false;
                                    break;
                                }
                            }
                            if (addToOffHand){
                                recipeList[m].ingredListOffHand.push(addIngredPart);
                            }
                        }
                    }
                }
                recipeList.sort(function(a,b){
                    if (a.ingredListOffHand.length < b.ingredListOffHand.length)
                        return -1;
                    if (a.ingredListOffHand.length > b.ingredListOffHand.length)
                        return 1;
                    return 0;
                });
                response.success(recipeList);
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


 
Parse.Cloud.define("search4Recipes2", function(request, response) {
    var Recipe = Parse.Object.extend("Recipes");
    var Ingredient = Parse.Object.extend("Ingredients",{
        initialize: function(){
            //this.set("objectId", attrs.get("objectId"));
            //this.set("name", attrs.name);
            this.ingredListInHand = [];
            this.ingredListOffHand = [];
        }
    });
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
            var addIngredPart;
            for(var i = 0; i < results2.length; i++){
                var repeat = false;
                //addRecipe = new Recipe(results2[i].get("recipe"));
                addRecipe = new Recipe();
                addRecipe.id = (results2[i].get("recipe")).id;
                var x = (results2[i].get("recipe")).get("name");
                addRecipe.set("name", x);
                //addRecipe = results2[i].get("recipe");
                addIngred = results2[i].get("ingredient");
                addIngredPart = {id: addIngred.id, name: addIngred.get("name")};
                for(var j = 0; j < recipeList.length; j++){
                    if(addRecipe.id == recipeList[j].id){
                        repeat = true;
                        //recipeList[j].numInHand++;
                        recipeList[j].ingredListInHand.push(addIngredPart);
                        break;
                    }
                }
                if(!repeat){
                    //addRecipe.numInHand = 1;
                    //addRecipe.numAll = 0;
                    addRecipe.ingredListInHand = [addIngredPart];
                    addRecipe.ingredListOffHand = [];
                    recipeList.push(addRecipe);
                }
            }
            var queryAllIngred = new Parse.Query("Join_Table");  
            queryAllIngred.include("recipe");
            queryAllIngred.include("ingredient");
            queryAllIngred.containedIn("recipe",recipeList);
            var addToOffHand = true;
            queryAllIngred.find({
            success: function(results3) {
                for(var n=0; n < results3.length; n++){
                    addRecipe = results3[n].get("recipe");
                    addIngred = results3[n].get("ingredient");
                    addIngredPart = {id: addIngred.id, name: addIngred.get("name")};
                    for(var m=0; m < recipeList.length; m++){
                        if (addRecipe.id == recipeList[m].id){
                            //recipeList[m].numAll++;
                            addToOffHand = true;
                            for(var l=0; l<recipeList[m].ingredListInHand.length;l++){
                                if(recipeList[m].ingredListInHand[l].id == addIngredPart.id){
                                    addToOffHand = false;
                                    break;
                                }
                            }
                            if (addToOffHand){
                                recipeList[m].ingredListOffHand.push(addIngredPart);
                            }
                        }
                    }
                }
                recipeList.sort(function(a,b){
                    if (a.ingredListOffHand.length < b.ingredListOffHand.length)
                        return -1;
                    if (a.ingredListOffHand.length > b.ingredListOffHand.length)
                        return 1;
                    return 0;
                });
                response.success(recipeList);
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
