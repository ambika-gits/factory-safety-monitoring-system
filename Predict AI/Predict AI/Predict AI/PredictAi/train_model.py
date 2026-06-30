import pandas as pd
print("1. Pandas loaded")

from sklearn.model_selection import train_test_split
print("2. train_test_split loaded")

from sklearn.ensemble import RandomForestClassifier
print("3. RandomForest loaded")

import joblib
print("4. joblib loaded")

df = pd.read_csv("machine_data.csv")
print("5. CSV loaded")

X = df[["temperature","vibration","pressure","rpm"]]
y = df["failure"]
print("6. Features prepared")

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2
)
print("7. Data split")

model = RandomForestClassifier()
print("8. Model created")

model.fit(X_train, y_train)
print("9. Model trained")

accuracy = model.score(X_test, y_test)
print("Accuracy:", accuracy)

joblib.dump(model, "predictive_model.pkl")
print("10. Model saved")