from flask import Flask, render_template, request
import joblib
import pandas as pd
import plotly.express as px
import plotly.io as pio
import plotly.graph_objects as go

app = Flask(__name__)

# Load trained model
model = joblib.load("../predictive_model.pkl")
history_df = pd.read_csv("../machine_data.csv")
total_records = len(history_df)
failed_records = history_df["failure"].sum()
healthy_records = total_records - failed_records

model_accuracy = 100  # Replace later with actual accuracy if desired


@app.route("/")
def home():
    return render_template(
        "index.html",
        total_records=total_records,
        failed_records=failed_records,
        healthy_records=healthy_records,
        model_accuracy=model_accuracy
    )

@app.route("/predict", methods=["POST"])
def predict():

    try:
        # Get input values
        temperature = float(request.form["temperature"])
        vibration = float(request.form["vibration"])
        pressure = float(request.form["pressure"])
        rpm = float(request.form["rpm"])

        # Create dataframe
        data = pd.DataFrame([{
            "temperature": temperature,
            "vibration": vibration,
            "pressure": pressure,
            "rpm": rpm
        }])

        # Prediction
        prediction = model.predict(data)[0]

        # Confidence Score
        probability = model.predict_proba(data)[0]
        confidence = round(max(probability) * 100, 2)
        if confidence >= 90:
            risk_level = "High Risk"
        elif confidence >= 70:
            risk_level = "Medium Risk"
        else:
            risk_level = "Low Risk"

        # Health Score
        health_score = 100

        if temperature > 80:
            health_score -= 25

        if vibration > 7:
            health_score -= 25

        if pressure > 130:
            health_score -= 25

        if rpm > 2500:
            health_score -= 25

        # Recommendation
        recommendation = ""

        if prediction == 1:

            result = "⚠️ Failure Predicted"

            if temperature > 80:
                recommendation += "Check Cooling System. "

            if vibration > 7:
                recommendation += "Inspect Bearings. "

            if pressure > 130:
                recommendation += "Check Pressure Valves. "

            if rpm > 2500:
                recommendation += "Reduce Motor Speed. "

        else:

            result = "✅ Machine Healthy"
            recommendation = "No maintenance required."

        # Sensor Visualization Chart
        sensor_df = pd.DataFrame({
            "Sensor": ["Temperature", "Vibration", "Pressure", "RPM"],
            "Value": [temperature, vibration, pressure, rpm]
        })

        fig = px.bar(
            sensor_df,
            x="Sensor",
            y="Value",
            title="Machine Sensor Readings"
        )

        graph_html = pio.to_html(fig, full_html=False)
        gauge_fig = go.Figure(
                go.Indicator(
                    mode="gauge+number",
                    value=health_score,
                    title={"text": "Machine Health Score"},
                    gauge={
                            "axis": {"range": [0, 100]},
                            "bar": {"color": "darkblue"},
                            "steps": [
                                {"range": [0, 40], "color": "red"},
                                {"range": [40, 70], "color": "orange"},
                                {"range": [70, 100], "color": "green"}
                                ]
                            }
                        )
                    )
        gauge_chart = pio.to_html(gauge_fig, full_html=False)
        failure_counts = history_df["failure"].value_counts()

        pie_fig = px.pie(
            names=["Healthy", "Failure"],
            values=[
            failure_counts.get(0, 0),
            failure_counts.get(1, 0)
            ],
            title="Failure Distribution"
    )
        pie_chart = pio.to_html(pie_fig, full_html=False)
        trend_fig = px.line(
                history_df.head(100),
                y="temperature",
                title="Temperature Trend"
                )
        trend_chart = pio.to_html(trend_fig, full_html=False)

        return render_template(
                        "index.html",
                        prediction=result,
                        confidence=confidence,
                        risk_level=risk_level,
                        recommendation=recommendation,
                        health_score=health_score,
                        graph_html=graph_html,
                        pie_chart=pie_chart,
                        trend_chart=trend_chart,
                        gauge_chart=gauge_chart,
                        total_records=total_records,
                        failed_records=failed_records,
                        healthy_records=healthy_records,
                        model_accuracy=model_accuracy
                        )

    except Exception as e:

        return render_template(
            "index.html",
            prediction=f"Error: {str(e)}"
        )
if __name__ == "__main__":
    app.run(debug=True)