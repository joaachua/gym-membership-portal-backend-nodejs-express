import sys
import json
import joblib

# Load model and encoders
model = joblib.load("app/Models/User/workout_model.pkl")
goal_enc = joblib.load("app/Models/User/goal_encoder.pkl")
level_enc = joblib.load("app/Models/User/level_encoder.pkl")
equip_enc = joblib.load("app/Models/User/equip_encoder.pkl")
workout_enc = joblib.load("app/Models/User/workout_encoder.pkl")

if __name__ == "__main__":
    try:
        data = json.loads(sys.argv[1])
        goal = goal_enc.transform([data["goal"]])[0]
        level = level_enc.transform([data["level"]])[0]
        equip = equip_enc.transform([data["equipment"]])[0]

        pred = model.predict([[goal, level, equip]])[0]
        workout = workout_enc.inverse_transform([pred])[0]

        print(json.dumps({"workout": workout}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
