Parse.Cloud.run('search4Recipes', { ingredientNames: ["coffee","whipped cream"] }, {
	success: function(recipeList) {
    	document.getElementById("test").innerHTML = recipeList[0].get("name");
	},
	error: function(error) {
		document.getElementById("test").innerHTML = "error";
	}
});