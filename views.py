__author__ = 'samportnow'

from flask import Flask, request, url_for, render_template, redirect, session
from flask.ext.pymongo import PyMongo
import datetime
from bson.objectid import ObjectId
import markdown2
from flask import jsonify
from mako.template import Template
import random

app = Flask(__name__)
mongo = PyMongo(app)

@app.route('/')
def home():
    template = Template(filename="./templates/home.html")
    return template.render(version = random.randint(0, 10000000))

if __name__ == '__main__':
    app.run(debug=True)
