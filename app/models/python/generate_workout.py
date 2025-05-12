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

# Get top-N predicted workouts based on probability
N = 5

# Predict probabilities
probs = model.predict_proba(input_df)[0]

# Get indices of top-N workouts
top_n_indices = probs.argsort()[-N:][::-1]

# Decode workout names
top_n_workouts = workout_enc.inverse_transform(top_n_indices)

# Output the result
result = {
    "workouts": list(top_n_workouts)
}

print(json.dumps(result))