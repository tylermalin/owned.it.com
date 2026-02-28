'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageSquare, ShieldCheck, Globe, Zap } from 'lucide-react';
import { AuthButton } from '@/components/AuthButton';

export default function ContactPage() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        org: '',
        message: ''
    });

    return (
        <div className="min-h-screen bg-white flex flex-col font-sans">
            {/* Header */}
            <header className="bg-white/80 border-b border-border sticky top-0 z-50 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-6 py-[10px] flex justify-between items-center">
                    <Link href="/" className="py-2">
                        <img src="/assets/logo.png" alt="OWNED" className="w-[120px] h-[120px] object-contain" />
                    </Link>
                    <div className="flex items-center gap-6">
                        <Link href="/pricing" className="text-sm font-bold uppercase tracking-widest text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                            <ArrowLeft className="w-4 h-4" /> Back to Pricing
                        </Link>
                        <AuthButton />
                    </div>
                </div>
            </header>

            <main className="flex-1 flex flex-col items-center py-24 px-6">
                <div className="max-w-4xl w-full text-center space-y-8 mb-20">
                    <div className="inline-block px-4 py-1.5 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-slate-200">
                        Enterprise Inquiry
                    </div>
                    <h1 className="text-6xl md:text-7xl font-black tracking-tighter leading-tight">
                        Protocol Infrastructure, <br />
                        <span className="text-primary italic">Custom Built.</span>
                    </h1>
                    <p className="text-2xl text-muted-foreground font-medium max-w-2xl mx-auto leading-relaxed italic">
                        Deploy dedicated IPFS infrastructure, custom fee routing, and white-labeled frontends for your organization.
                    </p>
                </div>

                <div className="max-w-6xl w-full grid grid-cols-1 lg:grid-cols-2 gap-20 items-stretch">
                    {/* Visual/Text Side */}
                    <div className="bg-slate-50 rounded-[4rem] p-12 md:p-16 border border-slate-100 flex flex-col justify-between space-y-12">
                        <div className="space-y-12">
                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                                    <Globe className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Dedicated Infrastructure</h3>
                                    <p className="text-muted-foreground font-medium">Global IPFS pinning and custom node isolation for your digital assets.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                                    <ShieldCheck className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Organization Controls</h3>
                                    <p className="text-muted-foreground font-medium">Multi-sig integration, role-based access, and advanced analytics exports.</p>
                                </div>
                            </div>
                            <div className="flex gap-6 items-start">
                                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-slate-200 flex items-center justify-center shrink-0">
                                    <Zap className="w-6 h-6 text-primary" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="text-xl font-bold">Custom Fee Models</h3>
                                    <p className="text-muted-foreground font-medium">White-labeled pricing, custom on-chain fee splits, and native token support.</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-12 border-t border-slate-200">
                            <p className="text-sm font-bold text-slate-400 italic">"Sovereign infrastructure for the world's largest content orgs."</p>
                        </div>
                    </div>

                    {/* Form Side */}
                    <div className="space-y-10 py-4">
                        <h2 className="text-3xl font-black tracking-tight">Tell us about your project</h2>
                        <form className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</label>
                                    <input
                                        type="text"
                                        placeholder="James Smith"
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-border text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</label>
                                    <input
                                        type="email"
                                        placeholder="james@org.com"
                                        className="w-full px-6 py-4 rounded-2xl bg-white border border-border text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Organization / Brand</label>
                                <input
                                    type="text"
                                    placeholder="e.g. Media Corp"
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-border text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all"
                                    value={formData.org}
                                    onChange={(e) => setFormData({ ...formData, org: e.target.value })}
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">Project Details</label>
                                <textarea
                                    placeholder="How can OWNED help your organization scale?"
                                    rows={5}
                                    className="w-full px-6 py-4 rounded-2xl bg-white border border-border text-foreground font-bold placeholder:text-muted-foreground/30 focus:outline-none focus:ring-4 focus:ring-primary/5 transition-all resize-none"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>

                            <button
                                type="button"
                                className="w-full py-6 bg-foreground text-background rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-saas hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-3"
                            >
                                <MessageSquare className="w-4 h-4" /> Send Inquiry
                            </button>
                        </form>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="py-20 border-t border-slate-100 bg-white">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-[10px] font-black text-slate-300 tracking-[0.5em] uppercase">Built for the future of ownership</p>
                </div>
            </footer>
        </div>
    );
}
