import { Nav } from '@/components/Nav';
import Link from 'next/link';

export default function InvestorPortal() {
    return (
        <div className="min-h-screen bg-slate-950 text-white selection:bg-primary/30">
            <Nav />

            <main className="relative pt-48 pb-32 overflow-hidden px-6">
                {/* Dark Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1000px] bg-[radial-gradient(circle_at_center,rgba(0,97,255,0.08)_0%,transparent_70%)] pointer-events-none" />

                <div className="max-w-4xl mx-auto relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.2em] mb-12 border border-primary/20">
                        Investor Portal
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-[0.9] mb-8">
                        Sovereign Commerce <br />
                        <span className="text-primary italic font-serif italic">Infrastructure.</span>
                    </h1>

                    <p className="text-xl md:text-2xl text-slate-400 font-medium italic mb-16 leading-relaxed">
                        Creators are facing an existential crisis: platform dependence.
                        OWNEDit is building the self-custodial infrastructure that returns
                        ownership of code, content, and customers to the people who create the value.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-xl font-bold italic text-primary">The Vision</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                A world where commerce is a protocol, not a platform. No middlemen,
                                no payment holds, and no deplatforming risk.
                            </p>
                        </div>
                        <div className="p-8 rounded-3xl bg-white/5 border border-white/10 space-y-4">
                            <h3 className="text-xl font-bold italic text-primary">The Traction</h3>
                            <p className="text-sm text-slate-400 leading-relaxed font-medium">
                                Fully functional V1 live on Base Sepolia. Creators are already
                                deploying their own storefront contracts and accepting USDC.
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <Link
                            href="/investors/deck"
                            className="w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-3xl font-black uppercase tracking-[0.3em] text-sm shadow-saas hover:scale-105 active:scale-95 transition-all text-center"
                        >
                            View Pitch Deck
                        </Link>
                        <Link
                            href="/contact"
                            className="w-full sm:w-auto px-12 py-6 bg-white/5 text-white border border-white/10 rounded-3xl font-black uppercase tracking-[0.3em] text-sm hover:bg-white/10 transition-all text-center"
                        >
                            Contact Founder
                        </Link>
                    </div>
                </div>
            </main>

            {/* Metrics Snapshot */}
            <section className="py-24 border-t border-white/10 bg-black/40">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12 text-center">
                    <div className="space-y-1">
                        <p className="text-4xl font-black tracking-tighter">$300B</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Creator Economy TAM</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black tracking-tighter">100%</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Custody Controlled by Creator</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black tracking-tighter">0%</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Platform Fees Taken</p>
                    </div>
                    <div className="space-y-1">
                        <p className="text-4xl font-black tracking-tighter">Base</p>
                        <p className="text-[10px] font-black uppercase tracking-widest text-slate-500">Native Infrastructure</p>
                    </div>
                </div>
            </section>

            <footer className="py-20 border-t border-white/10 text-center">
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-slate-600 mb-4">OWNED · IT INFRASTRUCTURE</p>
                <p className="text-xs text-slate-500">© 2026 · Confidential & Proprietary</p>
            </footer>
        </div>
    );
}
