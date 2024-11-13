# main.py

from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
from typing import List
from datetime import datetime
import jwt

# FastAPI initialization
app = FastAPI()
SECRET_KEY = os.getenv("SECRET_KEY")
ALGORITHM = "HS256"

# Fake database
fake_users_db = {
    "teacher@example.com": {"email": "teacher@example.com", "password": "teacher123", "role": "teacher"},
    "student@example.com": {"email": "student@example.com", "password": "student123", "role": "student"},
}

# In-memory storage for notifications
teacher_notifications = []
student_notifications = []

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

# User model
class User(BaseModel):
    email: str
    password: str
    role: str

class Notification(BaseModel):
    message: str
    sender: str
    recipient: str
    timestamp: datetime

# Authentication logic
def create_token(data: dict):
    return jwt.encode(data, SECRET_KEY, algorithm=ALGORITHM)

def verify_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except jwt.PyJWTError:
        return None

# User login
@app.post("/token")
async def login(form_data: OAuth2PasswordRequestForm = Depends()):
    user = fake_users_db.get(form_data.username)
    if not user or user['password'] != form_data.password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    token = create_token({"email": user['email'], "role": user['role']})
    return {"access_token": token, "token_type": "bearer"}

# Predict train status
@app.post("/predict/")
async def predict_train_status(data: dict, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    if not user:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    result = "Delayed"  # Simulate train status prediction

    # If the train is delayed, notify the teacher
    if result == "Delayed":
        notification = Notification(
            message="Train is delayed!",
            sender=user['email'],
            recipient="teacher@example.com",  # Replace with actual teacher's email
            timestamp=datetime.now()
        )
        teacher_notifications.append(notification)

    return {"TrainStatus": result}

# Get teacher notifications
@app.get("/teacher/notifications/")
async def get_teacher_notifications(token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    if not user or user['role'] != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    return {"notifications": teacher_notifications}

# Forward notification to students
@app.post("/teacher/forward-notification/")
async def forward_notification(notification: Notification, token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    if not user or user['role'] != "teacher":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")
    
    notification.sender = user['email']
    notification.timestamp = datetime.now()
    
    student_notifications.append(notification)  # Save notification for the student
    return {"message": "Notification forwarded to student."}

# Get student notifications
@app.get("/student/notifications/")
async def get_student_notifications(token: str = Depends(oauth2_scheme)):
    user = verify_token(token)
    if not user or user['role'] != "student":
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not authorized")

    return {"notifications": student_notifications}

# Run the app
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)



