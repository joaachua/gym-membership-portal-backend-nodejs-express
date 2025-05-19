import sys
import json
import joblib
import pandas as pd

# Load model and encoders
model = joblib.load('app/models/python/workout_model.pkl')
muscle_enc = joblib.load('app/models/python/muscle_encoder.pkl')
equip_enc = joblib.load('app/models/python/equip_encoder.pkl')
workout_enc = joblib.load('app/models/python/workout_encoder.pkl')

def main():
    try:
        # Read JSON input from Node.js
        input_data = json.loads(sys.stdin.read())
        print("Received input:", input_data, file=sys.stderr)

        muscle_group = input_data.get("muscle_group")
        equipment = input_data.get("equipment")
        rating_raw = input_data.get("rating", 0)

        try:
            rating = float(rating_raw)
        except ValueError:
            raise ValueError("Invalid rating value. Must be a number.")

        # Encode inputs
        muscle_encoded = muscle_enc.transform([muscle_group])[0]
        equip_encoded = equip_enc.transform([equipment])[0]

        # Create input DataFrame with proper feature names
        features_df = pd.DataFrame([{
            'muscle_enc': muscle_encoded,
            'equip_enc': equip_encoded,
            'rating': rating
        }])

        # Predict
        workout_encoded = model.predict(features_df)[0]
        workout_name = workout_enc.inverse_transform([workout_encoded])[0]

        # Output result as JSON
        output = { "workout": workout_name }
        print(json.dumps(output))

    except Exception as e:
        print(json.dumps({ "error": str(e) }))

if __name__ == "__main__":
    main()
