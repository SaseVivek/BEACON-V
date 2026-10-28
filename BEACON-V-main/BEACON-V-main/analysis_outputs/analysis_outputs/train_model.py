import pandas as pd
import numpy as np
import json
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Input
from sklearn.preprocessing import MinMaxScaler
import os
import math

# Constants
CSV_FILE = 'train.csv'
MODEL_FILE = 'movement_model.h5'
CHUNK_SIZE = 10000
SEQUENCE_LENGTH = 20
EPOCHS = 10
BATCH_SIZE = 64
VALIDATION_SPLIT = 0.2

def parse_polyline(polyline_str):
    """Parses the polyline string into a list of coordinates."""
    try:
        return json.loads(polyline_str)
    except Exception:
        return []

def get_total_lines(filename):
    """Counts total lines in the file for estimation."""
    print("Counting lines in dataset...")
    count = 0
    with open(filename, 'r') as f:
        for _ in f:
            count += 1
    print(f"Total lines: {count}")
    return count - 1 # Exclude header

def fit_scaler(filename, sample_size=100000):
    """Fits the scaler on a subset of the data."""
    print(f"Fitting scaler on first {sample_size} rows...")
    scaler = MinMaxScaler()
    
    # Read a sample
    df_sample = pd.read_csv(filename, nrows=sample_size)
    
    all_coords = []
    for poly in df_sample['POLYLINE']:
        points = parse_polyline(poly)
        # Collect all points to learn global min/max
        all_coords.extend(points)
        
    if not all_coords:
        # Fallback if sample is empty or invalid
        print("Warning: No valid points found in sample. Using default bounds.")
        all_coords = [[-8.7, 41.1], [-8.5, 41.2]] # Approximate Porto bounds
        
    scaler.fit(all_coords)
    print("Scaler fitted.")
    return scaler

def data_generator(filename, batch_size, sequence_length, scaler, start_row, end_row):
    """Yields batches of data from the CSV within the specified row range."""
    
    rows_to_read = end_row - start_row
    skip_rows = start_row + 1 # +1 for header
    
    # Infinite loop for Keras generator
    while True:
        # Initialize reader for this epoch
        reader = pd.read_csv(
            filename, 
            chunksize=CHUNK_SIZE, 
            skiprows=range(1, skip_rows) if start_row > 0 else None,
            nrows=rows_to_read,
            header=0
        )
        
        X_batch = []
        y_batch = []
        
        rows_processed_in_epoch = 0
        
        for chunk in reader:
            if rows_processed_in_epoch >= rows_to_read:
                break
                
            # Filter missing data
            if 'MISSING_DATA' in chunk.columns:
                chunk = chunk[chunk['MISSING_DATA'] == False]
            
            for polyline_str in chunk['POLYLINE']:
                points = parse_polyline(polyline_str)
                
                # Check valid trajectory length
                if len(points) < sequence_length:
                    continue
                
                # Input: First N points
                input_seq = points[:sequence_length]
                # Target: Final destination point
                target_point = points[-1]
                
                X_batch.append(input_seq)
                y_batch.append(target_point)
                
                if len(X_batch) == batch_size:
                    X_np = np.array(X_batch)
                    y_np = np.array(y_batch)
                    
                    # Normalize input and target
                    # Reshape input to (batch * seq, 2) for scaling
                    X_flat = X_np.reshape(-1, 2)
                    X_scaled_flat = scaler.transform(X_flat)
                    X_scaled = X_scaled_flat.reshape(batch_size, sequence_length, 2)
                    
                    # Scale target
                    y_scaled = scaler.transform(y_np)
                    
                    yield X_scaled, y_scaled
                    
                    X_batch = []
                    y_batch = []
            
            rows_processed_in_epoch += len(chunk)

def main():
    # 1. Setup
    total_samples = get_total_lines(CSV_FILE)
    
    # Simple split index
    train_samples = int(total_samples * (1 - VALIDATION_SPLIT))
    val_samples = total_samples - train_samples
    
    print(f"Train samples (approx): {train_samples}")
    print(f"Val samples (approx): {val_samples}")
    
    # 2. Scaler
    scaler = fit_scaler(CSV_FILE)
    
    # 3. Model
    print("Building LSTM model...")
    model = Sequential([
        Input(shape=(SEQUENCE_LENGTH, 2)),
        LSTM(64, return_sequences=False),
        Dense(32, activation='relu'),
        Dense(2) # Output: Lat, Long (Linear activation for regression)
    ])
    
    model.compile(optimizer='adam', loss='mse', metrics=['mae'])
    model.summary()
    
    # 4. Training
    # We estimate steps based on samples. Note: Actual usable samples will be less due to filtering.
    # We'll apply a reduction factor estimation (e.g. 90% usable).
    usable_factor = 0.9
    train_steps = int((train_samples * usable_factor) // BATCH_SIZE)
    val_steps = int((val_samples * usable_factor) // BATCH_SIZE)
    
    print(f"Training steps per epoch: {train_steps}")
    print(f"Validation steps per epoch: {val_steps}")
    
    train_gen = data_generator(CSV_FILE, BATCH_SIZE, SEQUENCE_LENGTH, scaler, 0, train_samples)
    val_gen = data_generator(CSV_FILE, BATCH_SIZE, SEQUENCE_LENGTH, scaler, train_samples, total_samples)
    
    history = model.fit(
        train_gen,
        steps_per_epoch=train_steps,
        validation_data=val_gen,
        validation_steps=val_steps,
        epochs=EPOCHS
    )
    
    # 5. Save
    model.save(MODEL_FILE)
    print(f"Model saved to {MODEL_FILE}")

if __name__ == "__main__":
    main()
