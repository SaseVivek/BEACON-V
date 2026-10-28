import tensorflow as tf
import os

model_path = "movement_model.h5"
if not os.path.exists(model_path):
    print(f"Error: {model_path} not found.")
    exit(1)

try:
    model = tf.keras.models.load_model(model_path, compile=False)
    print("Model Loaded Successfully.")
    print("Input Shape:", model.input_shape)
    print("Output Shape:", model.output_shape)
    model.summary()
except Exception as e:
    print(f"Error loading model: {e}")
