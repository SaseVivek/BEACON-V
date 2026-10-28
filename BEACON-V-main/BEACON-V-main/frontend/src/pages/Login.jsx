import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { Truck, Lock, User, CircuitBoard } from 'lucide-react';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            const formData = new FormData();
            formData.append('username', username);
            formData.append('password', password);

            const response = await api.post('/auth/token', formData, {
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            });

            localStorage.setItem('token', response.data.access_token);
            navigate('/dashboard');
        } catch (err) {
            setError('Invalid credentials. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10"></div>

            {/* Logo/Brand */}
            <div className="mb-8 text-center animate-float">
                <div className="flex items-center justify-center text-cyan-400 mb-2">
                    <CircuitBoard size={48} className="mr-2" />
                    <Truck size={48} />
                </div>
                <h1 className="text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-blue-600">
                    BEACON-V
                </h1>
                <p className="text-slate-400 mt-2 text-lg tracking-wide">Delay-Tolerant Vehicular Network</p>
            </div>

            <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-500 to-blue-500"></div>

                <h2 className="text-2xl font-bold mb-6 text-center text-white">Access Portal</h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Username"
                            className="input-field"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-cyan-400 transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button
                        type="submit"
                        className="btn-primary flex items-center justify-center"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        ) : (
                            'Initialize Session'
                        )}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-700/50 pt-4">
                    <p className="text-slate-400 text-sm">New Unit?</p>
                    <Link to="/register" className="text-cyan-400 hover:text-cyan-300 font-semibold transition-colors">
                        Register Vehicle ID
                    </Link>
                </div>
            </div>

            <p className="fixed bottom-4 text-xs text-slate-600">
                System Status: <span className="text-green-500">ONLINE</span> • v1.0.0
            </p>
        </div>
    );
};

export default Login;
