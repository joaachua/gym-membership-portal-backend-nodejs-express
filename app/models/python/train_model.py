import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Sample data (expand this over time)
data = [
    {"goal": "strength", "level": "beginner", "equipment": "none", "workout": "Back Squats", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "beginner", "equipment": "basic", "workout": "Goblet Squats", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "beginner", "equipment": "full", "workout": "Machine Leg Press", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "beginner", "equipment": "none", "workout": "Push-Ups", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "beginner", "equipment": "full", "workout": "Machine Chest Press", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "intermediate", "equipment": "none", "workout": "Push-Ups", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "intermediate", "equipment": "basic", "workout": "Dumbbell Lunges", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "intermediate", "equipment": "full", "workout": "Barbell Squats", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "intermediate", "equipment": "none", "workout": "Tricep Dips", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "advanced", "equipment": "basic", "workout": "Dumbbell Bench Press", "reps": 12, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "advanced", "equipment": "full", "workout": "Deadlifts", "reps": 12, "sets": 3, "mins": 30},
    {"goal": "strength", "level": "advanced", "equipment": "none", "workout": "Muscle-Ups", "reps": 12, "sets": 3, "mins": 30},

    {"goal": "cardio", "level": "beginner", "equipment": "none", "workout": "Jumping Jacks", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "beginner", "equipment": "basic", "workout": "Step Aerobics", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "beginner", "equipment": "none", "workout": "Burpees", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "intermediate", "equipment": "none", "workout": "High Knees", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "intermediate", "equipment": "basic", "workout": "Stationary Bike", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "intermediate", "equipment": "full", "workout": "Treadmill Running", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "intermediate", "equipment": "full", "workout": "Cycling", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "advanced", "equipment": "none", "workout": "Sprints", "reps": 12, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "advanced", "equipment": "basic", "workout": "Jump Rope Intervals", "reps": 12, "sets": 3, "mins": 30},
    {"goal": "cardio", "level": "advanced", "equipment": "full", "workout": "HIIT on Treadmill", "reps": 12, "sets": 3, "mins": 30},

    {"goal": "flexibility", "level": "beginner", "equipment": "none", "workout": "Cat-Cow Stretch", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "flexibility", "level": "beginner", "equipment": "none", "workout": "Seated Forward Bend", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "flexibility", "level": "intermediate", "equipment": "none", "workout": "Standing Hamstring Stretch", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "flexibility", "level": "advanced", "equipment": "none", "workout": "Yoga Flow Sequence", "reps": 12, "sets": 3, "mins": 30},
    {"goal": "flexibility", "level": "advanced", "equipment": "none", "workout": "Overhead Shoulder Stretch", "reps": 12, "sets": 3, "mins": 30},

    {"goal": "general", "level": "beginner", "equipment": "none", "workout": "Plank Holds", "reps": 8, "sets": 3, "mins": 1},
    {"goal": "general", "level": "beginner", "equipment": "basic", "workout": "Kettlebell Swings", "reps": 8, "sets": 3, "mins": 30},
    {"goal": "general", "level": "intermediate", "equipment": "basic", "workout": "Burpees", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "general", "level": "intermediate", "equipment": "full", "workout": "Rowing Machine", "reps": 10, "sets": 3, "mins": 30},
    {"goal": "general", "level": "advanced", "equipment": "full", "workout": "Circuit Training", "reps": 12, "sets": 3, "mins": 30},
    {"goal": "general", "level": "advanced", "equipment": "basic", "workout": "Battle Ropes", "reps": 12, "sets": 3, "mins": 30},
]

df = pd.DataFrame(data)

# Label encode
goal_enc = LabelEncoder()
level_enc = LabelEncoder()
equip_enc = LabelEncoder()
workout_enc = LabelEncoder()

df["goal_enc"] = goal_enc.fit_transform(df["goal"])
df["level_enc"] = level_enc.fit_transform(df["level"])
df["equip_enc"] = equip_enc.fit_transform(df["equipment"])
df["workout_enc"] = workout_enc.fit_transform(df["workout"])

# Train model
X = df[["goal_enc", "level_enc", "equip_enc"]]
y = df["workout_enc"]
model = DecisionTreeClassifier()
model.fit(X, y)

# Save model and encoders
joblib.dump(model, "app/models/python/workout_model.pkl")
joblib.dump(goal_enc, "app/models/python/goal_encoder.pkl")
joblib.dump(level_enc, "app/models/python/level_encoder.pkl")
joblib.dump(equip_enc, "app/models/python/equip_encoder.pkl")
joblib.dump(workout_enc, "app/models/python/workout_encoder.pkl")
