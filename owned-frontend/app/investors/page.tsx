'use client';

import { useState } from 'react';
import { Nav } from '@/components/Nav';
import { Lock, ArrowRight, ShieldCheck, TrendingUp, Users } from 'lucide-react';
import toast from 'react-hot-toast';

export default function InvestorsPage() {
    const [password, setPassword] = useState('');
    const [isAuthorized, setIsAuthorized] = useState(false);

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        if (password === 'OWNED2026') {
            setIsAuthorized(true);
            toast.success('Access Granted');
        } else {
            toast.error('Incorrect Password');
        }
    };

    if (!isAuthorized) {
        return (
            <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center p-6 relative overflow-hidden">
                <div className="absolute inset-0 bg-primary/5 blur-[120px] rounded-full translate-y-1/2 scale-150" />

                <div className="max-w-md w-full space-y-12 relative z-10 text-center">
                    <div className="space-y-6">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] mx-auto object-contain brightness-0 invert" />
                        <div className="space-y-2">
                            <h1 className="text-4xl font-black text-white tracking-tight">Investor <span className="text-primary italic">Portal</span></h1>
                            <p className="text-slate-400 font-medium">Please enter the access code to view the confidential deck and data room.</p>
                        </div>
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                            <input
                                type="password"
                                placeholder="Access Code"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="w-full pl-16 pr-6 py-6 bg-white/5 border border-white/10 rounded-3xl text-white placeholder:text-slate-600 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                                autoFocus
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full py-6 bg-primary text-primary-foreground rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-saas hover:scale-[1.02] active:scale-[0.98] transition-all"
                        >
                            Enter Portal
                        </button>
                    </form>

                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-600 italic">
                        Authorized Personnel Only
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50">
            <Nav />
            <main className="max-w-7xl mx-auto px-6 py-24 space-y-24">
                <div className="space-y-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20">
                        Seed Round 2026
                    </div>
                    <h1 className="text-6xl font-black tracking-tight leading-tight">
                        The Sovereignty <span className="text-primary italic">Protocol</span>.
                    </h1>
                </div>

                {/* Strategy Deck Placeholder */}
                <div className="aspect-video w-full bg-slate-900 rounded-[3rem] border border-white/5 shadow-saas-lg flex flex-col items-center justify-center p-20 space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Lock className="w-16 h-16 text-primary animate-pulse" />
                    <div className="text-center space-y-4 relative z-10">
                        <h2 className="text-3xl font-black text-white italic">Interactive Pitch Deck</h2>
                        <p className="text-slate-400 font-medium max-w-sm">Use the arrows or your keyboard to navigate the strategy slides.</p>
                    </div>
                    <button className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg relative z-10 hover:scale-105 transition-all">
                        Launch Presentation
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="bg-white p-10 rounded-4xl border border-border shadow-sm space-y-4">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-extrabold">Market size</h3>
                        <p className="text-muted-foreground font-medium italic">$250B+ Creator Economy growing at 15% CAGR.</p>
                    </div>
                    <div className="bg-white p-10 rounded-4xl border border-border shadow-sm space-y-4">
                        <Users className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-extrabold">Early Traction</h3>
                        <p className="text-muted-foreground font-medium italic">500+ Qualified creators on waitlist for Q1 Launch.</p>
                    </div>
                    <div className="bg-white p-10 rounded-4xl border border-border shadow-sm space-y-4">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-extrabold">Moat</h3>
                        <p className="text-muted-foreground font-medium italic">Native IPFS fulfillment + Sovereign Smart Contracts.</p>
                    </div>
                </div>
            </main>
        </div>
    );
}
