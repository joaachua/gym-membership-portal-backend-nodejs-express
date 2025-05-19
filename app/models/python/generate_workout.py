import sys
import json
import joblib
import pandas as pd

try:
    # Load model and encoders
    model = joblib.load('app/models/python/workout_model.pkl')
    muscle_enc = joblib.load('app/models/python/muscle_encoder.pkl')
    equip_enc = joblib.load('app/models/python/equip_encoder.pkl')
    workout_enc = joblib.load('app/models/python/workout_encoder.pkl')
except Exception as e:
    print(json.dumps({ "error": f"Failed to load model/encoders: {str(e)}" }))
    sys.exit(1)

def main():
    try:
        raw_input = sys.stdin.read()
        print("Raw input:", raw_input, file=sys.stderr)

        input_data = json.loads(raw_input)
        print("Parsed input:", input_data, file=sys.stderr)

        muscle_group = input_data.get("muscle_group")
        equipment = input_data.get("equipment")
        rating_str = input_data.get("rating")

        if not muscle_group or not equipment or rating_str is None:
            raise ValueError("Missing required fields: 'muscle_group', 'equipment', or 'rating'")

        try:
            rating = float(rating_str)
        except ValueError:
            raise ValueError("Rating must be a numeric value")

        print("Encoding inputs...", file=sys.stderr)
        muscle_encoded = muscle_enc.transform([muscle_group])[0]
        equip_encoded = equip_enc.transform([equipment])[0]

        features_df = pd.DataFrame([{
            'muscle_enc': muscle_encoded,
            'equip_enc': equip_encoded,
            'rating': rating
        }])

        print("Predicting...", file=sys.stderr)
        workout_encoded = model.predict(features_df)[0]
        workout_name = workout_enc.inverse_transform([workout_encoded])[0]

        print("Workout predicted:", workout_name, file=sys.stderr)
        print(json.dumps({ "workout": workout_name }))

    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)

if __name__ == "__main__":
    main()
