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



import sys
import httplib
import ast

APPLICATION_ID = "Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe"
REST_API_KEY = "Qq5YS1S7xxfIkczi0vPyY747WwR8UdQIP7Nbac0h"
headers = {
        "X-Parse-Application-Id": APPLICATION_ID,
        "X-Parse-REST-API-Key": REST_API_KEY,
        "Content-Type": 'application/json'
    }


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
    ingredient_object = '{"name": "'+ingredient_name+'"}'
    return add_object('Ingredients', ingredient_object)


def add_recipe_prompt():
    """
    Shows a looping user prompt for adding recipes to the database
    """
    recipe_raw = raw_input('Enter recipe: ')
    if not recipe_raw:
        return
    add_recipe(recipe_raw)
    add_recipe_prompt()


def add_recipe(recipe_raw):
    """
    Adds a recipe to the recipe database
    """
    tokenized_recipe = recipe_raw.split('=')
    recipe_name = tokenized_recipe[0].strip()
    recipe_ingredients = [ingredient.strip() for ingredient in tokenized_recipe[1].split(',')]
    known_ingredients = request_table('Ingredients')
    ingredient_ids = '['
    for recipe_ingredient in recipe_ingredients:
        match_id = None
        for known_ingredient in known_ingredients:
            if known_ingredient['name'].lower() == recipe_ingredient.lower():
                match_id = known_ingredient['objectId']
                break
        if not match_id:
            match_id = add_ingredient(recipe_ingredient)
        ingredient_ids += '"' + match_id + '",'
    ingredient_ids = ingredient_ids[:-1] + ']'
    recipe_object = "{\"name\": \""+recipe_name+"\", \"ingredients\": "+ingredient_ids+"}"
    add_object('Recipes', recipe_object)


def load_recipes():
    """
    Loads recipes from text file
    """
    with open('recipes.txt') as recipe_file:
        for line in recipe_file.readlines():
            add_recipe(line)


# Main function (checks sys args and executes above functions
if __name__ == '__main__':
    args = sys.argv[1:]
    if not args:
        show_usage()
    elif args[0] == 'add_recipe':
        add_recipe_prompt()
    elif args[0] == 'load_recipes':
        load_recipes()
    else:
        show_usage()