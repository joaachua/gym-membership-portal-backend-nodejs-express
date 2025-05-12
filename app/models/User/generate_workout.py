import sys
import json

def generate_workout(goal):
    if goal == 'strength':
        return ["Squats", "Deadlifts", "Bench Press"]
    elif goal == 'cardio':
        return ["Running", "Jump Rope", "Cycling"]
    else:
        return ["Push-ups", "Planks", "Burpees"]

if __name__ == "__main__":
    data = json.loads(sys.argv[1])
    workout = generate_workout(data["goal"])
    print(json.dumps({"workout": workout}))
