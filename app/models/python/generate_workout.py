import sys
import json
import joblib
import pandas as pd

# Load model and encoders
model = joblib.load("app/models/python/workout_model.pkl")
goal_enc = joblib.load("app/models/python/goal_encoder.pkl")
level_enc = joblib.load("app/models/python/level_encoder.pkl")
equip_enc = joblib.load("app/models/python/equip_encoder.pkl")
workout_enc = joblib.load("app/models/python/workout_encoder.pkl")

# Read input
input_data = json.loads(sys.argv[1])

goal = input_data["goal"]
level = input_data["level"]
equipment = input_data["equipment"]

# Encode input
goal_enc_val = goal_enc.transform([goal])[0]
level_enc_val = level_enc.transform([level])[0]
equip_enc_val = equip_enc.transform([equipment])[0]

# Prepare input for prediction
input_df = pd.DataFrame([{
    "goal_enc": goal_enc_val,
    "level_enc": level_enc_val,
    "equip_enc": equip_enc_val
}])

# Make prediction
predicted_workout_enc = model.predict(input_df)
workout_enc_val = predicted_workout_enc[0]

# Decode the prediction
workout = workout_enc.inverse_transform([workout_enc_val])[0]  # Use the encoder to inverse transform the encoded value

# Output result
result = {
    "workout": workout
}

print(json.dumps(result))