# Steps for updating the database:
#   1. Modify the google spreadsheet:
#       https://docs.google.com/a/u.northwestern.edu/spreadsheets/d/18bzxGjJ6jcmse9g6Dyj-YMly0xjb70VKprz67PvYylQ
#   2. Download the Recipes sheet and Ingredients sheet as CSV files by going to File > Download as
#   3. Run this program my typing into terminal: python update_database.py <recipes_csv> <ingredients_csv>
#   4. You may be prompted to edit the ingredients csv file. If this is the case, you will want to upload the
#       ingredients csv that you downloaded back to google docs. With the Ingredients sheet open, go to File > Import
#       and replace the current sheet with the ingredients csv. Make any necessary changes, like tagging and adding
#       descriptions to new ingredients, then download the csv again. Either replace the one you downloaded
#       previously or enter the path to this new csv into Terminal. Hit enter in Terminal.
#   5. The program should execute and finish. Done!
#

import sys
import csv
import itertools
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


def main():
    if len(sys.argv) != 3:
        print 'Usage: update_database.py <recipe_csv_file> <ingredients_csv_file>'
        return

    db_recipes = request_table('Recipes')
    db_ingredients = request_table('Ingredients')
    db_join_table = request_table('Join_Table')

    recipes_raw = read_spreadsheet(sys.argv[1])
    recipes = [process_raw_recipe(recipe) for recipe in recipes_raw]
    ingredients_csv = sys.argv[2]
    if apply_recipe_data_to_ingredients_list(recipes, ingredients_csv):
        print 'Your ingredients CSV has been modified.'
        new_file = raw_input('Make any necessary changes, then press ENTER or type a new file path here: ')
        if new_file:
            ingredients_csv = new_file
    print 'Updating ingredients...'
    ingredients_raw = read_spreadsheet(ingredients_csv)
    ingredients = [process_raw_ingredient(ingredient) for ingredient in ingredients_raw]
    add_ingredients_to_database(ingredients, db_ingredients)
    print 'Updating recipes...'
    db_ingredients = request_table('Ingredients')
    add_recipes_to_database(recipes, db_recipes, db_ingredients, db_join_table)


def read_spreadsheet(csv_filename):
    """
    Converts CSV file into Python dictionary
    """
    csv_file = open(csv_filename, 'r')
    csv_reader = csv.reader(csv_file, delimiter=',')
    i = 0
    column_headers = []
    result_list = []
    for row in csv_reader:
        if row[0] == '\n':
            continue
        if i == 0:
            column_headers = row
        else:
            result_line = {}
            for j in range(len(column_headers)):
                try:
                    result_line[column_headers[j]] = row[j]
                except IndexError:
                    print row, i, j
                    sys.exit()
            result_list.append(result_line)
        i += 1
    return result_list


def process_raw_recipe(raw_recipe):
    """
    Takes in a basic recipe object and parses its ingredients and tags
    """
    def make_ingredient(ingredient_string):
        """
        Parses an ingredient string (cell from excel sheet) into an ingredient object
        """
        ingredient_elements = ingredient_string.split(' ')
        if ingredient_elements[0] == '?':
            quantity = None
        else:
            try:
                quantity = int(ingredient_elements[0])
            except ValueError:
                quantity = float(ingredient_elements[0])
        unit = ingredient_elements[1]
        if unit == '?':
            unit = None
        elif unit[-1] == 's':
            unit = unit[:-1]
        name = ' '.join([element for element in ingredient_elements[2:] if element != '(optional)'])
        if ' or ' in name.lower():
            # TODO: Change code to support ingredient substitutions
            name = name.split(' or ')[0]
        if '(optional)' in ingredient_elements:
            optional = True
        else:
            optional = False
        return {
            'name': name,
            'quantity': quantity,
            'unit': unit,
            'optional': optional
        }

    recipe = raw_recipe
    recipe['ingredients'] = [make_ingredient(ingredient.strip()) for ingredient in raw_recipe['ingredients'].split(',')]
    recipe['tags'] = [tag.strip() for tag in raw_recipe['tags'].split(',')]
    if not raw_recipe['classic_cocktail'] or raw_recipe['classic_cocktail'].lower() == 'no':
        recipe['classic_cocktail'] = False
    else:
        recipe['classic_cocktail'] = True
    if raw_recipe['serving_size']:
        recipe['serving_size'] = int(raw_recipe['serving_size'])
    else:
        recipe['serving_size'] = 1
    return recipe


def process_raw_ingredient(raw_ingredient):
    ingredient = raw_ingredient
    if not raw_ingredient['common'] or raw_ingredient['common'].lower() == 'no':
        ingredient['common'] = False
    else:
        ingredient['common'] = True
    if not raw_ingredient['assumed'] or raw_ingredient['assumed'].lower() == 'no':
        ingredient['assumed'] = False
    else:
        ingredient['assumed'] = True
    if raw_ingredient['price'] and raw_ingredient['price'] != '\n':
        if raw_ingredient['price'][0] == '$':
            price = raw_ingredient['price'][1:]
        else:
            price = raw_ingredient['price']
        try:
            ingredient['price'] = float(price)
        except ValueError:
            print raw_ingredient, float
            sys.exit()
    else:
        ingredient['price'] = 0
    return ingredient


def apply_recipe_data_to_ingredients_list(recipes, ingredients_csv_filename):
    ingredients_raw = read_spreadsheet(ingredients_csv_filename)
    ingredients_mentioned_in_csv = [ingredient['name'] for ingredient in ingredients_raw]
    ingredients_mentioned_in_recipes = set([ingredient['name'] for ingredient in
                                            itertools.chain(*[recipe['ingredients'] for recipe in recipes])])
    changed = False
    new_rows = []
    for ingredient_name in ingredients_mentioned_in_recipes:
        if ingredient_name not in ingredients_mentioned_in_csv:
            new_line = [None for item in ingredients_raw[0]]
            new_line[0] = ingredient_name
            new_rows.append(new_line)
            changed = True
    with open(ingredients_csv_filename, 'ab') as fp:
        csv_writer = csv.writer(fp, delimiter=',')
        csv_writer.writerows(['\n'])
        csv_writer.writerows(new_rows)
    return changed


def add_ingredients_to_database(ingredients, db_ingredients):
    for ingredient in ingredients:
        in_database = False
        for db_ingredient in db_ingredients:
            if db_ingredient['name'].lower() == ingredient['name'].decode('utf-8').lower():
                in_database = True
                update_object('Ingredients', json.dumps(ingredient), db_ingredient['objectId'])
        if not in_database:
            add_object('Ingredients', json.dumps(ingredient))


def add_recipes_to_database(recipes, db_recipes, db_ingredients, db_join_table):
    """
    Adds recipes to the recipe database
    """
    def format_recipe(raw_recipe):
        result = {}
        for key in raw_recipe:
            if key != 'ingredients':
                result[key] = raw_recipe[key]
        return result

    def add_recipe(raw_recipe, update=False, update_id=None):
        matching_ingredients = []
        for recipe_ingredient in raw_recipe['ingredients']:
            match_ingredient = None
            for known_ingredient in db_ingredients:
                if known_ingredient['name'].lower() == \
                        recipe_ingredient['name'].decode('utf-8').lower():
                    match_ingredient = (known_ingredient, recipe_ingredient)
                    break
            if not match_ingredient:
                print recipe_ingredient
                raise(RuntimeError, "Ingredients database not up to date!")
            matching_ingredients.append(match_ingredient)
        if update:
            recipe_id = update_id
            update_object('Recipes', json.dumps(format_recipe(raw_recipe)), update_id)
        else:
            recipe_id = add_object('Recipes', json.dumps(format_recipe(raw_recipe)))

        for matching_ingredient, corresponding_recipe_ingredient in matching_ingredients:
            ingredient_to_add = {}
            for key in corresponding_recipe_ingredient:
                if key != 'name':
                    ingredient_to_add[key] = corresponding_recipe_ingredient[key]
            ingredient_to_add['recipe'] = {'__type': 'Pointer', 'className': 'Recipes', 'objectId': recipe_id}
            ingredient_to_add['ingredient'] = \
                {'__type': 'Pointer', 'className': 'Ingredients', 'objectId': matching_ingredient['objectId']}
            in_join_database = False
            for join in db_join_table:
                if join['recipe']['objectId'] == recipe_id and \
                        join['ingredient']['objectId'] == matching_ingredient['objectId']:
                    update_object('Join_Table', json.dumps(ingredient_to_add), join['objectId'])
                    in_join_database = True
                    break
            if not in_join_database:
                add_object('Join_Table', json.dumps(ingredient_to_add))

    for recipe in recipes:
        in_database = False
        for db_recipe in db_recipes:
            if db_recipe['name'].lower() == recipe['name'].decode('utf-8').lower():
                in_database = True
                add_recipe(recipe, True, db_recipe['objectId'])
        if not in_database:
            add_recipe(recipe)


def prune_tables():
    pass


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


def update_object(table, obj, obj_id):
    """
    Updates object (must be a JSON string) in a given table
    """
    conn = httplib.HTTPSConnection('api.parse.com')
    conn.request("PUT", "/1/classes/"+table+"/"+obj_id, obj, headers)
    response = conn.getresponse()
    if response.status == 200:
        return True
    else:
        print response.status, response.reason, response.read()
        return False


def request_table(table):
    """
    Returns a database table as a dictionary object
    """
    conn = httplib.HTTPSConnection('api.parse.com')
    conn.request("GET", "/1/classes/"+table+"?limit=1000", '', headers)
    response = conn.getresponse()
    if response.status == 200:
        return json.loads(response.read())['results']
    else:
        print response.status, response.reason
        return False

if __name__ == '__main__':
    main()