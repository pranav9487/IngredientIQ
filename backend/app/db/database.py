import os
from dotenv import load_dotenv
import certifi
from pymongo import MongoClient
from pymongo.server_api import ServerApi

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
MONGO_DB_NAME = os.getenv("MONGO_DB_NAME", "ingredients_iq")

client = MongoClient(MONGO_URI, server_api=ServerApi("1"), tlsCAFile=certifi.where())
try:
    client.admin.command("ping")
    print("Pinged your deployment. You successfully connected to MongoDB!")
except Exception as e:
    print(f"Failed to connect to MongoDB: {e}")

db = client[MONGO_DB_NAME]


def get_database():
    """Returns the MongoDB database instance."""
    return db
