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

thermostat_db = mongo_client.thermostat
statistics_collection = thermostat_db.statistics
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
        
        #list_of_user_images_id = user_db["my_images"]
        #images = []
        #for id in list_of_user_images_id:
        #    image = images_collection.find_one({"_id": id})
        #    images.append(image)

        return {"temperature": temp.value}
    
    if request.method == "POST":
        current_user = get_jwt_identity()
        data = request.get_json()
        temp_to_send = Data(value=data["temperature"])
        aio.create_data("setuptemperature", temp_to_send)
        
        statistics_collection.insert_one({"username": current_user, "interventionTime": datetime.now(), "temperature": data["temperature"]})
        
        return {"changed": data["temperature"]}
        
        
        image["_id"] = image.get("id")
        image["count"] = 1
        
        if images_collection.find_one({"_id": image["_id"]}):
            result = images_collection.update_one({"_id": image["_id"]}, {"$inc": {"count": 1}})
        else:
            result = images_collection.insert_one(image)
            
        current_user = get_jwt_identity()
        user_db = users_collection.find_one({"username": current_user})
        list_of_user_images_id = user_db["my_images"]
        list_of_user_images_id.append(image["_id"])
        users_collection.update_one({"_id": user_db["_id"]}, {"$set": {"my_images": list_of_user_images_id}})
        
        inserted_id = result.inserted_id


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5051)