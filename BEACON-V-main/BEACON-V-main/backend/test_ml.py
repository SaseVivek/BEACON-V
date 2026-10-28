import tensorflow as tf
import numpy as np
import os

MODEL_PATH = "movement_model.h5"
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

# Test case 1: [Lat, Lon]
test_input_1 = np.tile([41.15, -8.61], (20, 1))
test_input_1 = np.expand_dims(test_input_1, axis=0)
pred_1 = model.predict(test_input_1)
print(f"Input [Lat, Lon] -> Prediction: {pred_1}")

# Test case 2: [Lon, Lat]
test_input_2 = np.tile([-8.61, 41.15], (20, 1))
test_input_2 = np.expand_dims(test_input_2, axis=0)
pred_2 = model.predict(test_input_2)
print(f"Input [Lon, Lat] -> Prediction: {pred_2}")
