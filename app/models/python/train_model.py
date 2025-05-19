import pandas as pd
import joblib
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
from sklearn.model_selection import StratifiedKFold
from sklearn.model_selection import train_test_split, GridSearchCV
from sklearn.metrics import classification_report
import os

# Load the dataset
file_path = os.path.join(os.path.dirname(__file__), 'Gym-Exercises-Dataset.xlsx')
df = pd.read_excel(file_path)

# Drop junk column
df = df.drop(columns=['Description'], errors='ignore')

# Handle missing values
df = df.dropna(subset=['muscle_gp', 'Equipment', 'Exercise_Name'])

# Rename for consistency
df.rename(columns={
    'Exercise_Name': 'workout',
    'Equipment': 'equipment',
    'muscle_gp': 'muscle_group',
    'Rating': 'rating'
}, inplace=True)

# Encode categorical features
muscle_enc = LabelEncoder()
equip_enc = LabelEncoder()
workout_enc = LabelEncoder()

df['muscle_enc'] = muscle_enc.fit_transform(df['muscle_group'])
df['equip_enc'] = equip_enc.fit_transform(df['equipment'])
df['workout_enc'] = workout_enc.fit_transform(df['workout'])

# Prepare features and target
X = df[['muscle_enc', 'equip_enc', 'rating']]
y = df['workout_enc']

# Train-test split
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# Define classifier
rf = RandomForestClassifier(random_state=42)

# Optional: Hyperparameter tuning
param_grid = {
    'n_estimators': [100, 200],
    'max_depth': [5, 10, None],
    'min_samples_split': [2, 5],
}
cv = StratifiedKFold(n_splits=2, shuffle=True, random_state=42)
grid_search = GridSearchCV(rf, param_grid, cv=cv, n_jobs=-1, verbose=1)
grid_search.fit(X_train, y_train)

# Best model
best_rf = grid_search.best_estimator_

# Evaluate
y_pred = best_rf.predict(X_test)

# Get unique labels present in y_test
labels = sorted(set(y_test))

# Get corresponding class names for those labels
target_names = [workout_enc.classes_[i] for i in labels]

print(classification_report(y_test, y_pred, labels=labels, target_names=target_names))

# Save model and encoders
joblib.dump(best_rf, 'app/models/python/workout_model.pkl')
joblib.dump(muscle_enc, 'app/models/python/muscle_encoder.pkl')
joblib.dump(equip_enc, 'app/models/python/equip_encoder.pkl')
joblib.dump(workout_enc, 'app/models/python/workout_encoder.pkl')
