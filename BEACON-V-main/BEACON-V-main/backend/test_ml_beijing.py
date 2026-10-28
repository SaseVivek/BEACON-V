import tensorflow as tf
import numpy as np
import os

MODEL_PATH = "movement_model.h5"
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

# Test case 3: Beijing [Lat, Lon]
test_input_3 = np.tile([39.9, 116.4], (20, 1))
test_input_3 = np.expand_dims(test_input_3, axis=0)
pred_3 = model.predict(test_input_3)
print(f"Input Beijing [Lat, Lon] -> Prediction: {pred_3}")

# Test case 4: Beijing [Lon, Lat]
test_input_4 = np.tile([116.4, 39.9], (20, 1))
test_input_4 = np.expand_dims(test_input_4, axis=0)
pred_4 = model.predict(test_input_4)
print(f"Input Beijing [Lon, Lat] -> Prediction: {pred_4}")
