import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Circle, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api';
import { Map as MapIcon, Navigation, Activity, History, Shield, LogOut, Radio, AlertTriangle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

// Fix icons
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const ChangeView = ({ center }) => {
    const map = useMap();
    map.setView(center, map.getZoom());
    return null;
};

const Dashboard = () => {
    const [gpsInput, setGpsInput] = useState('');
    const [prediction, setPrediction] = useState(null);
    const [history, setHistory] = useState([]);
    const [zones, setZones] = useState([]);
    const [mapCenter, setMapCenter] = useState([51.505, -0.09]);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetchHistory();
        fetchZones();
    }, []);

    const fetchHistory = async () => {
        try {
            const res = await api.get('/vehicles/my-logs');
            setHistory(res.data);
        } catch (err) {
            console.error("Failed to fetch history");
        }
    };

    const fetchZones = async () => {
        try {
            const res = await api.get('/admin/zones');
            setZones(res.data);
            if (res.data.length > 0) {
                setMapCenter([res.data[0].center_lat, res.data[0].center_lon]);
            }
        } catch (err) {
            console.error("Failed to fetch zones");
        }
    };

    const handlePredict = async () => {
        setIsLoading(true);
        try {
            const lines = gpsInput.trim().split('\n');
            const points = lines.map(line => {
                const [lat, lon] = line.split(',').map(Number);
                return { latitude: lat, longitude: lon };
            }).filter(p => !isNaN(p.latitude) && !isNaN(p.longitude));

            if (points.length < 20) {
                alert("Need at least 20 points! Format: lat,lon (one per line)");
                setIsLoading(false);
                return;
            }

            const res = await api.post('/vehicles/gps-input', {
                vehicle_id: "my-vehicle",
                gps_path: points
            });

            setPrediction(res.data);
            setMapCenter([res.data.predicted_lat, res.data.predicted_lon]);
            fetchHistory();
        } catch (err) {
            alert("Prediction failed: " + (err.response?.data?.detail || err.message));
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-slate-950 overflow-hidden">
            {/* Sidebar */}
            <div className="w-80 glass-panel border-r border-slate-700 flex flex-col z-20 shadow-2xl">
                <div className="p-6 border-b border-slate-700/50">
                    <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-500 mb-1">
                        BEACON-V
                    </h1>
                    <p className="text-xs text-slate-400 font-mono tracking-widest">COMMAND CENTER</p>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-6">
                    {/* Prediction Input Section */}
                    <div className="space-y-3">
                        <h3 className="text-xs font-semibold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                            <Navigation size={14} /> Trajectory Input
                        </h3>
                        <div className="bg-slate-900/50 rounded-lg p-3 border border-slate-700">
                            <textarea
                                className="w-full h-32 bg-transparent text-xs text-slate-300 font-mono focus:outline-none resize-none placeholder-slate-600"
                                value={gpsInput}
                                onChange={(e) => setGpsInput(e.target.value)}
                                placeholder="Paste GPS Coordinates Log:&#10;41.15,-8.61&#10;41.16,-8.62&#10;..."
                            />
                        </div>
                        <button
                            onClick={handlePredict}
                            disabled={isLoading}
                            className="btn-primary py-2 text-sm flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Activity className="animate-spin" size={16} /> : <Radio size={16} />}
                            {isLoading ? 'Processing...' : 'Predict Destination'}
                        </button>
                    </div>

                    {/* Result Card */}
                    {prediction && (
                        <div className={`p-4 rounded-xl border backdrop-blur-md transition-all duration-500 ${prediction.is_eligible ? 'bg-emerald-950/40 border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'bg-rose-950/40 border-rose-500/50 shadow-lg shadow-rose-500/10'}`}>
                            <div className="flex items-center justify-between mb-2">
                                <span className="text-xs font-bold text-slate-400 uppercase">Analysis Result</span>
                                {prediction.is_eligible ?
                                    <Shield size={16} className="text-emerald-400" /> :
                                    <AlertTriangle size={16} className="text-rose-400" />
                                }
                            </div>
                            <h2 className={`text-xl font-bold mb-1 ${prediction.is_eligible ? 'text-emerald-400' : 'text-rose-400'}`}>
                                {prediction.is_eligible ? 'ELIGIBLE' : 'NOT ELIGIBLE'}
                            </h2>
                            <div className="space-y-1 text-xs text-slate-300 font-mono">
                                <p>Dest: {prediction.predicted_lat.toFixed(4)}, {prediction.predicted_lon.toFixed(4)}</p>
                                {prediction.target_zone_name ?
                                    <p className="text-cyan-300">Zone: {prediction.target_zone_name}</p> :
                                    <p className="text-slate-500">No Zone Detected</p>
                                }
                                <p>Dist: {prediction.distance_to_zone_km.toFixed(2)} km</p>
                            </div>
                        </div>
                    )}

                    {/* History Section */}
                    <div className="space-y-2">
                        <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                            <History size={14} /> Recent Decisions
                        </h3>
                        <div className="space-y-2">
                            {history.slice().reverse().map((log) => (
                                <div key={log._id} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-700/50 hover:border-slate-600 transition-colors">
                                    <div className="flex flex-col">
                                        <span className={`text-xs font-bold ${log.is_eligible ? "text-emerald-400" : "text-rose-400"}`}>
                                            {log.is_eligible ? "ELIGIBLE" : "DENIED"}
                                        </span>
                                        <span className="text-[10px] text-slate-500 font-mono">
                                            {new Date(log.timestamp).toLocaleTimeString()}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <span className="text-[10px] text-slate-400 font-mono block">
                                            {log.distance_to_zone_km.toFixed(1)}km
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="p-4 border-t border-slate-700/50 bg-slate-900/50">
                    <button onClick={handleLogout} className="flex items-center gap-2 text-slate-400 hover:text-white text-sm transition-colors w-full justify-center">
                        <LogOut size={16} /> Logout Secure Session
                    </button>
                </div>
            </div>

            {/* Main Content Area (Map) */}
            <div className="flex-1 relative bg-slate-900">
                <div className="absolute top-4 right-4 z-[400] bg-slate-900/80 backdrop-blur-md text-white px-4 py-2 rounded-lg border border-slate-700 shadow-lg flex items-center gap-2">
                    <MapIcon size={16} className="text-cyan-400" />
                    <span className="text-sm font-semibold">Live Tracking Feed</span>
                </div>

                <MapContainer center={mapCenter} zoom={13} className="h-full w-full grayscale-[50%] invert-[10%]">
                    <ChangeView center={mapCenter} />
                    <TileLayer
                        attribution='&copy; <a href="https://carto.com/attributions">CARTO</a>'
                        url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                    />

                    {/* Zones */}
                    {zones.map((zone, idx) => (
                        <Circle
                            key={idx}
                            center={[zone.center_lat, zone.center_lon]}
                            radius={zone.radius_km * 1000}
                            pathOptions={{ color: '#10b981', fillColor: '#10b981', fillOpacity: 0.2, weight: 2, dashArray: '5, 10' }}
                        >
                            <Popup className="glass-popup">
                                <div className="text-slate-900 font-bold">{zone.name}</div>
                                <div className="text-slate-600 text-xs">Radius: {zone.radius_km}km</div>
                            </Popup>
                        </Circle>
                    ))}

                    {/* Predicted Point */}
                    {prediction && (
                        <Marker position={[prediction.predicted_lat, prediction.predicted_lon]}>
                            <Popup>Predicted Destination</Popup>
                        </Marker>
                    )}
                </MapContainer>
            </div>
        </div>
    );
};

export default Dashboard;
