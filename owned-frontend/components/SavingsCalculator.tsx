'use client';

import { useState } from 'react';
import { Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';

export function SavingsCalculator() {
    const [monthlyRevenue, setMonthlyRevenue] = useState(5000);
    const [avgOrderValue, setAvgOrderValue] = useState(50);

    const gumroadFee = 0.10; // 10%
    const ownedFee = 0.03;   // 3%

    const gumroadCost = monthlyRevenue * gumroadFee;
    const ownedCost = monthlyRevenue * ownedFee;
    const monthlySavings = gumroadCost - ownedCost;
    const annualSavings = monthlySavings * 12;

    return (
        <div id="savings-calculator" className="py-24 bg-slate-900 border-y border-white/5 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                    <div className="space-y-10">
                        <div className="space-y-6">
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.3em] rounded-full border border-primary/20">
                                <Sparkles className="w-3 h-3" /> Stop Overpaying
                            </div>
                            <h2 className="text-5xl lg:text-6xl font-black text-white leading-tight tracking-tight">
                                Save thousands in <span className="text-primary italic">platform fees</span>.
                            </h2>
                            <p className="text-xl text-slate-400 font-medium leading-relaxed max-w-xl">
                                Gumroad and Shopify take up to 10% of your revenue. We take 3% (flat). Use the calculator to see the difference.
                            </p>
                        </div>

                        <div className="space-y-12 bg-white/5 backdrop-blur-xl p-10 rounded-[3rem] border border-white/10">
                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Monthly Revenue</label>
                                    <span className="text-2xl font-black text-primary italic">${monthlyRevenue.toLocaleString()}</span>
                                </div>
                                <input
                                    type="range"
                                    min="500"
                                    max="50000"
                                    step="500"
                                    value={monthlyRevenue}
                                    onChange={(e) => setMonthlyRevenue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>$500</span>
                                    <span>$50,000+</span>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <label className="text-xs font-black uppercase tracking-widest text-slate-400">Avg. Product Price</label>
                                    <span className="text-2xl font-black text-primary italic">${avgOrderValue}</span>
                                </div>
                                <input
                                    type="range"
                                    min="10"
                                    max="500"
                                    step="10"
                                    value={avgOrderValue}
                                    onChange={(e) => setAvgOrderValue(parseInt(e.target.value))}
                                    className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                                    <span>$10</span>
                                    <span>$500</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="relative">
                        <div className="bg-white rounded-[4rem] p-12 lg:p-16 space-y-12 shadow-saas-lg border border-border">
                            <div className="text-center space-y-2">
                                <h3 className="text-xs font-black uppercase tracking-[0.3em] text-muted-foreground">Your Annual Savings</h3>
                                <p className="text-7xl lg:text-8xl font-black text-primary tracking-tighter italic">
                                    ${annualSavings.toLocaleString()}
                                </p>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center justify-between p-6 bg-slate-50 rounded-3xl border border-border">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center">
                                            <TrendingUp className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-slate-600">Gumroad Fees (10%)</span>
                                    </div>
                                    <span className="text-lg font-black text-red-600">${(gumroadCost * 12).toLocaleString()}</span>
                                </div>

                                <div className="flex items-center justify-between p-6 bg-emerald-50 rounded-3xl border-2 border-emerald-200">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
                                            <ShieldCheck className="w-5 h-5" />
                                        </div>
                                        <span className="font-bold text-emerald-900">OWNED Fees (3%)</span>
                                    </div>
                                    <span className="text-lg font-black text-emerald-600">${(ownedCost * 12).toLocaleString()}</span>
                                </div>
                            </div>

                            <div className="pt-6">
                                <button className="w-full py-6 bg-slate-950 text-white rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all">
                                    Keep Your Profits →
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
