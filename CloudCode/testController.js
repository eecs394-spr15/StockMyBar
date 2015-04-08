Parse.initialze("Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe","gIPArJcAQFVGCoVLKuJoIRGGzoG9gL5IDCq1NWPI");
Parse.Cloud.run('search4Recipes', { ingredientNames: ["coffee","whipped cream"] }, {
	success: function(recipeList) {
    	document.getElementById("test").innerHTML = recipeList[0].get("name");
	},
	error: function(error) {
		document.getElementById("test").innerHTML = "error";
	}
});