import json,httplib
connection = httplib.HTTPSConnection('api.parse.com', 443)
connection.connect()
connection.request('POST', '/1/functions/search4Ingreds', json.dumps({
       "preferenceIds": ["HtMjLTme3y","fI099FR52q"]
     }), {
       "X-Parse-Application-Id": "Et6HrDXxBYdz4eQRUTnqH6HtTOTWwW9chrKXRYTe",
       "X-Parse-REST-API-Key": "Qq5YS1S7xxfIkczi0vPyY747WwR8UdQIP7Nbac0h",
       "Content-Type": "application/json"
     })
result = json.loads(connection.getresponse().read())
print result
