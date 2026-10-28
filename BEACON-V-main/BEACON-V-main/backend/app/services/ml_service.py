import tensorflow as tf
import numpy as np
import math
import os

MODEL_PATH = "movement_model.h5"
model = None

def load_ml_model():
    global model
    if os.path.exists(MODEL_PATH):
        try:
            # compile=False is needed if custom metrics were used or version mismatch
            model = tf.keras.models.load_model(MODEL_PATH, compile=False)
            print("Model loaded successfully.")
        except Exception as e:
            print(f"Warning: Failed to load model: {e}")
            print("Backend will continue running without ML features.")
            model = None
    else:
        print(f"Model file not found at {MODEL_PATH}")
        model = None

def load_model():
    """Wrapper to be called from main.py"""
    load_ml_model()

def predict_destination(gps_path):
    """
    gps_path: List of dictionaries or objects with 'latitude' and 'longitude'.
    Must be at least 20 points. We take the last 20.
    Returns: (predicted_lat, predicted_lon)
    """
    global model
    
    # Ensure we use the last 20 points
    sequence = gps_path[-20:]
    last_lat = sequence[-1].latitude
    last_lon = sequence[-1].longitude

    if model is None:
        print("Warning: Model not loaded. Using fallback (linear extrapolation).")
        # Fallback logic: Simple linear extrapolation or just last point with small offset
        # This prevents the UI from showing "Network Error" during a demo
        if len(sequence) >= 2:
            lat_diff = sequence[-1].latitude - sequence[-2].latitude
            lon_diff = sequence[-1].longitude - sequence[-2].longitude
            return last_lat + lat_diff * 5, last_lon + lon_diff * 5
        return last_lat + 0.001, last_lon + 0.001

    # Convert to numpy array of shape (1, 20, 2)
    # Assuming input features order is [latitude, longitude]
    data = np.array([[p.latitude, p.longitude] for p in sequence])
    data = np.expand_dims(data, axis=0) # (1, 20, 2)

    prediction = model.predict(data)
    # Output shape is (1, 2) -> [[lat, lon]]
    pred_lat = float(prediction[0][0])
    pred_lon = float(prediction[0][1])
    
    return pred_lat, pred_lon

def haversine_distance(lat1, lon1, lat2, lon2):
    R = 6371  # Earth radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat/2) * math.sin(dlat/2) + \
        math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * \
        math.sin(dlon/2) * math.sin(dlon/2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c

def check_zone_eligibility(pred_lat, pred_lon, zones):
    """
    zones: List of zone dictionaries/objects
    Returns: (is_eligible, zone_name, distance)
    """
    min_dist = float('inf')
    target_zone = None
    
    for zone in zones:
        # Zone object might be dict or Pydantic model, handle both
        z_lat = zone.get('center_lat') if isinstance(zone, dict) else zone.center_lat
        z_lon = zone.get('center_lon') if isinstance(zone, dict) else zone.center_lon
        z_rad = zone.get('radius_km') if isinstance(zone, dict) else zone.radius_km
        z_name = zone.get('name') if isinstance(zone, dict) else zone.name
        
        dist = haversine_distance(pred_lat, pred_lon, z_lat, z_lon)
        
        if dist <= z_rad:
            return True, z_name, dist
        
        if dist < min_dist:
            min_dist = dist
            target_zone = z_name
            
    if not target_zone:
        return False, "No Zones Defined", 0.0
            
    return False, target_zone, min_dist
