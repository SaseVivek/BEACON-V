import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Radio, Activity, ChevronRight, Zap, Globe, Map as MapIcon, Database } from 'lucide-react';

const LandingPage = () => {
    const navigate = useNavigate();
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="min-h-screen bg-slate-950 relative overflow-hidden font-display selection:bg-cyan-500/30">
            {/* Ambient Background Effects */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-500/10 rounded-full blur-[120px] animate-pulse" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
                <div className="absolute top-[20%] right-[30%] w-[20%] h-[20%] bg-purple-500/10 rounded-full blur-[100px] animate-float" />
            </div>

            {/* Grid Pattern */}
            <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 z-0"></div>
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] z-0"></div>

            {/* Content Container */}
            <div className="relative z-10 container mx-auto px-6 pt-32 pb-20">

                {/* Hero Section */}
                <div className={`max-w-4xl mx-auto text-center transition-all duration-1000 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>

                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-900/50 border border-slate-700/50 backdrop-blur-md mb-8 animate-float">
                        <span className="relative flex h-3 w-3">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
                        </span>
                        <span className="text-xs font-mono text-cyan-300 tracking-wider">SYSTEM ONLINE: v2.0.4</span>
                    </div>

                    <h1 className="text-7xl md:text-8xl font-bold tracking-tight mb-8">
                        <span className="bg-clip-text text-transparent bg-gradient-to-r from-white via-cyan-100 to-slate-400">
                            BEACON
                        </span>
                        <span className="text-cyan-500">-V</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 mb-12 leading-relaxed max-w-2xl mx-auto">
                        Next-generation delay-tolerant vehicular network monitoring.
                        Powered by AI for precise trajectory prediction.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <button
                            onClick={() => navigate('/login')}
                            className="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white rounded-xl font-semibold text-lg transition-all shadow-[0_0_40px_-10px_rgba(8,145,178,0.5)] hover:shadow-[0_0_60px_-10px_rgba(8,145,178,0.6)] w-full sm:w-auto overflow-hidden"
                        >
                            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]"></div>
                            <span className="flex items-center justify-center gap-2">
                                Launch Command Center <ChevronRight size={20} />
                            </span>
                        </button>

                        <button className="px-8 py-4 bg-slate-900/50 hover:bg-slate-800/50 text-slate-300 border border-slate-700 hover:border-slate-600 rounded-xl font-semibold text-lg transition-all backdrop-blur-md w-full sm:w-auto">
                            Documentation
                        </button>
                    </div>
                </div>

                {/* Features Grid */}
                <div className={`grid md:grid-cols-3 gap-6 mt-32 transition-all duration-1000 delay-300 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    {features.map((feature, idx) => (
                        <div key={idx} className="group p-8 rounded-2xl bg-slate-900/40 border border-slate-800/50 hover:border-cyan-500/30 hover:bg-slate-800/40 transition-all duration-300 backdrop-blur-sm">
                            <div className="w-12 h-12 rounded-lg bg-slate-800/50 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300 border border-slate-700/50 group-hover:border-cyan-500/30">
                                {feature.icon}
                            </div>
                            <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                            <p className="text-slate-400 leading-relaxed text-sm">
                                {feature.desc}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div className={`mt-32 pt-20 border-t border-slate-800/50 transition-all duration-1000 delay-500 transform ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {stats.map((stat, idx) => (
                            <div key={idx} className="text-center">
                                <div className="text-4xl font-bold text-white mb-2 font-mono">{stat.value}</div>
                                <div className="text-sm text-slate-500 uppercase tracking-wider">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const features = [
    {
        icon: <Radio className="text-cyan-400" size={24} />,
        title: "Real-time Tracking",
        desc: "High-precision GPS visualization using Leaflet maps. Monitor vehicle movements with millisecond latency updates."
    },
    {
        icon: <Activity className="text-purple-400" size={24} />,
        title: "Predictive AI Core",
        desc: "Advanced LSTM neural networks analyze historical data to predict future coordinates and destination vectors."
    },
    {
        icon: <Shield className="text-emerald-400" size={24} />,
        title: "Secure Access",
        desc: "Enterprise-grade JWT authentication ensures only authorized personnel can access the command telemetry."
    }
];

const stats = [
    { value: "99.9%", label: "System Uptime" },
    { value: "<50ms", label: "Latency" },
    { value: "256-bit", label: "Encryption" },
    { value: "∞", label: "Scalability" }
];

export default LandingPage;
