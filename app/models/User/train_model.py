import pandas as pd
from sklearn.tree import DecisionTreeClassifier
from sklearn.preprocessing import LabelEncoder
import joblib

# Sample data (expand this over time)
data = [
    {"goal": "strength", "level": "beginner", "equipment": "none", "workout": "Bodyweight Squats"},
    {"goal": "strength", "level": "beginner", "equipment": "basic", "workout": "Goblet Squats"},
    {"goal": "strength", "level": "beginner", "equipment": "full", "workout": "Machine Leg Press"},
    {"goal": "strength", "level": "intermediate", "equipment": "none", "workout": "Push-Ups"},
    {"goal": "strength", "level": "intermediate", "equipment": "basic", "workout": "Dumbbell Lunges"},
    {"goal": "strength", "level": "intermediate", "equipment": "full", "workout": "Barbell Squats"},
    {"goal": "strength", "level": "advanced", "equipment": "basic", "workout": "Dumbbell Bench Press"},
    {"goal": "strength", "level": "advanced", "equipment": "full", "workout": "Deadlifts"},

    {"goal": "cardio", "level": "beginner", "equipment": "none", "workout": "Jumping Jacks"},
    {"goal": "cardio", "level": "beginner", "equipment": "basic", "workout": "Step Aerobics"},
    {"goal": "cardio", "level": "intermediate", "equipment": "none", "workout": "High Knees"},
    {"goal": "cardio", "level": "intermediate", "equipment": "basic", "workout": "Stationary Bike"},
    {"goal": "cardio", "level": "intermediate", "equipment": "full", "workout": "Treadmill Running"},
    {"goal": "cardio", "level": "advanced", "equipment": "basic", "workout": "Jump Rope Intervals"},
    {"goal": "cardio", "level": "advanced", "equipment": "full", "workout": "HIIT on Treadmill"},

    {"goal": "flexibility", "level": "beginner", "equipment": "none", "workout": "Seated Forward Bend"},
    {"goal": "flexibility", "level": "intermediate", "equipment": "none", "workout": "Standing Hamstring Stretch"},
    {"goal": "flexibility", "level": "advanced", "equipment": "none", "workout": "Yoga Flow Sequence"},

    {"goal": "general", "level": "beginner", "equipment": "none", "workout": "Plank Holds"},
    {"goal": "general", "level": "beginner", "equipment": "basic", "workout": "Kettlebell Swings"},
    {"goal": "general", "level": "intermediate", "equipment": "basic", "workout": "Burpees"},
    {"goal": "general", "level": "advanced", "equipment": "full", "workout": "Circuit Training"},
    {"goal": "general", "level": "intermediate", "equipment": "full", "workout": "Rowing Machine"},
    {"goal": "general", "level": "advanced", "equipment": "basic", "workout": "Battle Ropes"},
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
joblib.dump(model, "app/Models/User/workout_model.pkl")
joblib.dump(goal_enc, "app/Models/User/goal_encoder.pkl")
joblib.dump(level_enc, "app/Models/User/level_encoder.pkl")
joblib.dump(equip_enc, "app/Models/User/equip_encoder.pkl")
joblib.dump(workout_enc, "app/Models/User/workout_encoder.pkl")
