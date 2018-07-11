from pymongo import MongoClient
import re
connection_params = {
    'user': 'viraj',
    'password': 'Aathira$123',
    'host': 'ds229701.mlab.com',
    'port': 29701,
    'namespace': 'populationdata',
}

connection = MongoClient(
    'mongodb://{user}:{password}@{host}:'
    '{port}/{namespace}'.format(**connection_params)
)

db = connection.populationdata
i=0
object = []
with open('largeData.txt') as f:
    for line in f:        
        if 1:            
            x = re.sub(r'\s', '', line).split(',')
            object.append({
                "index": i,
                "age": x[0],
                "workclass":x[1],
                "fnlwgt":x[2],
                "education":x[3],
                "educationNum":x[4],
                "maritalStatus":x[5],
                "occupation":x[6],
                "relationship":x[7],
                "race":x[8],
                "sex":x[9],
                "capitalGain":x[10],
                "capitalLoss":x[11],
                "hoursPerWeek":x[12],
                "nativeCountry":x[13]
            }) 
            i = i+1
            

print(db.collection_names())
db.peoplesData1.insert_many(object)
