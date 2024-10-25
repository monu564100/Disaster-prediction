from flask import Flask, request, jsonify
import pickle
import numpy as np
from flask_cors import CORS  # Enables CORS for cross-origin requests from React

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests from React

# Load the trained model
model = pickle.load(open('model.pkl', 'rb'))

@app.route('/')
def index():
    return "Welcome to the Natural Disaster Prediction API"

@app.route('/predict', methods=['POST'])
def predict():
    # Get data from the JSON request body
    data = request.get_json()
    try:
        # Extract the required features (e.g., oxygen, temperature, humidity) and convert to float
        int_features = [float(data['oxygen']), float(data['temperature']), float(data['humidity'])]
        final = [np.array(int_features)]
        
        # Make a prediction
        prediction = model.predict_proba(final)
        output = float(prediction[0][1])  # Probability of fire occurring
        
        # Determine safety status based on the probability threshold
        if output > 0.5:
            message = "Your Forest is in Danger. Probability of fire occurring is {:.2f}".format(output)
        else:
            message = "Your Forest is safe. Probability of fire occurring is {:.2f}".format(output)
        
        # Return the prediction result as JSON
        return jsonify({"prediction": message, "probability": output})
    
    except Exception as e:
        # Handle any exceptions and return an error message
        return jsonify({"error": str(e), "message": "Invalid input or model error"}), 400

if __name__ == '__main__':
    app.run(debug=True)
