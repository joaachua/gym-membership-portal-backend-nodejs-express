import sys
import json
import joblib
import pandas as pd
import numpy as np
import random

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
        
        if not hasattr(model, "predict_proba"):
            raise AttributeError("Model does not support probability prediction.")

        proba = model.predict_proba(features_df)[0]  # probabilities for all classes

        top_n = 10  # Get top 10 workouts by probability
        pick_n = 5  # Number to randomly pick from top 10

        top_indices = np.argsort(proba)[::-1][:top_n]
        top_workouts_all = workout_enc.inverse_transform(top_indices).tolist()

        # Randomly sample 5 unique workouts from top 10
        if len(top_workouts_all) < pick_n:
            sampled_workouts = top_workouts_all  # fallback if less than 5
        else:
            sampled_workouts = random.sample(top_workouts_all, pick_n)

        print("Workouts predicted (random sample):", sampled_workouts, file=sys.stderr)
        print(json.dumps({ "workouts": sampled_workouts }))

    except Exception as e:
        print(json.dumps({ "error": str(e) }))
        sys.exit(1)

if __name__ == "__main__":
    main()
