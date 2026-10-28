import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api';
import { UserPlus, Shield, User, Lock, ArrowLeft } from 'lucide-react';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('driver');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');
        try {
            await api.post('/auth/register', { username, password, role });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.detail || 'Registration failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black -z-10"></div>

            <div className="glass-panel p-8 rounded-2xl w-full max-w-md relative overflow-hidden border-t-4 border-green-500">

                <h2 className="text-2xl font-bold mb-2 text-center text-white flex items-center justify-center gap-2">
                    <UserPlus className="text-green-500" /> New Registration
                </h2>
                <p className="text-center text-slate-400 mb-6 text-sm">Create a secure identity on the network</p>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-200 p-3 rounded-lg mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleRegister} className="space-y-4">
                    <div className="relative group">
                        <User className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={20} />
                        <input
                            type="text"
                            placeholder="Username"
                            className="input-field pl-10 focus:ring-green-500/50 focus:border-green-500"
                            value={username} onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Lock className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={20} />
                        <input
                            type="password"
                            placeholder="Password"
                            className="input-field pl-10 focus:ring-green-500/50 focus:border-green-500"
                            value={password} onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <div className="relative group">
                        <Shield className="absolute left-3 top-3.5 text-slate-400 group-focus-within:text-green-400 transition-colors" size={20} />
                        <select
                            className="input-field pl-10 focus:ring-green-500/50 focus:border-green-500 appearance-none bg-slate-900"
                            value={role} onChange={(e) => setRole(e.target.value)}
                        >
                            <option value="driver">Driver (Vehicle Unit)</option>
                            <option value="admin">Central Authority (Admin)</option>
                        </select>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-500 hover:to-emerald-500 text-white font-bold py-3 px-6 rounded-lg shadow-lg shadow-green-500/20 transition-all active:scale-[0.98]"
                        disabled={isLoading}
                    >
                        {isLoading ? 'Creating Account...' : 'Register Entity'}
                    </button>
                </form>

                <div className="mt-6 text-center border-t border-slate-700/50 pt-4">
                    <Link to="/login" className="text-slate-400 hover:text-white flex items-center justify-center gap-2 transition-colors">
                        <ArrowLeft size={16} /> Back to Login
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
