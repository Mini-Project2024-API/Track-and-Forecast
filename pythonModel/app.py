import os
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from pymongo import MongoClient
from bson.objectid import ObjectId
import datetime
from typing import List

# Initialize FastAPI app
app = FastAPI()

# MongoDB client setup
client = MongoClient(os.getenv("MONGO_URI"))
db = client.get_database("train_system")

# List to manage active WebSocket connections
active_connections: List[WebSocket] = []

@app.websocket("/ws/notifications")
async def websocket_endpoint(websocket: WebSocket):
    await websocket.accept()
    active_connections.append(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            print(f"Received data: {data}")
    except WebSocketDisconnect:
        active_connections.remove(websocket)

@app.post("/predict-delay")
async def predict_delay(trainId: str, route: str, weather: dict):
    temp = weather.get("main", {}).get("temp", 0)
    rain = weather.get("rain", {}).get("1h", 0)

    # Calculate delay
    delay = 5 if rain > 0 else 0
    delay += (temp - 273.15) * 0.1  # Convert temp to Celsius

    # Prepare notification
    notification_message = {
        "message": f"Train {trainId} on route {route} is expected to be delayed by {round(delay, 2)} minutes due to weather.",
        "postedBy": None,  # No specific user
        "createdAt": datetime.datetime.utcnow(),
    }

    # Insert into MongoDB
    db.notifications.insert_one(notification_message)

    # Notify WebSocket clients
    for connection in active_connections:
        await connection.send_text(str(notification_message))

    return {"trainId": trainId, "predictedDelay": round(delay, 2)}
