import requests
import json
import time

BASE_URL = "http://localhost:8000"

def wait_for_server():
    print("Waiting for server...")
    for _ in range(10):
        try:
            requests.get(BASE_URL)
            print("Server is up!")
            return True
        except:
            time.sleep(1)
    print("Server failed to start.")
    return False

def run_test():
    if not wait_for_server():
        return

    session = requests.Session()
    
    # 1. Register Admin
    print("\n[1] Registering Admin...")
    reg_data = {"username": "admin_test", "password": "password123", "role": "admin"}
    res = session.post(f"{BASE_URL}/auth/register", json=reg_data)
    if res.status_code == 200:
        print("Admin Registered.")
    else:
        print(f"Registration (or already exists): {res.status_code}")

    # 2. Login Admin
    print("\n[2] Logging in Admin...")
    login_data = {"username": "admin_test", "password": "password123"}
    res = session.post(f"{BASE_URL}/auth/token", data=login_data)
    token = res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}
    print("Token received.")

    # 3. Create Zone
    print("\n[3] Creating Zone...")
    zone_data = {
        "name": "Test Hospital",
        "center_lat": 41.15,
        "center_lon": -8.61,
        "radius_km": 5.0
    }
    res = session.post(f"{BASE_URL}/admin/zones", json=zone_data, headers=headers)
    print(f"Zone Creation: {res.status_code}")

    # 4. Predict (Vehicle Flow)
    print("\n[4] Testing Prediction...")
    # Generate 20 points
    gps_path = [{"latitude": 41.14 + (i*0.001), "longitude": -8.60 + (i*0.001)} for i in range(20)]
    vehicle_data = {"vehicle_id": "v1", "gps_path": gps_path}
    
    res = session.post(f"{BASE_URL}/vehicles/gps-input", json=vehicle_data, headers=headers)
    if res.status_code == 200:
        print("Prediction Success!")
        print(json.dumps(res.json(), indent=2))
    else:
        print(f"Prediction Failed: {res.text}")

if __name__ == "__main__":
    run_test()
