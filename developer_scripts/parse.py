# This is a file of python functions that interact with our Parse database.
# They're not a part of the app. They're for us to use to populate the database.

# Adding recipes:
#     Run >> python parse.py add_recipe
#     Type recipes in the format recipe_name = ingredient1, ingredient2, etc.
#     The script handles recognizing existing ingredients and adding new ones.
#
# Maintaining recipes:
#     1. Edit the file recipes.txt
#     2. Purge our Parse database
#     3. Run >> python parse.py load_recipes
#     The script loads each line of recipes.txt into the database.
#
# Calling cloud functions:
#     Run >> python parse.py run <function_name> <arguments_in_json_format>


import sys
import httplib
import ast
import json

APPLICATION_ID = "Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe"
REST_API_KEY = "Qq5YS1S7xxfIkczi0vPyY747WwR8UdQIP7Nbac0h"
headers = {
        "X-Parse-Application-Id": APPLICATION_ID,
        "X-Parse-REST-API-Key": REST_API_KEY,
        "Content-Type": 'application/json'
}


def run_cloud_function(funct, args):
    """
    Calls a cloud function with arguments (formatted as a JSON string)
    """
    conn = httplib.HTTPSConnection('api.parse.com')
    conn.request("POST", "/1/functions/"+funct, args, headers)
    response = conn.getresponse()
    if response.status == 200:
        return ast.literal_eval(response.read())
    else:
        print response.status, response.reason, response.read()
        return False


def add_object(table, obj):
    """
    Adds object (must be a JSON string) to a given table
    """
    conn = httplib.HTTPSConnection('api.parse.com')
    conn.request("POST", "/1/classes/"+table, obj, headers)
    response = conn.getresponse()
    if response.status == 201:
        return ast.literal_eval(response.read())['objectId']
    else:
        print response.status, response.reason, response.read()
        return False


def request_table(table):
    """
    Returns a database table as a dictionary object
    """
    conn = httplib.HTTPSConnection('api.parse.com')
    conn.request("GET", "/1/classes/"+table, '', headers)
    response = conn.getresponse()
    if response.status == 200:
        return ast.literal_eval(response.read())['results']
    else:
        print response.status, response.reason
        return False


def show_usage():
    print 'Usage: python parse.py add_recipe'


def add_ingredient(ingredient_name):
    """
    Adds an ingredient to the ingredient database
    """
    ingredient_object = json.dumps({'name': ingredient_name})
    return add_object('Ingredients', ingredient_object)


def add_recipe_prompt():
    """
    Shows a looping user prompt for adding recipes to the database
    """
    recipe_raw = raw_input('Enter recipe: ')
    if not recipe_raw:
        return
    add_recipe(make_recipe_from_string(recipe_raw))
    add_recipe_prompt()


def add_recipe(recipe):
    """
    Adds a recipe to the recipe database
    """
    known_ingredients = request_table('Ingredients')
    matching_ingredients = []
    for recipe_ingredient in recipe['ingredients']:
        match_id = None
        for known_ingredient in known_ingredients:
            if known_ingredient['name'].lower() == recipe_ingredient.lower():
                match_id = known_ingredient['objectId']
                break
        if not match_id:
            match_id = add_ingredient(recipe_ingredient)
        matching_ingredients.append(match_id)
    recipe_id = add_object('Recipes', json.dumps({'name': recipe['name']}))
    relations = [{'recipe': {'__type': 'Pointer', 'className': 'Recipes', 'objectId': recipe_id},
                  'ingredient': {'__type': 'Pointer', 'className': 'Ingredients', 'objectId': ingredient}}
                 for ingredient in matching_ingredients]
    for relation in relations:
        add_object('Join_Table', json.dumps(relation))


def make_recipe_from_string(recipe_raw):
    """
    Converts a string representation of a recipe into a python dictionary
    """
    tokenized_recipe = recipe_raw.split('=')
    return {
        'name': tokenized_recipe[0].strip(),
        'ingredients': [ingredient.strip() for ingredient in tokenized_recipe[1].split(',')]
    }


def load_recipes():
    """
    Loads recipes from text file
    """
    with open('recipes.txt') as recipe_file:
        for line in recipe_file.readlines():
            add_recipe(make_recipe_from_string(line))


# Main function (checks sys args and executes above functions
if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        show_usage()
    elif args[0] == 'add_recipe':
        add_recipe_prompt()
    elif args[0] == 'load_recipes':
        load_recipes()
    elif args[0] == 'run':
        print json.dumps(ast.literal_eval(str(args[2])))
        print run_cloud_function(args[1], json.dumps(ast.literal_eval(str(args[2]))))
    else:
        show_usage()