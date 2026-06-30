import pandas as pd
import numpy as np

np.random.seed(42)

data = []

for i in range(1000):
    temp = np.random.randint(20, 100)
    vibration = np.random.uniform(0, 10)
    pressure = np.random.randint(50, 150)
    rpm = np.random.randint(500, 3000)

    failure = 1 if (temp > 80 and vibration > 7) else 0

    data.append([temp, vibration, pressure, rpm, failure])

df = pd.DataFrame(
    data,
    columns=["temperature", "vibration", "pressure", "rpm", "failure"]
)

df.to_csv("machine_data.csv", index=False)

print("Dataset Generated")