import sys
import json
import joblib
import numpy as np

# Load model and encoders
model = joblib.load('app/models/python/workout_model.pkl')
muscle_enc = joblib.load('app/models/python/muscle_encoder.pkl')
equip_enc = joblib.load('app/models/python/equip_encoder.pkl')
workout_enc = joblib.load('app/models/python/workout_encoder.pkl')

def main():
    try:
        raw_input = sys.stdin.read()
        print("Received input:", raw_input, file=sys.stderr)

        input_data = json.loads(raw_input)

        muscle_group = input_data.get("muscle_group")
        equipment = input_data.get("equipment")
        rating = float(input_data.get("rating", 0))

        # Defensive checks
        if muscle_group not in muscle_enc.classes_:
            raise ValueError(f"Unknown muscle group: {muscle_group}")
        if equipment not in equip_enc.classes_:
            raise ValueError(f"Unknown equipment: {equipment}")

        # Encode inputs
        muscle_encoded = muscle_enc.transform([muscle_group])[0]
        equip_encoded = equip_enc.transform([equipment])[0]

        # Predict
        features = np.array([[muscle_encoded, equip_encoded, rating]])
        workout_encoded = model.predict(features)[0]
        workout_name = workout_enc.inverse_transform([workout_encoded])[0]

        # Output result as JSON
        output = { "workout": workout_name }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.stderr.write(f"Exception: {e}\n")

if __name__ == "__main__":
    main()
