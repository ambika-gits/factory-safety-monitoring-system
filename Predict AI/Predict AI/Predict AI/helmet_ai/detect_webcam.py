import cv2
import time

from ultralytics import YOLO
from api_sender import send_violation

model = YOLO("best.pt")

cap = cv2.VideoCapture(0)

last_sent = 0

while True:

    ret, frame = cap.read()

    if not ret:
        break

    results = model(frame)

    for box in results[0].boxes:

        cls = int(box.cls[0])

        label = model.names[cls]

        confidence = float(box.conf[0]) * 100

        if label.lower() == "no_helmet":

            current_time = time.time()

            if current_time - last_sent > 10:

                send_violation(round(confidence, 2))

                last_sent = current_time

    annotated = results[0].plot()

    cv2.imshow("Helmet Detection", annotated)

    if cv2.waitKey(1) & 0xFF == ord("q"):
        break

cap.release()
cv2.destroyAllWindows()
