import cv2
import time
from ultralytics import YOLO
from api_sender import send_violation

# Load the trained model
model = YOLO("best.pt")

# Open webcam
cap = cv2.VideoCapture(0)

if not cap.isOpened():
    print("Error: Could not open webcam.")
    exit()

last_sent = 0
COOLDOWN = 10  # seconds

while True:
    ret, frame = cap.read()

    if not ret:
        break

    # Run YOLO prediction
    results = model(frame)

    # Draw detections
    annotated_frame = results[0].plot()

    # Process detected objects
    for box in results[0].boxes:
        cls = int(box.cls[0])
        label = model.names[cls]
        confidence = float(box.conf[0]) * 100

        print(f"{label}: {confidence:.2f}%")

        if label == "no_helmet":
            current_time = time.time()

            if current_time - last_sent > COOLDOWN:
                print("No Helmet Detected! Sending alert...")
                send_violation(round(confidence, 2))
                last_sent = current_time

    cv2.imshow("Helmet Detection", annotated_frame)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()