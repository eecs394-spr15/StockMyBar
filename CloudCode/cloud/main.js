// Use Parse.Cloud.define to define as many cloud functions as you want.
// For example:
/*
Parse.Cloud.define("hello", function(request, response) {
  response.success("Hello world!!!!!");
});


function createRecipeJS(id,name){
    var obj = new Object();
    obj.id = id;
    obj.name = name;
    obj.ingredListOffHand = new Array();
    obj.ingredListInHand = new Array();
    return obj;
}

function createIngredPartJS(id,name){
    var obj = new Object();
    obj.id = id;
    obj.name = name;
    return obj;
}

Parse.Cloud.define("search4Recipes", function(request, response) {
    var queryIngred = new Parse.Query("Ingredients");
    queryIngred.containedIn("name", request.params.ingredientNames);
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
                addRecipeJS = createRecipeJS(addRecipe.id, addRecipe.get("name"));
                addIngredPartJS = createIngredPartJS(results2[i].get("ingredient").id, results2[i].get("ingredient").get("name"));
                for(var j = 0; j < recipeJSList.length; j++){
                    if(addRecipeJS.id == recipeJSList[j].id){
                        repeat = true;
                        recipeJSList[j].ingredListInHand.push(addIngredPartJS);
                        break;
                    }
                }
                if(!repeat){
                    addRecipeJS.ingredListInHand.push(addIngredPartJS);
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
                    addIngredPartJS = createIngredPartJS(results3[n].get("ingredient").id, results3[n].get("ingredient").get("name"));
                    for(var m=0; m < recipeJSList.length; m++){
                        if (results3[n].get("recipe").id == recipeJSList[m].id){
                            addToOffHand = true;
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
*/

Parse.Cloud.define("search4Recipes2", function(request, response) {
    var queryIngred = new Parse.Query("Ingredients");
    queryIngred.containedIn("name", request.params.ingredientNames);
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
                addRecipeJS = createRecipeJS(addRecipe.id, addRecipe.get("name"));
                addIngredPartJS = createIngredPartJS(results2[i].get("ingredient").id, results2[i].get("ingredient").get("name"));
                for(var j = 0; j < recipeJSList.length; j++){
                    if(addRecipeJS.id == recipeJSList[j].id){
                        repeat = true;
                        recipeJSList[j].ingredListInHand.push(addIngredPartJS);
                        break;
                    }
                }
                if(!repeat){
                    addRecipeJS.ingredListInHand.push(addIngredPartJS);
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
                    addIngredPartJS = createIngredPartJS(results3[n].get("ingredient").id, results3[n].get("ingredient").get("name"));
                    for(var m=0; m < recipeJSList.length; m++){
                        if (results3[n].get("recipe").id == recipeJSList[m].id){
                            addToOffHand = true;
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
                    var lengthA = a.ingredListOffHand.length;
                    var lengthB = b.ingredListOffHand.length;
                    if (lengthA < lengthB) {
                        return lengthA - lengthB;
                    }
                    else {
                        return lengthB - lengthA;
                    }
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


