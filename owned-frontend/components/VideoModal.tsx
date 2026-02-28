'use client';

import { useState, useEffect } from 'react';
import { X, Play, ShieldCheck, Zap, Globe } from 'lucide-react';

interface VideoModalProps {
    isOpen: boolean;
    onClose: () => void;
}

export function VideoModal({ isOpen, onClose }: VideoModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);

    useEffect(() => {
        setIsMounted(true);
        if (isOpen) {
            document.body.style.overflow = 'hidden';
            // Auto play simulation after a delay
            const timer = setTimeout(() => setIsPlaying(true), 1000);
            return () => clearTimeout(timer);
        } else {
            document.body.style.overflow = 'unset';
            setIsPlaying(false);
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isMounted || !isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8 animate-in fade-in duration-500">
            {/* Backdrop */}
            <div
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-2xl"
                onClick={onClose}
            />

            {/* Modal Content */}
            <div className="relative w-full max-w-6xl bg-white rounded-[3.5rem] shadow-[0_0_100px_rgba(0,0,0,0.5)] overflow-hidden border border-white/20 animate-in zoom-in-95 duration-500">
                {/* Close Button */}
                <button
                    onClick={onClose}
                    className="absolute top-8 right-8 z-50 p-4 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-2xl text-white border border-white/20 transition-all hover:scale-110 active:scale-95 group"
                >
                    <X className="w-6 h-6 group-hover:rotate-90 transition-transform duration-300" />
                </button>

                {/* Video Player Area */}
                <div
                    className="aspect-video bg-slate-900 relative group cursor-pointer overflow-hidden"
                    onClick={() => setIsPlaying(!isPlaying)}
                >
                    {/* High-Fidelity Poster/Background */}
                    <img
                        src="/assets/demo_video_poster.png"
                        alt="Demo Poster"
                        className={`absolute inset-0 w-full h-full object-cover transition-all duration-1000 ${isPlaying ? 'scale-105 blur-sm opacity-40' : 'scale-100 blur-0 opacity-100'}`}
                    />

                    {/* Simulation Overlay */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center space-y-8 p-12 text-center text-white z-10">
                        {!isPlaying && (
                            <div className="w-28 h-28 bg-primary rounded-full flex items-center justify-center shadow-[0_0_60px_rgba(var(--primary-rgb),0.6)] group-hover:scale-110 transition-transform duration-500">
                                <Play className="w-12 h-12 fill-current ml-1" />
                            </div>
                        )}

                        <div className={`transition-all duration-700 delay-300 ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                            <div className="space-y-4 max-w-2xl bg-black/20 backdrop-blur-md p-10 rounded-4xl border border-white/10">
                                <h1 className="text-4xl md:text-6xl font-black tracking-tighter italic leading-none">THE PROTOCOL<br />IN ACTION</h1>
                                <p className="text-xl text-slate-300 font-medium italic">Deploying sovereign commerce infrastructure on Base. Zero middlemen, instant payouts, total control.</p>

                                {/* Feature Overlay for Demo Effect */}
                                <div className="grid grid-cols-3 gap-8 mt-12 w-full pt-12 border-t border-white/10">
                                    <div className="space-y-3">
                                        <ShieldCheck className="w-8 h-8 text-primary mx-auto" />
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Verified Onchain</div>
                                    </div>
                                    <div className="space-y-3">
                                        <Zap className="w-8 h-8 text-primary mx-auto" />
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Instant USDC</div>
                                    </div>
                                    <div className="space-y-3">
                                        <Globe className="w-8 h-8 text-primary mx-auto" />
                                        <div className="text-[10px] font-black uppercase tracking-widest opacity-80">Sovereign Store</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Progress Bar Simulation */}
                    <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-white/10 overflow-hidden">
                        <div
                            className={`h-full bg-primary shadow-[0_0_20px_rgba(var(--primary-rgb),1)] transition-all duration-[120000] linear ${isPlaying ? 'w-full' : 'w-0'}`}
                        />
                    </div>

                    {/* Darkening Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 pointer-events-none" />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-950/40 via-transparent to-transparent opacity-60 pointer-events-none" />
                </div>

                {/* Info Bar */}
                <div className="p-10 bg-slate-50 flex flex-col md:flex-row items-center justify-between gap-8">
                    <div className="flex items-center gap-6">
                        <div className="p-4 bg-white rounded-3xl border border-border shadow-sm">
                            <img src="/assets/logo.png" className="h-8 w-auto" alt="Logo" />
                        </div>
                        <div>
                            <div className="text-lg font-black text-slate-900 italic tracking-tight">Deployment & Sales Walkthrough (2:14)</div>
                            <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">Featuring OWNED Protocol v1.0.4</div>
                        </div>
                    </div>
                    <button
                        onClick={() => window.location.href = '/pricing'}
                        className="px-10 py-5 bg-slate-900 text-white rounded-2xl text-sm font-black uppercase tracking-[0.2em] hover:bg-primary transition-all hover:scale-105 shadow-saas"
                    >
                        START DEPLOYING NOW
                    </button>
                </div>
            </div>
        </div>
    );
}
