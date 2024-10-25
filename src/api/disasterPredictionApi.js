import axios from 'axios';

const BASE_URL = 'http://127.0.0.1:5000';  // Flask backend URL

export const predictForestFire = async (data) => {
    try {
        const response = await axios.post(`${BASE_URL}/predict`, data);
        return response.data.prediction;
    } catch (error) {
        console.error("Error predicting forest fire:", error);
        return "Error";
    }
};

// Add similar functions for earthquake and flood predictions
