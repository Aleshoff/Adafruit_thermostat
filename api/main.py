import os
import requests
from flask import Flask, request, jsonify, redirect
from Adafruit_IO import Client, Data
from dotenv import load_dotenv
from flask_cors import CORS
from mongo_client import mongo_client
from flask_jwt_extended import create_access_token, get_jwt_identity, jwt_required, JWTManager
import re
from datetime import timedelta, datetime
import time
import threading

thermostat_db = mongo_client.thermostat
interactions_collection = thermostat_db.interactions
statistics_collection = thermostat_db.temperatures
users_collection = thermostat_db.users

load_dotenv(dotenv_path="./.env.local")

DEBUG = bool(os.environ.get("DEBUG", True))
ADAFRUIT_KEY = os.environ.get("ADAFRUIT_KEY", "")
ADAFRUIT_NAME = os.environ.get("ADAFRUIT_NAME", "")

aio = Client(ADAFRUIT_NAME, ADAFRUIT_KEY)

app = Flask(__name__)
CORS(app)

app.config["JWT_SECRET_KEY"] = "alesh"
app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=8)
jwt = JWTManager(app)
app.config["DEBUG"] = DEBUG



@app.route("/login", methods=["POST"])
def login():
    user = request.get_json()
    username = user.get("username")
    password = user.get("password")
    db_user = users_collection.find_one({"username": username})
    if db_user and db_user["password"] == password:
        access_token = create_access_token(identity=username)
        return { "token": access_token }
    return {"error": "Incorrect username or password"}



@app.route("/signup", methods=["POST"])
def signup():
    user = request.get_json()
    username = user.get("username")
    password = user.get("password")
    
    name_match = re.search("\w+[.]*\w+[@]\w+[.]*\w+[.][a-z]{2,4}", username)
    pass_match = re.search("\S*[0-9]+\S*", password)
    
    if not name_match:
         return {"error": "Invalid username!"}
     
    if not pass_match or len(password) < 8:
         return {"error": "Invalid password!"}
    
    
    if users_collection.find_one({"username": username}):
        return {"error": "Such user already exists!"}
    
    #user["my_interventions"] = []
    result = users_collection.insert_one(user)
    inserted_id = str(result.inserted_id)
    return {"inserted_id": inserted_id}

@app.route("/dashboard", methods=["GET", "POST"])
@jwt_required()
def dashboard():
    if request.method == "GET":
        temp = aio.receive("temperature")
        
        last_set_temperature = interactions_collection.find().sort("_id", -1).limit(1)
        data = last_set_temperature[0]
        last_statistics_fromDB = statistics_collection.find({}).sort("_id", -1).limit(20)
        statistics = []
        count = 0
        for item in last_statistics_fromDB:
            count = count + 1
            newItem = {"time": item["time"], "temperature": item["temperature"]}
            if count%2 == 0:
                statistics.insert(0, newItem)
        #list_to_send = reversed(statistics)
        

        return {"temperature": temp.value, "setTemperature": data["temperature"], "statistics": statistics}
    
    if request.method == "POST":
        current_user = get_jwt_identity()
        data = request.get_json()
        temp_to_send = Data(value=data["temperature"])
        aio.create_data("setuptemperature", temp_to_send)
        
        interactions_collection.insert_one({"username": current_user, "interventionTime": datetime.now(), "temperature": data["temperature"]})
        
        return {"changed": data["temperature"]}
        
@app.route("/save", methods=["POST"])
@jwt_required()
def save():
    if request.method == "POST":
        current_user = get_jwt_identity()
        data = request.get_json()
        temp_to_save = data["temperature"]
        statistics_collection.insert_one({"time": datetime.today(), "temperature": temp_to_save})
        
        return {"saved": data["temperature"]}
        

def get_statistics():
    while True:
        temp = aio.receive("temperature")
        statistics_collection.insert_one({"time": datetime.today(), "temperature": temp.value})
        time.sleep(300)

if __name__ == "__main__":
    t1 = threading.Thread(target=get_statistics, args=())
    t1.start()
    app.run(host="0.0.0.0", port=5051)
    
    #ticks={[-20, 0, 20, 40, 60]} domain={[-20, 60]} interval={0}