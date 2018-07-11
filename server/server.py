import requests
import re
from flask import request
from flask import Flask, render_template, jsonify
from pymongo import MongoClient
import json
from bson.json_util import dumps
from mongoengine import *


import re
from flask_cors import CORS, cross_origin

app = Flask(__name__)
CORS(app)
connection_params = {
    'user': 'viraj',
    'password': 'Aathira$123',
    'host': 'ds229701.mlab.com',
    'port': 29701,
    'namespace': 'populationdata',
}
app.config['CORS_HEADERS'] = 'Content-Type'

connection = MongoClient(
    'mongodb://{user}:{password}@{host}:'
    '{port}/{namespace}'.format(**connection_params)
)

class PeopleData(Document):
    index = StringField()
    age = StringField()
    workclass = StringField()
    fnlwgt = StringField()
    education = StringField()
    educationNum = StringField()
    maritalStatus = StringField()
    occupation = StringField()
    relationship = StringField()
    race = StringField()
    sex = StringField()
    capitalGain = StringField()
    capitalLoss = StringField()
    hoursPerWeek = StringField()
    nativeCountry = StringField()

def filterService(filterObject):
    db = connection.populationdata
    data = db.peoplesData.find(filterObject).limit(100)
    filteredData = dumps(data)
    return filteredData


def rangeFinder(currentPage, filterObject):
    db = connection.populationdata
    data = db.peoplesData.find(filterObject).skip((currentPage - 1) * 100).limit(100)
    q = dumps(data)
    return q


@app.route('/<int:page_id>', methods=['POST', 'GET'])
@cross_origin()
def show_post(page_id):
    filterObject = json.loads(request.data)
    a = rangeFinder(page_id, filterObject)
    return str(a)


@app.route('/statistics')
@cross_origin()
def getSource():
    db = connection.populationdata
    a = db.peoplesData.find({"sex": "Male"}).count()
    b = db.peoplesData.find({"sex": "Female"}).count()
    relationships = db.peoplesData.distinct("relationship")
    d = ''
    mydict = {"male": a, "female": b}
    for relation in relationships:
        count = db.peoplesData.find({"relationship": relation}).count()
        d += '  ' + relation + ': ' + str(count)
        mydict[relation] = count
    q = dumps(mydict)
    db.statisticalData.insert(mydict)
    return str(q)


@app.route('/getStats')
@cross_origin()
def getStats():
    db = connection.populationdata
    a = db.statisticalData.find({}).limit(1)
    q = dumps(a)
    return str(q)


@app.route('/getRaces')
@cross_origin()
def getRaces():
    db = connection.populationdata
    races = db.peoplesData.distinct("race")
    q = dumps(races)
    return str(q)


@app.route('/filter', methods=['POST', 'GET'])
@cross_origin()
def filter():
    filterObject = json.loads(request.data)
    q = filterService(filterObject)
    return q


@app.route('/')
@cross_origin()
def homePage():
    db = connection.populationdata
    data = db.peoplesData.find({
        "index": {
            '$gte': 0,
            '$lt': 100
        }
    })
    q = dumps(data)
    return str(q)


if __name__ == '__main__':
    app.run(port=9199, debug=True)


