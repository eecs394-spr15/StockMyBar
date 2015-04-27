// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!!!!!");
});



function createRecipeJS(id,name,description,directions){
    var obj = new Object();
    obj.id = id;
    obj.name = name;
    obj.ingredListOffHand = new Array();
    obj.ingredListInHand = new Array();
    obj.addedToCart = false;
    obj.directions = directions;
    obj.description = description;
    obj.tags = new Array();
    return obj;
}

function createIngredPartJS(id,name,optional,assumed){
    var obj = new Object();
    obj.id = id;
    obj.name = name;
    obj.optional = optional;
    obj.assumed = assumed;
    obj.recipes = new Array();
    return obj;
}


function createIngredJS(id,name,description){
    var obj = new Object();
    obj.id = id;
    obj.name = name;
    obj.description = description;
    return obj;
}


function createPrefJS(){
    var obj = new Object();
    obj.id = id;
    obj.name = name;
    return obj;
}

Parse.Cloud.define("search4Recipes", function(request, response) {
    var queryIngred = new Parse.Query("Ingredients");
    queryIngred.containedIn("objectId", request.params.ingredientIds);
    queryIngred.find({
    success: function(results1) {
        var queryJT = new Parse.Query("Join_Table");
        queryJT.include("recipe");
        queryJT.include("ingredient");
        queryJT.containedIn("ingredient", results1);
        queryJT.limit(1000);
        queryJT.find({
        success: function(results2) {
            var recipeList = new Array();
            var recipeJSList = new Array();
            var addRecipe;
            var addRecipeJS;
            var addIngredPartJS;
            for(var i = 0; i < results2.length; i++){
                var repeat = false;
                addRecipe = results2[i].get("recipe");

                addRecipeJS = createRecipeJS(addRecipe.id, addRecipe.get("name"), addRecipe.get("description"), addRecipe.get("directions"));
                addIngredPartJS = createIngredPartJS(results2[i].get("ingredient").id, results2[i].get("ingredient").get("name"), results2[i].get("ingredient").get("optional"), results2[i].get("ingredient").get("assumed"));
                for(var j = 0; j < recipeJSList.length; j++){
                    if(addRecipeJS.id == recipeJSList[j].id){
                        repeat = true;
                        recipeJSList[j].ingredListInHand.push(addIngredPartJS);
                        break;
                    }
                }
                if(!repeat){
                    addRecipeJS.ingredListInHand.push(addIngredPartJS);
                    for(var k=0;k<results2[i].get("recipe").get("tags").length;k++){
                        addRecipeJS.tags.push(results2[i].get("recipe").get("tags")[k]);
                    }
                    recipeList.push(addRecipe);
                    recipeJSList.push(addRecipeJS);
                }
            }
            var queryAllIngred = new Parse.Query("Join_Table");
            queryAllIngred.include("recipe");
            queryAllIngred.include("ingredient");
            queryAllIngred.containedIn("recipe",recipeList);
            queryAllIngred.limit(1000);
            queryAllIngred.find({
            success: function(results3) {
                var addToOffHand = true;
                for(var n=0; n < results3.length; n++){
                    addIngredPartJS = createIngredPartJS(results3[n].get("ingredient").id, results3[n].get("ingredient").get("name"), results3[n].get("ingredient").get("optional"), results3[n].get("ingredient").get("assumed"));
                    for(var m=0; m < recipeJSList.length; m++){
                        if (results3[n].get("recipe").id == recipeJSList[m].id){
                            addToOffHand = true;
                            if (addIngredPartJS.assumed) {
                                recipeJSList[m].ingredListInHand.push(addIngredPartJS);
                                break;
                            }
                            for(var l=0; l<(recipeJSList[m].ingredListInHand).length;l++){
                                if(recipeJSList[m].ingredListInHand[l].id == addIngredPartJS.id){
                                    addToOffHand = false;
                                    break;
                                }
                            }
                            if (addToOffHand){
                                recipeJSList[m].ingredListOffHand.push(addIngredPartJS);
                            }
                            break;
                        }
                    }
                }
                recipeJSList.sort(function(a,b){
                    if ((a.ingredListOffHand.length - b.ingredListOffHand.length) == 0){
                        if (a.name > b.name){
                            return 1;
                        }
                        else if(a.name < b.name){
                            return -1;
                        }
                        else{
                            return 0;
                        }
                    }
                    return a.ingredListOffHand.length - b.ingredListOffHand.length;
                });
                response.success(recipeJSList);
            },
            error: function(){
                response.error("result3 no!!!");
            }
            });
        },
        error: function() {
            response.error("result2 no!!!");
        }
        });
    },
    error: function() {
        response.error("result1 no!!!");
    }
    });
});



Parse.Cloud.define("search4Ingreds", function(request, response) {
    var queryIngred = new Parse.Query("Ingredients");
    queryIngred.containedIn("objectId", request.params.ingredientIds);
    queryIngred.find({
    success: function(results1) {
        var ingredList =[];
        var addIngred;
        for(var i=0; i<results1.length;i++){
            addIngred = createIngredJS(results1[i].id, results1[i].get("name"), results1[i].get("description"));
            ingredList.push(addIngred);
        }
        response.success(ingredList);
    },
    error: function(){
        response.error("ingred query failed!");
    }
    });
});


Parse.Cloud.define("search4RecipesByPreferences", function(request, response) {
    var queryRecipe = new Parse.Query("Recipes");
    queryRecipe.containedIn("tags", request.params.preferenceNames);
    queryRecipe.limit(1000);
    queryRecipe.find({
    success: function(results) {
        var recipeList =[];
        var recipeJSList = [];
        var addRecipe;
        var addRecipeJS;
        for(var i=0; i<results.length;i++){
            addRecipe = results[i];
            addRecipeJS = createRecipeJS(results[i].id, results[i].get("name"), results[i].get("description"),results[i].get("directions"));
            recipeList.push(addRecipe);
            recipeJSList.push(addRecipeJS);
        }
        //response.success(recipeJSList);
        var queryJT = new Parse.Query("Join_Table");
        queryJT.include("recipe");
        queryJT.include("ingredient");
        queryJT.containedIn("recipe", recipeList);
        queryJT.limit(1000);
        queryJT.find({
        success: function(results1) {
            for(var j=0; j<results1.length;j++){
                for(var k=0; k<recipeJSList.length;k++){
                    if (recipeJSList[k].id == results1[j].get("recipe").id){
                        recipeJSList[k].ingredListOffHand.push(createIngredPartJS(results1[j].get("ingredient").id,results1[j].get("ingredient").get("name"),results1[j].get("ingredient").get("optional"), results1[j].get("ingredient").get("assumed")));
                        break;
                    }
                }
            }
            recipeJSList.sort(function(a,b){
                if ((a.ingredListOffHand.length - b.ingredListOffHand.length) == 0){
                    if (a.name > b.name){
                        return 1;
                    }
                    else if(a.name < b.name){
                        return -1;
                    }
                    else{
                        return 0;
                    }
                }
                return a.ingredListOffHand.length - b.ingredListOffHand.length;
            });
            response.success(recipeJSList);
        },
        error: function(){
            response.error("ingred query failed!");
        }
        });
    },
    error: function() {
        response.error("result no!!!");
    }
    });
});
