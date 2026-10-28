import tensorflow as tf
import numpy as np
import math

MODEL_PATH = "movement_model.h5"
model = tf.keras.models.load_model(MODEL_PATH, compile=False)

# Test case 5: Radians [Lat, Lon]
test_input_5 = np.tile([math.radians(41.15), math.radians(-8.61)], (20, 1))
test_input_5 = np.expand_dims(test_input_5, axis=0)
pred_5 = model.predict(test_input_5)
print(f"Input Radians [Lat, Lon] -> Prediction: {pred_5}")
