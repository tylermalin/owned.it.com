'use client';

import { useState } from 'react';
import { Nav } from '@/components/Nav';
import Link from 'next/link';
import { Lock, ArrowRight, ShieldCheck, TrendingUp, Users, Layers, Calendar } from 'lucide-react';
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

                {/* Strategy Deck */}
                <div className="aspect-video w-full bg-slate-900 rounded-[3rem] border border-white/5 shadow-saas-lg flex flex-col items-center justify-center p-20 space-y-8 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <div className="text-center space-y-4 relative z-10 flex flex-col items-center">
                        <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                            <Layers className="w-10 h-10 text-primary" />
                        </div>
                        <h2 className="text-4xl font-black text-white italic">Interactive Pitch Deck</h2>
                        <p className="text-slate-400 font-medium max-w-sm">Explore our vision, traction, and roadmap for creator sovereignty.</p>
                    </div>
                    <Link
                        href="/investors/deck"
                        className="px-10 py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-lg relative z-10 hover:scale-105 transition-all flex items-center gap-4 group/btn"
                    >
                        Launch Presentation
                        <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" />
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                    <div className="bg-white p-10 rounded-4xl border border-border shadow-sm space-y-4 hover:shadow-saas transition-shadow">
                        <TrendingUp className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-extrabold">Market size</h3>
                        <p className="text-muted-foreground font-medium italic">$250B+ Creator Economy growing at 15% CAGR.</p>
                    </div>
                    <div className="bg-white p-10 rounded-4xl border border-border shadow-sm space-y-4 hover:shadow-saas transition-shadow">
                        <Users className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-extrabold">Early Traction</h3>
                        <p className="text-muted-foreground font-medium italic">500+ Qualified creators on waitlist for Q1 Launch.</p>
                    </div>
                    <div className="bg-white p-10 rounded-4xl border border-border shadow-sm space-y-4 hover:shadow-saas transition-shadow">
                        <ShieldCheck className="w-8 h-8 text-primary" />
                        <h3 className="text-xl font-extrabold">Moat</h3>
                        <p className="text-muted-foreground font-medium italic">Native IPFS fulfillment + Sovereign Smart Contracts.</p>
                    </div>
                </div>

                {/* Qualified Investors Learn More Section */}
                <div className="bg-slate-950 rounded-[4rem] p-12 md:p-24 overflow-hidden relative border border-white/5">
                    <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/10 to-transparent pointer-events-none" />
                    <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none" />

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 relative z-10">
                        <div className="space-y-12">
                            <div className="space-y-6">
                                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-white/5 text-slate-400 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-white/10 italic">
                                    Next Generation Infrastructure
                                </div>
                                <h2 className="text-5xl md:text-6xl font-black text-white leading-tight">
                                    Qualified Investors <span className="text-primary italic">Learn More.</span>
                                </h2>
                                <p className="text-xl text-slate-400 font-medium italic leading-relaxed">
                                    We are building the sovereign rail for the next billion creators. Join us in returning control to the hands of builders.
                                </p>
                            </div>

                            <div className="space-y-8">
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <Calendar className="w-6 h-6 text-primary" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">Book a Deep Dive</h4>
                                        <p className="text-slate-500 font-medium">Schedule a direct session with our founder to review the technical roadmap.</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-6">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                                        <ShieldCheck className="w-6 h-6 text-emerald-400" />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black uppercase tracking-widest text-sm mb-1">Data Room Access</h4>
                                        <p className="text-slate-500 font-medium">Comprehensive financial models, legal structures, and regulatory audits available on request.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white/5 border border-white/10 rounded-[3rem] p-8 md:p-12 space-y-8 backdrop-blur-xl">
                            <div className="space-y-2">
                                <h3 className="text-2xl font-black text-white italic">Get in Touch</h3>
                                <p className="text-slate-500 text-sm font-medium uppercase tracking-[0.1em]">Complete the form to request a meeting</p>
                            </div>

                            <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); toast.success("Message sent! We'll be in touch soon."); }}>
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="First Name"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-bold"
                                        required
                                    />
                                    <input
                                        type="text"
                                        placeholder="Last Name"
                                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-bold"
                                        required
                                    />
                                </div>
                                <input
                                    type="email"
                                    placeholder="Work Email"
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-bold"
                                    required
                                />
                                <select
                                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-1 focus:ring-primary/50 transition-all font-bold appearance-none cursor-pointer"
                                    defaultValue=""
                                    required
                                >
                                    <option value="" disabled>Select Interest</option>
                                    <option value="investment">Initial Investment</option>
                                    <option value="partnership">Strategic Partnership</option>
                                    <option value="technical">Technical Deep-dive</option>
                                    <option value="other">Other</option>
                                </select>

                                <div className="pt-4">
                                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mb-4 ml-2">Preferred Meeting Window</h4>
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Morning', 'Afternoon', 'Evening'].map((time) => (
                                            <button
                                                key={time}
                                                type="button"
                                                onClick={(e) => {
                                                    const btns = e.currentTarget.parentElement?.querySelectorAll('button');
                                                    btns?.forEach(b => b.classList.remove('bg-primary', 'text-primary-foreground', 'border-primary'));
                                                    e.currentTarget.classList.add('bg-primary', 'text-primary-foreground', 'border-primary');
                                                }}
                                                className="py-3 px-2 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-white/20 transition-all"
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <button
                                    type="submit"
                                    className="w-full py-5 bg-white text-slate-950 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-primary hover:text-white transition-all shadow-saas mt-6"
                                >
                                    Request Access & Meeting
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
