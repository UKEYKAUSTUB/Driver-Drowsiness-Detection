import cv2
import dlib
import numpy as np
from playsound import playsound
from imutils import face_utils
import threading
import pygame
import requests
import time
import os
import sys
import requests
import datetime
def send_to_server(filename):
    try:
        requests.post("http://localhost:5000/alert", json={
            "status": "Drowsy",
            "time": str(datetime.datetime.now()),
            "image": filename,
            "location": "Pune, India"
        })
        print("✅ Sent to backend")
    except Exception as e:
        print("❌ Server error:", e)
        
LAST_ALERT_TIME = 0
ALERT_COOLDOWN = 10
ALERT_DISPLAY_FRAMES = 20
DISPLAY_COUNTER_YAWN = 0
DISPLAY_COUNTER_DROWSY = 0
ALERT_SENT = False
YAWN_ALERT_SENT = False
ALERT_IN_PROGRESS = False
def send_telegram():
    token = "8646714250:AAHp0vsxL2SQ2gCLYcSXgQ62cCAkKmJfa60"
    chat_id = "5071865954"
    location = get_location()
    message = f"""🚨 Drowsiness detected! Driver is sleepy.
    Location: https://www.google.com/maps?q={location}"""
    url = f"https://api.telegram.org/bot{token}/sendMessage"

    requests.post(url, data={
        "chat_id": chat_id,
        "text": message
    })
def send_image(filename):
    token = "8646714250:AAHp0vsxL2SQ2gCLYcSXgQ62cCAkKmJfa60"
    chat_id = "5071865954"
    url = f"https://api.telegram.org/bot{token}/sendPhoto"
    with open(f"../drowsiness-backend/uploads/{filename}", "rb") as photo:
        requests.post(url, data={"chat_id": chat_id}, files={"photo": photo})

def get_location():
    try:
        data = requests.get("https://ipinfo.io").json()
        loc = data['loc']   # format: "lat,long"
        return loc
    except:
        return "Location not available"

pygame.mixer.init()
base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
alarm_path = os.path.join(base_path, "alarm.mp3")
pygame.mixer.music.load(alarm_path)

# Initialize DLIB's face detector and facial landmark predictor
base_path = getattr(sys, '_MEIPASS', os.path.dirname(os.path.abspath(__file__)))
model_path = os.path.join(base_path, "models", "shape_predictor_68_face_landmarks.dat")
detector = dlib.get_frontal_face_detector()
predictor = dlib.shape_predictor(model_path)

# Define facial landmark indices for eyes and mouth
(lStart, lEnd) = face_utils.FACIAL_LANDMARKS_IDXS["left_eye"]
(rStart, rEnd) = face_utils.FACIAL_LANDMARKS_IDXS["right_eye"]
(mStart, mEnd) = face_utils.FACIAL_LANDMARKS_IDXS["mouth"]

# Function to compute Eye Aspect Ratio (EAR) for drowsiness detection
def eye_aspect_ratio(eye):
    # Vertical distances
    A = np.linalg.norm(eye[1] - eye[5])
    B = np.linalg.norm(eye[2] - eye[4])
    # Horizontal distance
    C = np.linalg.norm(eye[0] - eye[3])
    # EAR formula
    ear = (A + B) / (2.0 * C)
    return ear

# Function to compute Mouth Aspect Ratio (MAR) for yawn detection
def mouth_aspect_ratio(mouth):
    A = np.linalg.norm(mouth[13] - mouth[19])
    B = np.linalg.norm(mouth[14] - mouth[18])
    C = np.linalg.norm(mouth[15] - mouth[17])
    D = np.linalg.norm(mouth[12] - mouth[16])
    # MAR formula
    mar = (A + B + C) / (2.0 * D)
    return mar

#Function that sends yawn to backend
def send_to_server_yawn(filename):
    try:
        requests.post("http://localhost:5000/alert", json={
            "status": "Yawn",
            "time": str(datetime.datetime.now()),
            "image": filename,
            "location": "Pune, India"
        })
        print("✅ Yawn sent to backend")
    except Exception as e:
        print("❌ Server error:", e)
        
# Thresholds for detection (adjust based on testing)
EYE_AR_THRESH = 0.30  # Below this: drowsiness
MOUTH_AR_THRESH = 0.35  # Above this: yawn
alarm_on = False

# --- Alarm control ---
def sound_alarm():
    global alarm_on
    if not alarm_on:
        alarm_on = True
        try:
            if not pygame.mixer.music.get_busy():  # prevent overlapping sounds
                pygame.mixer.music.play()
        except Exception as e:
            print("Error playing sound:", e)
        alarm_on = False

# Initialize video capture from webcam (0 is default camera)
cap = cv2.VideoCapture(0)

# --- Check if camera access works ---
if not cap.isOpened():
    print("❌ Camera access blocked or not detected.")
    print("Please enable camera access in Windows Settings → Privacy & security → Camera.")
    print("Also ensure 'Let desktop apps access your camera' is turned ON.")
    cap.release()
    cv2.destroyAllWindows()
    exit()
else:
    print("✅ Camera access granted.")


# Check if camera opened successfully
if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

print("Starting real-time detection. Press 'q' to quit.")
COUNTER = 0
EYE_AR_CONSEC_FRAMES = 30
YAWN_COUNTER = 0
YAWN_CONSEC_FRAMES = 5

def handle_alert(frame, filename, label):
    frame_copy = frame.copy()
    cv2.putText(frame_copy, label, (10, 30),
                cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
    cv2.imwrite(f"../drowsiness-backend/uploads/{filename}", frame)
    send_telegram()
    send_image(filename)
    if label == "DROWSINESS DETECTED!":
        send_to_server(filename)
    else:
        send_to_server_yawn(filename)
    
while True:
    # Capture frame-by-frame
    ret, frame = cap.read()

    if not ret or frame is None:
        print("❌ Error: No frame captured from camera. It may be in use by another app or blocked by privacy settings.")
        continue  # Try again instead of crashing 
    # Ensure frame is a valid numpy array
    if not isinstance(frame, np.ndarray):
        print("❌ Invalid frame type received.")
        continue
    
    if frame is None or frame.size == 0:
        print("⚠️ Empty frame detected, skipping...")
        continue

    gray= cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    gray = np.ascontiguousarray(gray, dtype=np.uint8)
    # Detect faces in the grayscale frame
    rects = detector(gray, 0)
    
    for rect in rects:
        # Predict facial landmarks
        shape = predictor(gray, rect)
        shape = face_utils.shape_to_np(shape)
        
        # Extract eye and mouth coordinates
        leftEye = shape[lStart:lEnd]
        rightEye = shape[rStart:rEnd]
        mouth = shape[mStart:mEnd]
        
        # Calculate EAR and MAR
        leftEAR = eye_aspect_ratio(leftEye)
        rightEAR = eye_aspect_ratio(rightEye)
        ear = (leftEAR + rightEAR) / 2.0  # Average EAR
        mar = mouth_aspect_ratio(mouth)
        
        # Draw contours around eyes and mouth
        leftEyeHull = cv2.convexHull(leftEye)
        rightEyeHull = cv2.convexHull(rightEye)
        mouthHull = cv2.convexHull(mouth)
        cv2.drawContours(frame, [leftEyeHull], -1, (0, 255, 0), 1)  # Green for eyes
        cv2.drawContours(frame, [rightEyeHull], -1, (0, 255, 0), 1)
        cv2.drawContours(frame, [mouthHull], -1, (255, 0, 0), 1)  # Blue for mouth
        
        # Display EAR and MAR values on frame
        cv2.putText(frame, f"EAR: {ear:.2f}", (300, 30), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        cv2.putText(frame, f"MAR: {mar:.2f}", (300, 60), cv2.FONT_HERSHEY_SIMPLEX, 0.7, (255, 255, 255), 2)
        
        # Check for drowsiness
        if ear < EYE_AR_THRESH:
            COUNTER += 1
        else:
            COUNTER=0
        if COUNTER >= EYE_AR_CONSEC_FRAMES:
            DISPLAY_COUNTER_DROWSY = ALERT_DISPLAY_FRAMES
            current_time = time.time()
            if not pygame.mixer.music.get_busy():
                threading.Thread(target=sound_alarm, daemon=True).start()

            if (current_time - LAST_ALERT_TIME > ALERT_COOLDOWN):
                LAST_ALERT_TIME = current_time
                filename = f"alert_{int(time.time())}.jpg"
                frame_copy = frame.copy()
                label = "DROWSINESS DETECTED!"
                threading.Thread(
                    target=handle_alert,
                    args=(frame, filename, label),
                    daemon=True
                ).start()
               
                
                
        # DISPLAY TEXT STABLY
        if DISPLAY_COUNTER_DROWSY > 0:
            cv2.putText(frame, "DROWSINESS DETECTED!", (10, 30),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            DISPLAY_COUNTER_DROWSY -= 1       

        # Check for yawn
        if mar > MOUTH_AR_THRESH:
            YAWN_COUNTER += 1
        else:
            if YAWN_COUNTER > 0:
                YAWN_COUNTER -= 1   # slow decay instead of reset
        if YAWN_COUNTER >= YAWN_CONSEC_FRAMES:
            DISPLAY_COUNTER_YAWN = ALERT_DISPLAY_FRAMES
            current_time = time.time()
            if not pygame.mixer.music.get_busy():
                threading.Thread(target=sound_alarm, daemon=True).start()
                
            if (current_time - LAST_ALERT_TIME > ALERT_COOLDOWN):
                LAST_ALERT_TIME = current_time
                filename = f"alert_{int(time.time())}.jpg"
                frame_copy = frame.copy()
                label = "YAWN DETECTED!"
                threading.Thread(
                    target=handle_alert,
                    args=(frame, filename, label ),
                    daemon=True
                ).start()

                 
        # DISPLAY TEXT STABLY
        if DISPLAY_COUNTER_YAWN > 0:
            cv2.putText(frame, "YAWN DETECTED!", (10, 60),
                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 255), 2)
            DISPLAY_COUNTER_YAWN -= 1
                    
    # Display the resulting frame
    cv2.imshow("Drowsiness and Yawn Detection - Stage 1", frame)

    # Break loop on 'q' key press
    if cv2.waitKey(1) & 0xFF == ord('q'):
        break

# Release resources
cap.release()
cv2.destroyAllWindows()
print("Detection stopped.")